"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleContractorStatus(id: number) {
  const contractor = await prisma.contractor.findUnique({
    where: {
      id,
    },
  });

  if (!contractor) return;

  await prisma.contractor.update({
    where: {
      id,
    },
    data: {
      isActive: !contractor.isActive,
    },
  });

  revalidatePath("/contractors");
}

import { redirect } from "next/navigation";

export async function updateContractor(
  contractorId: number,
  formData: FormData
) {
  const name = formData.get("name")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const address = formData.get("address")?.toString().trim();
  const remarks = formData.get("remarks")?.toString().trim();

  if (!name) {
    throw new Error("Name is required");
  }

  await prisma.contractor.update({
    where: { id: contractorId },
    data: {
      name,
      phone: phone || null,
      address: address || null,
      remarks: remarks || null,
    },
  });

  revalidatePath("/contractors");
  revalidatePath(`/contractors/${contractorId}`);

  redirect(`/contractors/${contractorId}`);
}