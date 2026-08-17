import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function ChemicalInventoryPage() {
  await requirePermission("MANAGE_PRODUCTION");

  const entries = await prisma.chemicalInventory.findMany({
    orderBy: {
      date: "desc",
    },
  });

  // ---------------- SAFE CALCULATIONS ----------------

  let totalStock = 0;

  for (const entry of entries) {
    totalStock += entry.type === "IN"
      ? entry.weight
      : -entry.weight;
  }

  const totalChemicals = new Set(
    entries.map((e) => e.chemical)
  ).size;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Chemical Inventory
          </h1>
          <p className="text-gray-500">
            Track factory chemical stock.
          </p>
        </div>

        <Link
          href="/chemical-inventory/new"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Add Entry
        </Link>
      </div>

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">
            Total Stock
          </p>
          <p className="mt-2 text-2xl font-bold">
            {totalStock.toFixed(2)} kg
          </p>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">
            Chemical Types
          </p>
          <p className="mt-2 text-2xl font-bold">
            {totalChemicals}
          </p>
        </div>

        <div className="rounded-lg border-2 border-green-500 bg-white p-4">
          <p className="text-sm text-gray-500">
            Entries
          </p>
          <p className="mt-2 text-2xl font-bold text-green-600">
            {entries.length}
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Chemical</th>
              <th className="p-3 text-left">Weight</th>
              <th className="p-3 text-left">Supplier</th>
              <th className="p-3 text-left">Remarks</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td
                  colSpan={7} // ✅ FIXED (you had wrong earlier)
                  className="p-6 text-center text-gray-500"
                >
                  No chemical entries found.
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry.id} className="border-t">
                  <td className="p-3">
                    {entry.date.toLocaleDateString("en-IN")}
                  </td>

                  <td className="p-3 font-medium">
                    {entry.chemical}
                  </td>

                  <td className="p-3">
                    {entry.weight.toFixed(2)} kg
                  </td>

                  <td className="p-3">
                    {entry.supplier ?? "-"}
                  </td>

                  <td className="p-3">
                    {entry.remarks ?? "-"}
                  </td>

                  <td
                    className={`p-3 font-medium ${
                      entry.type === "IN"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {entry.type === "IN"
                      ? "IN (+)"
                      : "OUT (-)"}
                  </td>

                  <td className="p-3">
                    <Link
                      href={`/chemical-inventory/${entry.id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}