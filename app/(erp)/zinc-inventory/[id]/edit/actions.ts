"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { logActivity } from "@/lib/activity";
import { ZincTransactionType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateZincEntry(formData: FormData) {
  const user = await requirePermission("MANAGE_PRODUCTION");

  const id = Number(formData.get("id"));
  const type = formData.get("type") as ZincTransactionType;
  const weight = Number(formData.get("weight"));

  const rawRate = formData.get("ratePerKg");
  const rawSupplier = formData.get("supplier");

  const remarks = formData.get("remarks")?.toString().trim();

  if (!id) {
    throw new Error("Invalid entry ID.");
  }

  if (!type) {
    throw new Error("Transaction type is required.");
  }

  if (!weight || weight <= 0) {
    throw new Error("Weight must be greater than 0.");
  }

  let ratePerKg: number | null = null;
  let supplier: string | null = null;

  // BUSINESS RULES
  if (type === ZincTransactionType.PURCHASE) {
    ratePerKg = rawRate ? Number(rawRate) : null;

    if (!ratePerKg || ratePerKg <= 0) {
      throw new Error("Rate per kg is required for purchase.");
    }

    supplier = rawSupplier?.toString().trim() || null;
  }

  if (type === ZincTransactionType.ADJUSTMENT) {
    ratePerKg = null;
    supplier = null;
  }

  await prisma.zincInventory.update({
    where: { id },
    data: {
      type,
      weight,
      ratePerKg,
      supplier,
      remarks: remarks || null,
    },
  });

  await logActivity(
    user.id,
    "ZINC_ENTRY_UPDATED",
    `${type} - ${weight} kg (ID: ${id})`
  );

  revalidatePath("/zinc-inventory");
  redirect("/zinc-inventory");
}