import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

export default async function ContractorRatesPage() {
    await requirePermission("MANAGE_PRODUCTION");

    const rates = await prisma.contractorRate.findMany({
        include: {
            contractor: true,
            itemCategory: true,
            size: true, // ← Add this
        },
        orderBy: [
            {
                contractor: {
                    name: "asc",
                },
            },
            {
                itemCategory: {
                    name: "asc",
                },
            },

            {
                effectiveFrom: "desc",
            },
        ],
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        Contractor Rates
                    </h1>

                    <p className="text-gray-500">
                        Manage contractor galvanizing rates.
                    </p>
                </div>

                <Link
                    href="/contractor-rates/new"
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    + Add Rate
                </Link>
            </div>

            <div className="overflow-hidden rounded-lg border bg-white">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">
                                Contractor
                            </th>

                            <th className="p-3 text-left">
                                Category
                            </th>

                            <th className="p-3 text-left">
                                Size
                            </th>

                            <th className="p-3 text-right">
                                Rate / Kg
                            </th>

                            <th className="p-3 text-left">
                                Effective From
                            </th>

                            <th className="p-3 text-left">
                                Status
                            </th>

                            <th className="p-3 text-right">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {rates.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="p-6 text-center text-gray-500"
                                >
                                    No contractor rates found.
                                </td>
                            </tr>
                        ) : (
                            rates.map((rate) => (
                                <tr
                                    key={rate.id}
                                    className="border-t"
                                >
                                    <td className="p-3 font-medium">
                                        {rate.contractor.name}
                                    </td>

                                    <td className="p-3">
                                        {rate.itemCategory.name}
                                    </td>

                                    <td className="p-3">
                                        {rate.size?.name ?? "-"}
                                    </td>

                                    <td className="p-3 text-right">
                                        ₹ {rate.ratePerKg.toFixed(2)}
                                    </td>

                                    <td className="p-3">
                                        {rate.effectiveFrom.toLocaleDateString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </td>

                                    <td className="p-3">
                                        {rate.isActive ? (
                                            <span className="rounded bg-green-100 px-2 py-1 text-sm text-green-700">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="rounded bg-red-100 px-2 py-1 text-sm text-red-700">
                                                Inactive
                                            </span>
                                        )}
                                    </td>

                                    <td className="p-3 text-right">
                                        <Link
                                            href={`/contractor-rates/${rate.id}/edit`}
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