"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateChemicalEntry(
  id: number,
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
    throw new Error("Invalid type.");
  }

  await prisma.$transaction(async (tx) => {
    // ---------------- GET EXISTING ENTRY ----------------

    const existing = await tx.chemicalInventory.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error("Entry not found.");
    }

    // ---------------- GET ALL ENTRIES FOR THIS CHEMICAL ----------------

    const allEntries = await tx.chemicalInventory.findMany({
      where: { chemical: existing.chemical },
    });

    // ---------------- CALCULATE CURRENT STOCK ----------------

    let currentStock = 0;

    for (const e of allEntries) {
      currentStock += e.type === "IN" ? e.weight : -e.weight;
    }

    // ---------------- REMOVE OLD ENTRY EFFECT ----------------

    if (existing.type === "IN") {
      currentStock -= existing.weight;
    } else {
      currentStock += existing.weight;
    }

    // ---------------- APPLY NEW ENTRY EFFECT ----------------

    if (type === "IN") {
      currentStock += weight;
    } else {
      currentStock -= weight;
    }

    // ---------------- STOCK VALIDATION ----------------

    if (currentStock < 0) {
      throw new Error(
        "Insufficient stock. Cannot update entry."
      );
    }

    // ---------------- UPDATE ENTRY ----------------

    await tx.chemicalInventory.update({
      where: { id },
      data: {
        chemical,
        weight,
        supplier: supplier || null,
        remarks: remarks || null,
        type,
      },
    });

    // ---------------- ACTIVITY LOG ----------------

    await logActivity(
      user.id,
      "CHEMICAL_ENTRY_UPDATED",
      `OLD: ${existing.chemical} - ${existing.weight} kg (${existing.type}) | NEW: ${chemical} - ${weight} kg (${type})`
    );
  });

  revalidatePath("/chemical-inventory");
  redirect("/chemical-inventory");
}