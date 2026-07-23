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
              select: {
                id: true,
                itemName: true,
                size: true,
                pendingProductionWeight: true,
                readyWeight: true,
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
                  Pending
                </th>

                <th className="p-2 text-left">
                  Ready
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
                    {item.inputWeight} kg
                  </td>
                  <td className="p-2">
                    {item.challanItem.pendingProductionWeight} kg
                  </td>

                  <td className="p-2">
                    {item.challanItem.readyWeight} kg
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
      {/* Production Summary */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">
          Production Summary
        </h2>

        {(() => {
          const totalAssigned = batch.items.reduce(
            (sum, item) => sum + item.inputWeight,
            0
          );

          const completedItems = batch.items.filter(
            (item) => item.completedAt
          ).length;

          const pendingItems =
            batch.items.length - completedItems;

          const completedWeight = batch.items
            .filter((item) => item.completedAt)
            .reduce(
              (sum, item) => sum + item.inputWeight,
              0
            );

          const pendingWeight =
            totalAssigned - completedWeight;

          const completionPercentage =
            totalAssigned === 0
              ? 0
              : (
                (completedWeight / totalAssigned) *
                100
              ).toFixed(1);

          return (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-gray-500">
                  Total Assigned
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {totalAssigned} kg
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-gray-500">
                  Completed Weight
                </p>

                <p className="mt-2 text-2xl font-bold text-green-600">
                  {completedWeight} kg
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-gray-500">
                  Remaining Weight
                </p>

                <p className="mt-2 text-2xl font-bold text-orange-600">
                  {pendingWeight} kg
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-gray-500">
                  Completed Items
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {completedItems}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-gray-500">
                  Pending Items
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {pendingItems}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-gray-500">
                  Completion
                </p>

                <p className="mt-2 text-2xl font-bold text-blue-600">
                  {completionPercentage}%
                </p>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
