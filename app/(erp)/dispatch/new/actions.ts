"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

type TruckItem = {
    id: number;
    inputWeight: number;
    outputWeight: number;
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
            if (item.inputWeight <= 0) {
                throw new Error(
                    "Input weight must be greater than zero."
                );
            }

            if (item.outputWeight <= 0) {
                throw new Error(
                    "Output weight must be greater than zero."
                );
            }

            if (item.inputWeight > challanItem.readyWeight) {
                throw new Error(
                    `Only ${challanItem.readyWeight} kg is ready for dispatch for ${challanItem.itemName}.`
                );
            }

            const remainingReadyWeight =
                challanItem.readyWeight - item.inputWeight;

            await tx.dispatchItem.create({
                data: {
                    dispatchId: dispatch.id,
                    challanItemId: item.id,
                    inputWeight: item.inputWeight,
                    outputWeight: item.outputWeight,
                },
            });

            await tx.challanItem.update({
                where: {
                    id: item.id,
                },
                data: {
                    readyWeight: remainingReadyWeight,
                    status:
                        remainingReadyWeight <= 0
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