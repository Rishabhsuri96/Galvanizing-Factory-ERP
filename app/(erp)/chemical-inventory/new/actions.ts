"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createChemicalEntry(
  formData: FormData
) {
  const user = await requirePermission("MANAGE_PRODUCTION");

  // ---------------- INPUT PARSING ----------------

  const chemical = formData
    .get("chemical")
    ?.toString()
    .trim()
    .toUpperCase();

  const weight = Number(formData.get("weight"));

  const supplier = formData
    .get("supplier")
    ?.toString()
    .trim();

  const remarks = formData
    .get("remarks")
    ?.toString()
    .trim();

  const type = formData.get("type")?.toString();

  // ---------------- VALIDATION ----------------

  if (!chemical) {
    throw new Error("Chemical is required.");
  }

  if (!weight || weight <= 0) {
    throw new Error("Weight must be greater than 0.");
  }

  if (type !== "IN" && type !== "OUT") {
    throw new Error("Invalid entry type.");
  }

  await prisma.$transaction(async (tx) => {
    // ---------------- CALCULATE CURRENT STOCK ----------------

    const existingEntries = await tx.chemicalInventory.findMany({
      where: { chemical },
    });

    let currentStock = 0;

    for (const e of existingEntries) {
      currentStock += e.type === "IN" ? e.weight : -e.weight;
    }

    // ---------------- APPLY NEW ENTRY ----------------

    if (type === "OUT") {
      if (currentStock < weight) {
        throw new Error(
          "Insufficient stock. Cannot perform OUT entry."
        );
      }
    }

    // ---------------- CREATE ENTRY ----------------

    await tx.chemicalInventory.create({
      data: {
        chemical,
        weight,
        type,
        supplier: supplier || null,
        remarks: remarks || null,
        date: new Date(),
      },
    });

    // ---------------- ACTIVITY LOG ----------------

    await logActivity(
      user.id,
      "CHEMICAL_ENTRY_CREATED",
      `${chemical} - ${weight} kg (${type})`
    );
  });

  revalidatePath("/chemical-inventory");
  redirect("/chemical-inventory");
}