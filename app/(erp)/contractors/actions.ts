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