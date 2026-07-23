"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

export async function createItemCategory(
  formData: FormData
) {
  await requirePermission("MANAGE_PRODUCTION");

  const name = formData
    .get("name")
    ?.toString()
    .trim();

  const isActive = true;

  if (!name) {
    throw new Error("Category name is required.");
  }

  const existing =
    await prisma.itemCategory.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

  if (existing) {
    throw new Error(
      "Category already exists."
    );
  }

  await prisma.itemCategory.create({
    data: {
      name,
      isActive,
    },
  });

  redirect("/item-categories");
}