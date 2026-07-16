import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { toggleContractorStatus } from "./actions";

export default async function ContractorsPage() {
    const contractors = await prisma.contractor.findMany({
        orderBy: {
            name: "asc",
        },
        include: {
            rates: true,
        },
    });

    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-3xl font-bold">
                        Contractor Master
                    </h1>

                    <p className="text-gray-500">
                        Manage all furnace contractors
                    </p>
                </div>

                <Link
                    href="/contractors/new"
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    + Add Contractor
                </Link>

            </div>

            <div className="rounded-lg border bg-white p-4">

                <p className="text-sm text-gray-500">
                    Total Contractors
                </p>

                <p className="text-3xl font-bold">
                    {contractors.length}
                </p>

            </div>

            <div className="overflow-hidden rounded-lg border bg-white">

                {contractors.length === 0 ? (

                    <div className="p-6">
                        No contractors found.
                    </div>

                ) : (

                    <table className="w-full">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="p-3 text-left">
                                    Contractor
                                </th>

                                <th className="p-3 text-left">
                                    Phone
                                </th>

                                <th className="p-3 text-left">
                                    Status
                                </th>

                                <th className="p-3 text-left">
                                    Current Rates
                                </th>

                                <th className="p-3 text-left">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {contractors.map((contractor) => (

                                <tr
                                    key={contractor.id}
                                    className="border-t"
                                >

                                    <td className="p-3">
                                        {contractor.name}
                                    </td>

                                    <td className="p-3">
                                        {contractor.phone ?? "-"}
                                    </td>

                                    <td className="p-3">

                                        <span
                                            className={
                                                contractor.isActive
                                                    ? "font-medium text-green-600"
                                                    : "font-medium text-red-600"
                                            }
                                        >
                                            {contractor.isActive ? "Active" : "Disabled"}
                                        </span>

                                    </td>

                                    <td className="p-3">

                                        {contractor.rates.length === 0
                                            ? "No rates"
                                            : `${contractor.rates.length} Rates`}

                                    </td>

                                    <td className="p-3">

                                        <div className="flex gap-3">

                                            <Link
                                                href={`/contractors/${contractor.id}`}
                                                className="rounded bg-blue-600 px-3 py-2 text-white"
                                            >
                                                View
                                            </Link>

                                            <Link
                                                href={`/contractors/${contractor.id}/edit`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <Link
                                                href={`/contractors/${contractor.id}/rates`}
                                                className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                                            >
                                                Manage Rates
                                            </Link>

                                            <form
                                                action={async () => {
                                                    "use server";
                                                    await toggleContractorStatus(contractor.id);
                                                }}
                                            >
                                                <button
                                                    className={
                                                        contractor.isActive
                                                            ? "rounded bg-red-600 px-3 py-2 text-white"
                                                            : "rounded bg-green-600 px-3 py-2 text-white"
                                                    }
                                                >
                                                    {contractor.isActive
                                                        ? "Disable"
                                                        : "Enable"}
                                                </button>
                                            </form>

                                        </div>

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