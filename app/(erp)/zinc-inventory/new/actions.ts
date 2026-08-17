"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { logActivity } from "@/lib/activity";
import { ZincTransactionType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createZincEntry(formData: FormData) {
  const user = await requirePermission("MANAGE_PRODUCTION");

  const type = formData.get("type") as ZincTransactionType;
  const weight = Number(formData.get("weight"));

  const rawRate = formData.get("ratePerKg");
  const rawSupplier = formData.get("supplier");

  const remarks = formData.get("remarks")?.toString().trim();

  // ✅ TYPE VALIDATION
  if (!type) {
    throw new Error("Transaction type is required.");
  }

  // ✅ WEIGHT VALIDATION
  if (!weight || weight <= 0) {
    throw new Error("Weight must be greater than 0.");
  }

  let ratePerKg: number | null = null;
  let supplier: string | null = null;

  // ✅ BUSINESS LOGIC
  if (type === ZincTransactionType.PURCHASE) {
    // Only for purchase
    ratePerKg = rawRate ? Number(rawRate) : null;

    if (!ratePerKg || ratePerKg <= 0) {
      throw new Error("Rate per kg is required for purchase.");
    }

    supplier = rawSupplier?.toString().trim() || null;
  }

  if (type === ZincTransactionType.ADJUSTMENT) {
    // OUT entry → no rate, no supplier
    ratePerKg = null;
    supplier = null;
  }

  // ✅ CREATE ENTRY
  await prisma.zincInventory.create({
    data: {
      type,
      weight,
      ratePerKg,
      supplier,
      remarks: remarks || null,
    },
  });

  // ✅ ACTIVITY LOG
  await logActivity(
    user.id,
    "ZINC_ENTRY_CREATED",
    `${type} - ${weight} kg`
  );

  revalidatePath("/zinc-inventory");
  redirect("/zinc-inventory");
}