"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createContractorRate(
  formData: FormData
) {
  await requirePermission("MANAGE_PRODUCTION");

  const contractorId = Number(formData.get("contractorId"));
  const itemCategoryId = Number(formData.get("itemCategoryId"));
  const sizeId = Number(formData.get("sizeId"));
  const ratePerKg = Number(formData.get("ratePerKg"));

  const effectiveFromValue = formData.get("effectiveFrom");

  const isActive = formData.get("isActive") === "on";

  if (
    Number.isNaN(contractorId) ||
    Number.isNaN(itemCategoryId) ||
    Number.isNaN(sizeId) ||
    Number.isNaN(ratePerKg) ||
    !effectiveFromValue
  ) {
    throw new Error("Please fill all required fields.");
  }

  if (ratePerKg <= 0) {
    throw new Error("Rate must be greater than zero.");
  }

  const effectiveFrom = new Date(
    effectiveFromValue.toString()
  );

  const [contractor, category, size] = await Promise.all([
    prisma.contractor.findUnique({
      where: {
        id: contractorId,
      },
    }),

    prisma.itemCategory.findUnique({
      where: {
        id: itemCategoryId,
      },
    }),

    prisma.size.findUnique({
      where: {
        id: sizeId,
      },
    }),
  ]);

  if (!contractor) {
    throw new Error("Invalid contractor.");
  }

  if (!category) {
    throw new Error("Invalid category.");
  }

  if (!size) {
    throw new Error("Invalid size.");
  }

  if (size.itemCategoryId !== itemCategoryId) {
    throw new Error(
      "Selected size does not belong to the selected category."
    );
  }

  const existingRate =
    await prisma.contractorRate.findFirst({
      where: {
        contractorId,
        itemCategoryId,
        sizeId,
        effectiveFrom,
      },
    });

  if (existingRate) {
    throw new Error(
      "A rate already exists for the selected contractor, category, size and effective date."
    );
  }

  await prisma.contractorRate.create({
    data: {
      contractorId,
      itemCategoryId,
      sizeId,
      ratePerKg,
      effectiveFrom,
      isActive,
    },
  });

  revalidatePath("/contractor-rates");

  redirect("/contractor-rates");
}