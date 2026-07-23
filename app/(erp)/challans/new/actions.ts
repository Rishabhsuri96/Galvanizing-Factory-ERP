"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

type ItemInput = {
  itemCategoryId: string;
  size: string;
  customSize?: string;
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
  const activeCategories =
    await prisma.itemCategory.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
      },
    });
  const activeCategoryIds = new Set(
    activeCategories.map(
      (category) => category.id
    )
  );
  const validItems = items
    .map((item) => {
      const size =
        item.size === "Other"
          ? item.customSize?.trim()
          : item.size?.trim();

      return {
        itemCategoryId: Number(
          item.itemCategoryId
        ),
        size,
        itemName: item.itemName.trim(),
        receivedWeight: Number(
          item.weight
        ),
      };
    })
    .filter(
      (item) =>
        item.itemCategoryId > 0 &&
        activeCategoryIds.has(
          item.itemCategoryId
        ) &&
        !!item.size &&
        item.itemName !== "" &&
        item.receivedWeight > 0
    );

  if (!partyId || validItems.length === 0) {
    return;
  }

  const totalWeight = validItems.reduce(
    (sum, item) =>
      sum + item.receivedWeight,
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
      itemCategoryId: item.itemCategoryId,
      size: item.size,

      receivedWeight: item.receivedWeight,

      pendingProductionWeight:
        item.receivedWeight,

      readyWeight: 0,

      status: "RECEIVED",

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
