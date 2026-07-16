"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createContractor(formData: FormData) {
  const name = formData.get("name")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";
  const address = formData.get("address")?.toString().trim() ?? "";
  const remarks = formData.get("remarks")?.toString().trim() ?? "";

  if (!name) {
    throw new Error("Contractor name is required.");
  }

  const exists = await prisma.contractor.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });

  if (exists) {
    throw new Error("Contractor already exists.");
  }

  await prisma.contractor.create({
    data: {
      name,
      phone: phone || null,
      address: address || null,
      remarks: remarks || null,
    },
  });

  revalidatePath("/contractors");
  redirect("/contractors");
}