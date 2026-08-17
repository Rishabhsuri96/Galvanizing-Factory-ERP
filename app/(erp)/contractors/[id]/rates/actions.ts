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

    const sizeName =
      sizeOption === "Other"
        ? customSize
        : sizeOption;

    const value = formData
      .get(`category-${category.id}-rate`)
      ?.toString()
      .trim();

    if (!sizeName || !value) {
      continue;
    }

    const newRate = Number(value);

    if (!Number.isFinite(newRate) || newRate < 0) {
      continue;
    }

    // Find the size belonging to this category.
    // If it doesn't exist, create it.
    let size = await prisma.size.findFirst({
      where: {
        itemCategoryId: category.id,
        name: sizeName,
      },
    });

    if (!size) {
      size = await prisma.size.create({
        data: {
          name: sizeName,
          itemCategoryId: category.id,
          isActive: true,
        },
      });
    }

    const activeRate =
      await prisma.contractorRate.findFirst({
        where: {
          contractorId,
          itemCategoryId: category.id,
          sizeId: size.id,
          isActive: true,
        },
        orderBy: {
          effectiveFrom: "desc",
        },
      });

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
        sizeId: size.id,
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
        sizeId: size.id,
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