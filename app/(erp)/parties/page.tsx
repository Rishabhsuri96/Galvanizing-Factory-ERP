import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
    togglePartyStatus,
} from "./actions";


export default async function PartiesPage() {
    const parties = await prisma.party.findMany({
        orderBy: {
            partyName: "asc",
        },
    });

    return (
        <div className="space-y-6">

            {/* Header Section */}
            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-3xl font-bold">
                        Party Master
                    </h1>

                    <p className="text-gray-500">
                        Manage all customers and vendors
                    </p>
                </div>

                <Link
                    href="/parties/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    + Add Party
                </Link>

            </div>

            {/* Summary Card */}

            <div className="bg-white border rounded-lg p-4">

                <p className="text-sm text-gray-500">
                    Total Parties
                </p>

                <p className="text-3xl font-bold">
                    {parties.length}
                </p>

            </div>

            {/* Table Section */}

            <div className="bg-white border rounded-lg overflow-hidden">

                {parties.length === 0 ? (
                    <div className="p-6">
                        No parties found.
                    </div>
                ) : (
                    <table className="w-full">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="text-left p-3">
                                    Party Name
                                </th>

                                <th className="text-left p-3">
                                    GST Number
                                </th>

                                <th className="text-left p-3">
                                    Phone
                                </th>

                                <th className="text-left p-3">
                                    Contact Person
                                </th>

                                <th className="text-left p-3">
                                    Status
                                </th>

                                <th className="text-left p-3">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {parties.map((party) => (
                                <tr
                                    key={party.id}
                                    className="border-t"
                                >

                                    <td className="p-3">
                                        {party.partyName}
                                    </td>

                                    <td className="p-3">
                                        {party.gstNumber}
                                    </td>

                                    <td className="p-3">
                                        {party.phone}
                                    </td>

                                    <td className="p-3">
                                        {party.contactPerson}
                                    </td>
                                    <td className="p-3">
                                        <span
                                            className={
                                                party.isActive
                                                    ? "inline-block w-20 font-medium text-green-600"
                                                    : "inline-block w-20 font-medium text-red-600"
                                            }
                                        >
                                            {party.isActive
                                                ? "Active"
                                                : "Disabled"}
                                        </span>
                                    </td>

                                    <td className="p-3">

                                        <div className="flex items-center gap-3">

                                            <Link
                                                href={`/parties/${party.id}/edit`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Edit
                                            </Link>

                                            <Link
                                                href={`/parties/${party.id}`}
                                                className="rounded bg-blue-600 px-3 py-2 text-white"
                                            >
                                                View
                                            </Link>

                                            <form
                                                action={async () => {
                                                    "use server";

                                                    await togglePartyStatus(
                                                        party.id
                                                    );
                                                }}
                                            >
                                                <button
                                                    type="submit"
                                                    className={
                                                        party.isActive
                                                            ? "w-24 rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                                                            : "w-24 rounded bg-green-600 px-3 py-2 text-white hover:bg-green-700"
                                                    }
                                                >
                                                    {party.isActive
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