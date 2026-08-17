"use server";

import { ItemStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function completeProductionItem(
    productionItemId: number,
    formData: FormData
) {
    const user =
        await requirePermission("MANAGE_PRODUCTION");

    const outputWeight = Number(
        formData.get("outputWeight")
    );

    const remarks = formData
        .get("remarks")
        ?.toString()
        .trim();

    if (!outputWeight || outputWeight <= 0) {
        throw new Error("Invalid output weight.");
    }

    let batchId = 0;

    await prisma.$transaction(async (tx) => {
        const productionItem =
            await tx.productionBatchItem.findUnique({
                where: {
                    id: productionItemId,
                },

                include: {
                    productionBatch: true,

                    challanItem: {
                        include: {
                            challan: true,
                            itemCategory: true,
                        },
                    },
                },
            });

        if (!productionItem) {
            throw new Error(
                "Production item not found."
            );
        }

        if (productionItem.completedAt) {
            throw new Error(
                "Production item is already completed."
            );
        }

        if (
            outputWeight <
            productionItem.inputWeight
        ) {
            throw new Error(
                "Output weight cannot be less than input weight."
            );
        }

        const challanItem =
            productionItem.challanItem;

        if (!challanItem.itemCategoryId) {
            throw new Error(
                "Item category is required."
            );
        }

        const zincAddedWeight =
            outputWeight -
            productionItem.inputWeight;

        const zincPercentage =
            (zincAddedWeight /
                productionItem.inputWeight) *
            100;

        // Size lookup will be added later after ChallanItem
        // is migrated to use sizeId.
        const contractorRate =
            await tx.contractorRate.findFirst({
                where: {
                    contractorId:
                        productionItem.productionBatch
                            .contractorId,

                    itemCategoryId:
                        challanItem.itemCategoryId,

                    isActive: true,
                },

                orderBy: {
                    effectiveFrom: "desc",
                },
            });

        const rate =
            contractorRate?.ratePerKg ?? 0;

        const contractorAmount =
            rate *
            productionItem.inputWeight;

        const newPendingWeight =
            challanItem.pendingProductionWeight -
            productionItem.inputWeight;

        const newReadyWeight =
            challanItem.readyWeight +
            outputWeight;

        await tx.productionBatchItem.update({
            where: {
                id: productionItem.id,
            },

            data: {
                outputWeight,
                zincAddedWeight,
                zincPercentage,
                contractorRate: rate,
                contractorAmount,
                remarks: remarks || null,
                completedAt: new Date(),
            },
        });
        const latestAdjustment =
            await tx.zincInventory.findFirst({
                where: {
                    type: "ADJUSTMENT",
                },
                orderBy: {
                    date: "desc",
                },
            });

        await tx.zincInventory.create({
            data: {
                type: "ADJUSTMENT",
                weight: -zincAddedWeight,
                remarks: `Consumed in Batch ${productionItem.productionBatch.batchNo}`,
            },
        });

        await tx.challanItem.update({
            where: {
                id: challanItem.id,
            },

            data: {
                pendingProductionWeight:
                    newPendingWeight,

                readyWeight:
                    newReadyWeight,

                status:
                    newPendingWeight === 0
                        ? ItemStatus.READY
                        : ItemStatus.PARTIALLY_PRODUCED,
            },
        });

        await logActivity(
            user.id,
            "PRODUCTION_COMPLETED",
            `Completed ${productionItem.inputWeight} kg of ${challanItem.itemName} in batch ${productionItem.productionBatch.batchNo}`
        );

        batchId =
            productionItem.productionBatchId;
    });

    revalidatePath(
        `/production/${batchId}`
    );

    revalidatePath("/production");

    redirect(
        `/production/${batchId}`
    );
}