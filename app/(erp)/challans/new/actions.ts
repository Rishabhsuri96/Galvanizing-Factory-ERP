"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

type ItemInput = {
  itemName: string;
  weight: string;
};

export async function createChallan(
  formData: FormData
) {
  const partyId = Number(
    formData.get("partyId")
  );

  const challanNumber =
    formData.get("challanNumber") as string;

  const vehicleNumber =
    formData.get("vehicleNumber") as string;

  const ewayNumber =
    formData.get("ewayNumber") as string;

  const receivedDate =
    formData.get("receivedDate") as string;

  const itemsJson =
    formData.get("items") as string;


  const items =
    JSON.parse(itemsJson) as ItemInput[];
  const validItems = items.filter(
    (item) =>
      item.itemName.trim() !== "" &&
      Number(item.weight) > 0
  );

  const totalWeight = validItems.reduce(
    (sum, item) =>
      sum + (Number(item.weight) || 0),
    0
  );

  const challan = await prisma.challan.create({
    data: {
      partyId,
      challanNumber,
      vehicleNumber:
        vehicleNumber || null,
      ewayNumber:
        ewayNumber || null,
      receivedDate: new Date(
        receivedDate
      ),
      receivedWeight: totalWeight,
    },
  });

  await prisma.challanItem.createMany({
    data: validItems.map((item) => ({
      itemName: item.itemName,
      receivedWeight: Number(
        item.weight
      ),
      currentWeight: Number(
        item.weight
      ),
      challanId: challan.id,
    })),
  });
  const cookieStore =
    await cookies();

  const token =
    cookieStore.get("session")?.value;

  if (token) {
    const payload =
      await verifyToken(token);

    await logActivity(
      Number(payload.userId),
      "CHALLAN_CREATED",
      `Created challan ${challanNumber}`
    );
  }
  redirect("/challans");
}