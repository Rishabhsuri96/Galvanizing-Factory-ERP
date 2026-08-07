"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

export async function createSize(formData: FormData) {
  await requirePermission("MANAGE_PRODUCTION");

  const name = formData
    .get("name")
    ?.toString()
    .trim();

  const itemCategoryId = Number(
    formData.get("itemCategoryId")
  );

  const isActive = true;

  if (!name) {
    throw new Error("Size name is required.");
  }

  if (!itemCategoryId || Number.isNaN(itemCategoryId)) {
    throw new Error("Category is required.");
  }

  // Make sure category exists
  const category = await prisma.itemCategory.findUnique({
    where: {
      id: itemCategoryId,
    },
  });

  if (!category) {
    throw new Error("Selected category does not exist.");
  }

  // Prevent duplicate size within same category
  const existing = await prisma.size.findFirst({
    where: {
      itemCategoryId,
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });

  if (existing) {
    throw new Error(
      "This size already exists for the selected category."
    );
  }

  await prisma.size.create({
    data: {
      name,
      itemCategoryId,
      isActive,
    },
  });

  redirect("/sizes");
}