"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

export async function updateItemCategory(
  formData: FormData
) {
  await requirePermission("MANAGE_PRODUCTION");

  const id = Number(formData.get("id"));

  const name = formData
    .get("name")
    ?.toString()
    .trim();

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
        NOT: {
          id,
        },
      },
    });

  if (existing) {
    throw new Error(
      "Category already exists."
    );
  }

  await prisma.itemCategory.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });

  redirect("/item-categories");
}