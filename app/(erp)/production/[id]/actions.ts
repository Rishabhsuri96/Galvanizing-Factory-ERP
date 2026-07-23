"use server";

import { ItemStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/current-user";

export async function completeProductionItem(
  productionItemId: number,
  remarks?: string
) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  let batchId!: number;

  await prisma.$transaction(async (tx) => {
    const productionItem =
      await tx.productionBatchItem.findUnique({
        where: {
          id: productionItemId,
        },
        include: {
          challanItem: true,
          productionBatch: true,
        },
      });

    if (!productionItem) {
      throw new Error("Production item not found.");
    }

    if (productionItem.completedAt) {
      throw new Error(
        "Production item is already completed."
      );
    }

    const challanItem = productionItem.challanItem;

    if (
      productionItem.inputWeight >
      challanItem.pendingProductionWeight
    ) {
      throw new Error(
        "Input weight exceeds pending production weight."
      );
    }

    const newPendingWeight =
      challanItem.pendingProductionWeight -
      productionItem.inputWeight;

    const newReadyWeight =
      challanItem.readyWeight +
      productionItem.inputWeight;

    await tx.productionBatchItem.update({
      where: {
        id: productionItem.id,
      },
      data: {
        remarks,
        completedAt: new Date(),
      },
    });

    await tx.challanItem.update({
      where: {
        id: challanItem.id,
      },
      data: {
        pendingProductionWeight:
          newPendingWeight,

        readyWeight: newReadyWeight,

        status:
          newPendingWeight === 0
            ? ItemStatus.READY
            : ItemStatus.PARTIALLY_PRODUCED,
      },
    });

    await tx.activityLog.create({
      data: {
        userId: user.id,
        action: "COMPLETE_PRODUCTION_ITEM",
        details: `Completed ${productionItem.inputWeight} kg of ${challanItem.itemName} in batch ${productionItem.productionBatch.batchNo}.`,
      },
    });

    batchId = productionItem.productionBatchId;
  });

  revalidatePath(`/production/${batchId}`);
}