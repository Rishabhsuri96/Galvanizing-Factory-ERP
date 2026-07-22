"use server";

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
    const productionItem = await tx.productionBatchItem.findUnique({
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
      throw new Error("Production item is already completed.");
    }


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
        id: productionItem.challanItemId,
      },
      data: {
        status: "READY",
      },
    });
    await tx.activityLog.create({
      data: {
        userId: user.id,
        action: "COMPLETE_PRODUCTION_ITEM",
        details: `Marked ${productionItem.challanItem.itemName} as READY in batch ${productionItem.productionBatch.batchNo}.`,
      },
    });
    batchId = productionItem.productionBatchId;



  });
  revalidatePath(`/production/${batchId}`);
}