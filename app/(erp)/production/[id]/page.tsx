import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import CompleteButton from "./CompleteButton";
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
        items: {
          include: {
            challanItem: {
              include: {
                itemCategory: true,
                challan: {
                  include: {
                    party: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
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

      <div className="flex justify-end">
        <Link
          href={`/production/${batch.id}/add-item`}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Add Production Item
        </Link>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">
          Assigned Production Items
        </h2>

        {batch.items.length === 0 ? (
          <p className="text-gray-500">
            No items added yet.
          </p>
        ) : (
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="p-2 text-left">
                  Party
                </th>

                <th className="p-2 text-left">
                  Challan
                </th>

                <th className="p-2 text-left">
                  Item
                </th>

                <th className="p-2 text-left">
                  Category
                </th>

                <th className="p-2 text-left">
                  Size
                </th>

                <th className="p-2 text-left">
                  Assigned Weight
                </th>

                <th className="p-2 text-left">
                  Status
                </th>
                <th className="p-2 text-left">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {batch.items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b"
                >
                  <td className="p-2">
                    {item.challanItem.challan.party.partyName}
                  </td>

                  <td className="p-2">
                    {item.challanItem.challan.challanNumber}
                  </td>

                  <td className="p-2">
                    {item.challanItem.itemName}
                  </td>

                  <td className="p-2">
                    {item.challanItem.itemCategory?.name ?? "-"}
                  </td>

                  <td className="p-2">
                    {item.challanItem.size ?? "-"}
                  </td>

                  <td className="p-2">
                    {item.processedWeight} kg
                  </td>

                  <td className="p-2">
                    {item.completedAt ? (
                      <span className="rounded bg-green-100 px-2 py-1 text-sm text-green-700">
                        Completed
                      </span>
                    ) : (
                      <span className="rounded bg-yellow-100 px-2 py-1 text-sm text-yellow-700">
                        In Production
                      </span>
                    )}
                  </td>
                  <td className="p-2">
                    {item.completedAt ? (
                      <span className="text-gray-500">
                        —
                      </span>
                    ) : (
                      <CompleteButton productionItemId={item.id} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
