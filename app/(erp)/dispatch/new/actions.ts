"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

type TruckItem = {
    id: number;
    weight: number;
};

export async function createDispatch(
    vehicleNumber: string,
    remarks: string,
    truckItems: TruckItem[]
) {
    if (!vehicleNumber.trim()) {
        throw new Error("Vehicle number is required");
    }

    if (truckItems.length === 0) {
        throw new Error("Add at least one item");
    }
    let dispatchId = 0;
    await prisma.$transaction(async (tx) => {
        const dispatch = await tx.dispatch.create({
            data: {
                vehicleNumber,
                remarks,
            },
        });
        dispatchId = dispatch.id;

        for (const item of truckItems) {
            const challanItem =
                await tx.challanItem.findUnique({
                    where: {
                        id: item.id,
                    },
                });

            if (!challanItem) {
                throw new Error("Material not found");
            }

            const remainingWeight =
                challanItem.currentWeight - item.weight;

            if (remainingWeight < 0) {
                throw new Error(
                    `Insufficient weight available for ${challanItem.itemName}`
                );
            }

            await tx.dispatchItem.create({
                data: {
                    dispatchId: dispatch.id,
                    challanItemId: item.id,
                    dispatchedWeight: item.weight,
                },
            });

            await tx.challanItem.update({
                where: {
                    id: item.id,
                },
                data: {
                    currentWeight: remainingWeight,
                    status:
                        remainingWeight <= 0
                            ? "COMPLETED"
                            : "PARTIALLY_DISPATCHED",
                },
            });
        }
    });
    const cookieStore =
        await cookies();

    const token =
        cookieStore.get("session")?.value;

    if (token) {
        const payload =
            await verifyToken(token);

        await logActivity(
            Number(payload.userId),
            "DISPATCH_CREATED",
            `Created dispatch #${dispatchId} (${vehicleNumber})`
        );
    }
}