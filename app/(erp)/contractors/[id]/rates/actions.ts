"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveRates(
    contractorId: number,
    formData: FormData
) {
    const categories = await prisma.itemCategory.findMany({
        where: {
            isActive: true,
        },
    });

    for (const category of categories) {
        const sizeOption = formData
            .get(`category-${category.id}-size`)
            ?.toString()
            .trim();

        const customSize = formData
            .get(`category-${category.id}-custom-size`)
            ?.toString()
            .trim();

        const size =
            sizeOption === "Other"
                ? customSize
                : sizeOption;

        const value = formData
            .get(`category-${category.id}-rate`)
            ?.toString()
            .trim();

        if (!size || !value) continue;

        const newRate = Number(value);

        if (Number.isNaN(newRate)) continue;

        const activeRate =
            await prisma.contractorRate.findFirst({
                where: {
                    contractorId,
                    itemCategoryId: category.id,
                    size,
                    isActive: true,
                },
                orderBy: {
                    effectiveFrom: "desc",
                },
            });

        // No change
        if (
            activeRate &&
            activeRate.ratePerKg === newRate
        ) {
            continue;
        }

        await prisma.contractorRate.updateMany({
            where: {
                contractorId,
                itemCategoryId: category.id,
                size,
                isActive: true,
            },
            data: {
                isActive: false,
            },
        });

        await prisma.contractorRate.create({
            data: {
                contractorId,
                itemCategoryId: category.id,
                size,
                ratePerKg: newRate,
                effectiveFrom: new Date(),
                isActive: true,
            },
        });
    }

    revalidatePath(`/contractors/${contractorId}`);
    revalidatePath(`/contractors/${contractorId}/rates`);
    redirect(`/contractors/${contractorId}`);
}
