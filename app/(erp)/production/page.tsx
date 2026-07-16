import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

export default async function ProductionPage() {
  await requirePermission("MANAGE_PRODUCTION");

  const batches =
    await prisma.productionBatch.findMany({
      include: {
        contractor: true,
        furnace: true,
        items: true,
      },
      orderBy: {
        processDate: "desc",
      },
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Production
          </h1>

          <p className="text-gray-500">
            Manage production batches
          </p>
        </div>

        <Link
          href="/production/new"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + New Batch
        </Link>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <p className="text-sm text-gray-500">
          Total Batches
        </p>

        <p className="text-3xl font-bold">
          {batches.length}
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white">
        {batches.length === 0 ? (
          <div className="p-6">
            No production batches found.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">
                  Batch No
                </th>

                <th className="p-3 text-left">
                  Date
                </th>

                <th className="p-3 text-left">
                  Contractor
                </th>

                <th className="p-3 text-left">
                  Furnace
                </th>

                <th className="p-3 text-left">
                  Shift
                </th>

                <th className="p-3 text-left">
                  Items Count
                </th>

                <th className="p-3 text-left">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {batches.map((batch) => (
                <tr
                  key={batch.id}
                  className="border-t"
                >
                  <td className="p-3">
                    {batch.batchNo}
                  </td>

                  <td className="p-3">
                    {batch.processDate.toLocaleDateString()}
                  </td>

                  <td className="p-3">
                    {batch.contractor.name}
                  </td>

                  <td className="p-3">
                    {batch.furnace.name}
                  </td>

                  <td className="p-3">
                    {batch.shift}
                  </td>

                  <td className="p-3">
                    {batch.items.length}
                  </td>

                  <td className="p-3">
                    <Link
                      href={`/production/${batch.id}`}
                      className="rounded bg-blue-600 px-3 py-2 text-white"
                    >
                      View
                    </Link>
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
