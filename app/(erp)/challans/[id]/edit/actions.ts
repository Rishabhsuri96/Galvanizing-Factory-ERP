"use server";

import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { verifyToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type ItemInput = {
  itemCategoryId: string;
  size: string;
  customSize?: string;
  itemName: string;
  weight: string;
};

export async function updateChallan(
  challanId: number,
  formData: FormData
) {
  const partyId = Number(
    formData.get("partyId")
  );
  const challanNumber =
    formData.get("challanNumber")?.toString().trim();
  const vehicleNumber =
    formData.get("vehicleNumber")?.toString().trim();
  const ewayNumber =
    formData.get("ewayNumber")?.toString().trim();
  const receivedDate =
    formData.get("receivedDate")?.toString();
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

  if (
    !partyId ||
    !challanNumber ||
    !receivedDate ||
    validItems.length === 0
  ) {
    return;
  }

  const challan =
    await prisma.challan.findUnique({
      where: {
        id: challanId,
      },
      include: {
        items: {
          include: {
            dispatchItems: true,
            productionItems: true,
          },
        },
      },
    });

  if (!challan) {
    return;
  }

  const hasStartedWork =
    challan.items.some(
      (item) =>
        item.dispatchItems.length > 0 ||
        item.productionItems.length > 0
    );

  if (hasStartedWork) {
    redirect(`/challans/${challanId}`);
  }

  const totalWeight = validItems.reduce(
    (sum, item) =>
      sum + item.receivedWeight,
    0
  );

  await prisma.$transaction(async (tx) => {
    await tx.challan.update({
      where: {
        id: challanId,
      },
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

    await tx.challanItem.deleteMany({
      where: {
        challanId,
      },
    });

    await tx.challanItem.createMany({
      data: validItems.map((item) => ({
        challanId,
        itemName: item.itemName,
        itemCategoryId:
          item.itemCategoryId,
        size: item.size,
        receivedWeight:
          item.receivedWeight,
        pendingProductionWeight:
          item.receivedWeight,
      })),
    });
  });

  const token =
    (await cookies()).get("session")?.value;

  if (token) {
    const payload =
      await verifyToken(token);

    await logActivity(
      Number(payload.userId),
      "CHALLAN_UPDATED",
      `Updated challan ${challanNumber}`
    );
  }

  revalidatePath("/challans");
  revalidatePath(`/challans/${challanId}`);
  redirect(`/challans/${challanId}`);
}
