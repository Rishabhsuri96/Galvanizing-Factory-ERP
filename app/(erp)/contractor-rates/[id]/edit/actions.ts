"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateContractorRate(
  formData: FormData
) {
  await requirePermission("MANAGE_PRODUCTION");

  const id = Number(formData.get("id"));
  const contractorId = Number(formData.get("contractorId"));
  const itemCategoryId = Number(formData.get("itemCategoryId"));
  const sizeId = Number(formData.get("sizeId"));
  const ratePerKg = Number(formData.get("ratePerKg"));

  const effectiveFromValue =
    formData.get("effectiveFrom");

  const isActive =
    formData.get("isActive") === "on";

  if (
    Number.isNaN(id) ||
    Number.isNaN(contractorId) ||
    Number.isNaN(itemCategoryId) ||
    Number.isNaN(sizeId) ||
    Number.isNaN(ratePerKg) ||
    !effectiveFromValue
  ) {
    throw new Error("Invalid form data.");
  }

  if (ratePerKg <= 0) {
    throw new Error(
      "Rate must be greater than zero."
    );
  }

  const effectiveFrom = new Date(
    effectiveFromValue.toString()
  );

  const existing =
    await prisma.contractorRate.findUnique({
      where: {
        id,
      },
    });

  if (!existing) {
    throw new Error(
      "Contractor rate not found."
    );
  }

  const duplicate =
    await prisma.contractorRate.findFirst({
      where: {
        contractorId,
        itemCategoryId,
        sizeId,
        effectiveFrom,
        NOT: {
          id,
        },
      },
    });

  if (duplicate) {
    throw new Error(
      "A contractor rate already exists for the selected values."
    );
  }

  await prisma.contractorRate.update({
    where: {
      id,
    },
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