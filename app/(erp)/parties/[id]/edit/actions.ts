"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function updateParty(
  id: number,
  formData: FormData
) {
  const partyName = formData.get(
    "partyName"
  ) as string;

  const gstNumber = formData.get(
    "gstNumber"
  ) as string;

  const phone = formData.get(
    "phone"
  ) as string;

  const email = formData.get(
    "email"
  ) as string;

  const address = formData.get(
    "address"
  ) as string;

  const contactPerson = formData.get(
    "contactPerson"
  ) as string;

  await prisma.party.update({
    where: {
      id,
    },
    data: {
      partyName,
      gstNumber,
      phone,
      email,
      address,
      contactPerson,
    },
  });

  redirect("/parties");
}