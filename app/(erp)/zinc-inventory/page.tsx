import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { ZincTransactionType } from "@prisma/client";

export default async function ZincInventoryPage() {
    await requirePermission("MANAGE_PRODUCTION");

    const entries = await prisma.zincInventory.findMany({
        orderBy: {
            date: "desc",
        },
    });

    // ✅ Calculate totals
    const purchased = entries
        .filter((e) => e.type === ZincTransactionType.PURCHASE)
        .reduce((sum, e) => sum + e.weight, 0);

    const used = entries
        .filter((e) => e.type === ZincTransactionType.ADJUSTMENT)
        .reduce((sum, e) => sum + e.weight, 0);

    const currentStock = purchased - used;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Zinc Inventory</h1>
                    <p className="text-gray-500">
                        Track zinc purchases, usage, and stock.
                    </p>
                </div>

                <Link
                    href="/zinc-inventory/new"
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    + Add Entry
                </Link>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                {/* Purchased */}
                <div className="rounded-lg border bg-white p-4">
                    <p className="text-sm text-gray-500">Total Added</p>
                    <p className="mt-2 text-2xl font-bold text-green-600">
                        {purchased.toFixed(2)} kg
                    </p>
                </div>

                {/* Used */}
                <div className="rounded-lg border bg-white p-4">
                    <p className="text-sm text-gray-500">Used / Removed</p>
                    <p className="mt-2 text-2xl font-bold text-red-600">
                        {used.toFixed(2)} kg
                    </p>
                </div>

                {/* Current Stock */}
                <div className="rounded-lg border bg-white p-4 border-green-500 border-2">
                    <p className="text-sm text-gray-500">Current Stock</p>
                    <p className="mt-2 text-2xl font-bold text-green-700">
                        {currentStock.toFixed(2)} kg
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border bg-white">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Type</th>
                            <th className="p-3 text-left">Weight</th>
                            <th className="p-3 text-left">Rate/Kg</th>
                            <th className="p-3 text-left">Supplier</th>
                            <th className="p-3 text-left">Remarks</th>
                            <th className="p-3 text-left">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {entries.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="p-6 text-center text-gray-500"
                                >
                                    No zinc entries found.
                                </td>
                            </tr>
                        ) : (
                            entries.map((entry) => (
                                <tr key={entry.id} className="border-t">
                                    {/* Date */}
                                    <td className="p-3">
                                        {entry.date.toLocaleDateString("en-IN")}
                                    </td>

                                    {/* Type */}
                                    <td className="p-3">
                                        {entry.type === ZincTransactionType.PURCHASE ? (
                                            <span className="font-medium text-green-600">
                                                IN
                                            </span>
                                        ) : (
                                            <span className="font-medium text-red-600">
                                                OUT
                                            </span>
                                        )}
                                    </td>

                                    {/* Weight */}
                                    <td className="p-3">
                                        {entry.weight.toFixed(2)} kg
                                    </td>

                                    {/* Rate */}
                                    <td className="p-3">
                                        {entry.ratePerKg
                                            ? `₹ ${entry.ratePerKg.toFixed(2)}`
                                            : "-"}
                                    </td>

                                    {/* Supplier */}
                                    <td className="p-3">
                                        {entry.supplier ?? "-"}
                                    </td>

                                    {/* Remarks */}
                                    <td className="p-3">
                                        {entry.remarks ?? "-"}
                                    </td>
                                    <td className="p-3">
                                        <Link
                                            href={`/zinc-inventory/${entry.id}/edit`}
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