import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function DispatchPage() {
    const dispatches = await prisma.dispatch.findMany({
        include: {
            items: true,
        },
        orderBy: {
            dispatchDate: "desc",
        },
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Dispatches</h1>

                <Link
                    href="/dispatch/new"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    + New Dispatch
                </Link>
            </div>

            {/* Summary */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="text-sm text-gray-500">Total Dispatches</h2>

                <p className="mt-2 text-3xl font-bold">
                    {dispatches.length}
                </p>
            </div>

            {/* Dispatch Table */}
            <div className="rounded-xl border bg-white shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="p-4 text-left">Date</th>
                            <th className="p-4 text-left">Vehicle</th>
                            <th className="p-4 text-left">Items</th>
                            <th className="p-4 text-left">Weight</th>
                            <th className="p-4 text-left">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {dispatches.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="p-8 text-center text-gray-500"
                                >
                                    No Dispatches Found
                                </td>
                            </tr>
                        ) : (
                            dispatches.map((dispatch) => {
                                const totalWeight = dispatch.items.reduce(
                                    (sum, item) => sum + item.dispatchedWeight,
                                    0
                                );

                                return (
                                    <tr
                                        key={dispatch.id}
                                        className="border-b"
                                    >
                                        <td className="p-4">
                                            {new Date(
                                                dispatch.dispatchDate
                                            ).toLocaleDateString()}
                                        </td>

                                        <td className="p-4">
                                            {dispatch.vehicleNumber || "-"}
                                        </td>

                                        <td className="p-4">
                                            {dispatch.items.length}
                                        </td>

                                        <td className="p-4">
                                            {totalWeight} kg
                                        </td>
                                        <td className="p-4">
                                            <Link
                                                href={`/dispatch/${dispatch.id}`}
                                                className="rounded bg-blue-600 px-3 py-2 text-white"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}