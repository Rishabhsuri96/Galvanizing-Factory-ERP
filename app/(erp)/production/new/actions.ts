"use server";

import { Shift } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { requirePermission } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function getNextBatchNo(
  latestBatchNo: string | null,
  year: number
) {
  const prefix = `PB-${year}-`;
  const latestSequence = latestBatchNo?.startsWith(prefix)
    ? Number(latestBatchNo.slice(prefix.length))
    : 0;

  const nextSequence =
    Number.isNaN(latestSequence)
      ? 1
      : latestSequence + 1;

  return `${prefix}${String(nextSequence).padStart(4, "0")}`;
}

export async function createProductionBatch(
  formData: FormData
) {
  const user =
    await requirePermission("MANAGE_PRODUCTION");

  const contractorId = Number(
    formData.get("contractorId")
  );
  const furnaceId = Number(
    formData.get("furnaceId")
  );
  const shift = formData
    .get("shift")
    ?.toString();
  const remarks = formData
    .get("remarks")
    ?.toString()
    .trim();

  if (
    !contractorId ||
    !furnaceId ||
    (shift !== Shift.DAY &&
      shift !== Shift.NIGHT)
  ) {
    return;
  }

  const [contractor, furnace] =
    await Promise.all([
      prisma.contractor.findFirst({
        where: {
          id: contractorId,
          isActive: true,
        },
        select: {
          id: true,
        },
      }),
      prisma.furnace.findFirst({
        where: {
          id: furnaceId,
          isActive: true,
        },
        select: {
          id: true,
        },
      }),
    ]);

  if (!contractor || !furnace) {
    return;
  }

  const year =
    new Date().getFullYear();
  const batchPrefix =
    `PB-${year}-`;

  const latestBatch =
    await prisma.productionBatch.findFirst({
      where: {
        batchNo: {
          startsWith: batchPrefix,
        },
      },
      orderBy: {
        batchNo: "desc",
      },
      select: {
        batchNo: true,
      },
    });

  const batchNo = getNextBatchNo(
    latestBatch?.batchNo ?? null,
    year
  );

  const batch =
    await prisma.productionBatch.create({
      data: {
        batchNo,
        contractorId,
        furnaceId,
        shift,
        remarks: remarks || null,
      },
    });

  await logActivity(
    user.id,
    "PRODUCTION_BATCH_CREATED",
    `Created Production Batch ${batch.batchNo}`
  );

  revalidatePath("/production");
  redirect(`/production/${batch.id}`);
}
