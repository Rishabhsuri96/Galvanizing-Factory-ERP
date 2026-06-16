"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function togglePartyStatus(
  id: number
) {
  const party =
    await prisma.party.findUnique({
      where: {
        id,
      },
    });

  if (!party) {
    return;
  }

  await prisma.party.update({
    where: {
      id,
    },
    data: {
      isActive: !party.isActive,
    },
  });

  revalidatePath("/parties");
}