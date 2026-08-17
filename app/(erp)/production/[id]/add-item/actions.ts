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
  const inputWeight = Number(formData.get("processedWeight"));

  if (
    !batchId ||
    !challanItemId ||
    !inputWeight ||
    inputWeight <= 0
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
        size: true,            
      },
    })
  ]);

  if (!batch || !challanItem) {
    throw new Error(
      "Production batch or challan item not found."
    );
  }

  const availableWeight =
    challanItem.pendingProductionWeight;

  if (inputWeight > availableWeight) {
    throw new Error(
      `Only ${availableWeight} kg is available for production.`
    );
  }
  const rate = await prisma.contractorRate.findFirst({
    where: {
      contractorId: batch.id
        ? (await prisma.productionBatch.findUnique({
          where: { id: batch.id },
          select: { contractorId: true },
        }))?.contractorId
        : undefined,
      itemCategoryId: challanItem.itemCategoryId,
      sizeId: challanItem.sizeId ?? null,
      isActive: true,
    },
    orderBy: {
      effectiveFrom: "desc",
    },
  });

  if (!rate) {
    throw new Error("No contractor rate found for this item");
  }
  try {
    await prisma.$transaction(async (tx) => {
      // Only merge with an item that is NOT completed
      const existingItem =
        await tx.productionBatchItem.findFirst({
          where: {
            productionBatchId: batch.id,
            challanItemId: challanItem.id,
            completedAt: null,
          },
        });

      if (existingItem) {
        await tx.productionBatchItem.update({
          where: {
            id: existingItem.id,
          },
          data: {
            inputWeight:
              existingItem.inputWeight + inputWeight,
            contractorRate: rate.ratePerKg,
            rateSourceId: rate.id,
          },
        });
      } else {
        await tx.productionBatchItem.create({
          data: {
            productionBatchId: batch.id,
            challanItemId: challanItem.id,
            inputWeight,
            contractorRate: rate.ratePerKg,
            rateSourceId: rate.id,
            contractorAmount: 0, // calculated on completion
          },
        });
      }

      // Assignment only changes status.
      // Inventory movement happens on completion.
      await tx.challanItem.update({
        where: {
          id: challanItem.id,
        },
        data: {
          status:
            challanItem.status === ItemStatus.RECEIVED
              ? ItemStatus.PARTIALLY_PRODUCED
              : challanItem.status,
        },
      });
    });

    await logActivity(
      user.id,
      "PRODUCTION_ITEM_ASSIGNED",
      `Assigned ${inputWeight} kg of ${challanItem.itemName}${challanItem.size?.name ? ` ${challanItem.size.name}` : ""
      } from Challan ${challanItem.challan.challanNumber} to Batch ${batch.batchNo}`
    );

    revalidatePath(`/production/${batch.id}`);
    revalidatePath(`/challans/${challanItem.challan.id}`);

    redirect(`/production/${batch.id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}