"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

export async function updateSize(
  formData: FormData
) {
  await requirePermission("MANAGE_PRODUCTION");

  const id = Number(formData.get("id"));

  const itemCategoryId = Number(
    formData.get("itemCategoryId")
  );

  const name = formData
    .get("name")
    ?.toString()
    .trim();

  const isActive =
    formData.get("isActive") === "true";

  // -----------------------------
  // Validation
  // -----------------------------

  if (!id || Number.isNaN(id)) {
    throw new Error("Invalid size.");
  }

  if (!itemCategoryId || Number.isNaN(itemCategoryId)) {
    throw new Error("Category is required.");
  }

  if (!name) {
    throw new Error("Size name is required.");
  }

  // -----------------------------
  // Check Category Exists
  // -----------------------------

  const category =
    await prisma.itemCategory.findUnique({
      where: {
        id: itemCategoryId,
      },
    });

  if (!category) {
    throw new Error(
      "Selected category does not exist."
    );
  }

  // -----------------------------
  // Duplicate Check
  // -----------------------------

  const existing =
    await prisma.size.findFirst({
      where: {
        itemCategoryId,
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
      "This size already exists in the selected category."
    );
  }

  // -----------------------------
  // Update
  // -----------------------------

  await prisma.size.update({
    where: {
      id,
    },
    data: {
      itemCategoryId,
      name,
      isActive,
    },
  });

  redirect("/sizes");
}