import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

export default async function ProductionBatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("MANAGE_PRODUCTION");

  const { id } = await params;

  const batch =
    await prisma.productionBatch.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        contractor: true,
        furnace: true,
        items: true,
      },
    });

  if (!batch) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {batch.batchNo}
          </h1>

          <p className="text-gray-500">
            Production Batch Details
          </p>
        </div>

        <Link
          href="/production"
          className="rounded bg-gray-800 px-4 py-2 text-white"
        >
          Back
        </Link>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">
          Batch Header
        </h2>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">
              Batch Number
            </p>

            <p className="font-medium">
              {batch.batchNo}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Date
            </p>

            <p className="font-medium">
              {batch.processDate.toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Contractor
            </p>

            <p className="font-medium">
              {batch.contractor.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Furnace
            </p>

            <p className="font-medium">
              {batch.furnace.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Shift
            </p>

            <p className="font-medium">
              {batch.shift}
            </p>
          </div>

          <div className="col-span-2">
            <p className="text-sm text-gray-500">
              Remarks
            </p>

            <p className="font-medium">
              {batch.remarks || "-"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">
          Production Items
        </h2>

        {batch.items.length === 0 ? (
          <p className="text-gray-500">
            No items added yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}
