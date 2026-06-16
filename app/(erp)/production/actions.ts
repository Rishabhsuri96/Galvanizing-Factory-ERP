"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleReady(
  itemId: number
) {
  const item =
    await prisma.challanItem.findUnique({
      where: {
        id: itemId,
      },
    });

  if (!item) {
    return;
  }

  const newStatus =
    item.status === "RECEIVED"
      ? "READY"
      : "RECEIVED";

  await prisma.challanItem.update({
    where: {
      id: itemId,
    },
    data: {
      status: newStatus,
    },
  });

  revalidatePath("/production");
}