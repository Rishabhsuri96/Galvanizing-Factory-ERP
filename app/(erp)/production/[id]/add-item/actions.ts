"use server";

import { ItemStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { requirePermission } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function assignProductionItem(
  batchId: number,
  formData: FormData
) {
  const user = await requirePermission("MANAGE_PRODUCTION");

  const challanItemId = Number(formData.get("challanItemId"));
  const processedWeight = Number(formData.get("processedWeight"));

  if (
  !batchId ||
  !challanItemId ||
  !processedWeight ||
  processedWeight <= 0
) {
  throw new Error("Please enter a valid weight.");
}

  const [batch, challanItem] = await Promise.all([
    prisma.productionBatch.findUnique({
      where: { id: batchId },
      select: {
        id: true,
        batchNo: true,
      },
    }),

    prisma.challanItem.findUnique({
      where: {
        id: challanItemId,
      },
      include: {
        challan: true,
      },
    }),
  ]);

  if (!batch || !challanItem) {
  throw new Error("Production batch or challan item not found.");
}

  // Current weight is already the available weight
  const availableWeight = challanItem.currentWeight;

  if (processedWeight > availableWeight) {
  throw new Error(
  `Only ${availableWeight} kg is available for production.`
);
}
try{
  await prisma.$transaction(async (tx) => {
    const existingItem =
      await tx.productionBatchItem.findFirst({
        where: {
          productionBatchId: batch.id,
          challanItemId: challanItem.id,
        },
      });

    if (existingItem) {
      await tx.productionBatchItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          processedWeight:
            existingItem.processedWeight +
            processedWeight,
        },
      });
    } else {
      await tx.productionBatchItem.create({
        data: {
          productionBatchId: batch.id,
          challanItemId: challanItem.id,
          processedWeight,
        },
      });
    }

    await tx.challanItem.update({
      where: {
        id: challanItem.id,
      },
      data: {
        currentWeight:
          availableWeight - processedWeight,
        status: ItemStatus.IN_PRODUCTION,
      },
    });
  });

  await logActivity(
    user.id,
    "PRODUCTION_ITEM_ASSIGNED",
    `Assigned ${processedWeight} kg of ${challanItem.itemName}${
      challanItem.size ? ` ${challanItem.size}` : ""
    } from Challan ${challanItem.challan.challanNumber} to Batch ${batch.batchNo}`
  );

  revalidatePath(`/production/${batch.id}`);
  revalidatePath(`/challans/${challanItem.challan.id}`);

  redirect(`/production/${batch.id}`);
}
catch (error) {

  console.error(error);

  throw error;
}
}