import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

import CompleteProductionForm from "./CompleteProductionForm";

export default async function CompleteProductionPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  await requirePermission("MANAGE_PRODUCTION");

  const { id } = await params;

  const productionItem =
    await prisma.productionBatchItem.findUnique({
      where: {
        id: Number(id),
      },

      include: {
        productionBatch: {
          include: {
            contractor: true,
          },
        },

        challanItem: {
          include: {
            challan: {
              include: {
                party: true,
              },
            },

            itemCategory: true,
            size: true,
          },
        },
      },
    });

  if (!productionItem) {
    notFound();
  }

  if (productionItem.completedAt) {
    notFound();
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Complete Production
          </h1>

          <p className="text-gray-500">
            Batch {productionItem.productionBatch.batchNo}
          </p>
        </div>

        <Link
          href={`/production/${productionItem.productionBatchId}`}
          className="rounded bg-gray-700 px-4 py-2 text-white"
        >
          Back
        </Link>
      </div>

      <CompleteProductionForm
        productionItem={productionItem}
      />
    </div>
  );
}