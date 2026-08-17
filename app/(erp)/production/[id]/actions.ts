"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function completeProductionItem(formData: FormData) {
  const productionItemId = Number(formData.get("productionItemId"));

  if (!productionItemId) return;

  const item = await prisma.productionBatchItem.findUnique({
    where: { id: productionItemId },
    include: {
      productionBatch: true,
      challanItem: {
        include: {
          itemCategory: true,
          size: true,
        },
      },
    },
  });

  if (!item) return;

  // 🔥 STEP 1: GET CONTRACTOR RATE
  const rate = await prisma.contractorRate.findFirst({
    where: {
      contractorId: item.productionBatch.contractorId,
      itemCategoryId: item.challanItem.itemCategoryId,
      sizeId: item.challanItem.sizeId ?? null,
      isActive: true,
    },
    orderBy: {
      effectiveFrom: "desc",
    },
  });

  if (!rate) {
    throw new Error("No contractor rate found");
  }

  // 🔥 STEP 2: CALCULATE AMOUNT
  const contractorAmount = item.inputWeight * rate.ratePerKg;

  // 🔥 STEP 3: UPDATE PRODUCTION ITEM
  await prisma.productionBatchItem.update({
    where: { id: item.id },
    data: {
      contractorRate: rate.ratePerKg,
      contractorAmount,
      rateSourceId: rate.id,
      completedAt: new Date(),
    },
  });

  // 🔥 STEP 4: UPDATE CHALLAN ITEM
  const outputWeight = item.outputWeight ?? item.inputWeight;

  await prisma.challanItem.update({
    where: { id: item.challanItemId },
    data: {
      pendingProductionWeight: {
        decrement: item.inputWeight,
      },
      readyWeight: {
        increment: outputWeight,
      },
    },
  });

  revalidatePath(`/production/${item.productionBatchId}`);
}