import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function PartyPage({
    params,
}: Props) {
    const { id } = await params;

    const party =
        await prisma.party.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                challans: {
                    include: {
                        items: true,
                    },
                    orderBy: {
                        receivedDate: "desc",
                    },
                },
            },
        });

    if (!party) {
        notFound();
    }

    const totalReceived =
        party.challans
            .flatMap((challan) => challan.items)
            .reduce(
                (sum, item) =>
                    sum + item.receivedWeight,
                0
            );

    const totalRemaining =
        party.challans
            .flatMap((challan) => challan.items)
            .reduce(
                (sum, item) =>
                    sum + item.currentWeight,
                0
            );

    const totalDispatched =
        totalReceived - totalRemaining;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">
                    {party.partyName}
                </h1>

                <Link
                    href={`/parties/${party.id}/edit`}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                >
                    Edit Party
                </Link>
            </div>

            {/* Summary Cards */}

            <div className="grid gap-4 md:grid-cols-3">

                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="text-sm text-gray-500">
                        Total Received
                    </h2>

                    <p className="mt-2 text-3xl font-bold">
                        {totalReceived} kg
                    </p>
                </div>

                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="text-sm text-gray-500">
                        Remaining
                    </h2>

                    <p className="mt-2 text-3xl font-bold">
                        {totalRemaining} kg
                    </p>
                </div>

                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="text-sm text-gray-500">
                        Dispatched
                    </h2>

                    <p className="mt-2 text-3xl font-bold">
                        {totalDispatched} kg
                    </p>
                </div>

            </div>

            {/* Challan Table */}

            <div className="rounded-xl border bg-white shadow-sm">

                <div className="border-b p-4">
                    <h2 className="text-xl font-semibold">
                        Challans
                    </h2>
                </div>

                <table className="w-full">

                    <thead>

                        <tr className="border-b bg-gray-50">

                            <th className="p-4 text-left">
                                Challan
                            </th>

                            <th className="p-4 text-left">
                                Received
                            </th>

                            <th className="p-4 text-left">
                                Remaining
                            </th>

                            <th className="p-4 text-left">
                                Status
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {party.challans.map(
                            (challan) => {

                                const received =
                                    challan.items.reduce(
                                        (sum, item) =>
                                            sum +
                                            item.receivedWeight,
                                        0
                                    );

                                const remaining =
                                    challan.items.reduce(
                                        (sum, item) =>
                                            sum +
                                            item.currentWeight,
                                        0
                                    );

                                return (
                                    <tr
                                        key={challan.id}
                                        className="border-b"
                                    >

                                        <td className="p-4">
                                            <Link
                                                href={`/challans/${challan.id}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {challan.challanNumber}
                                            </Link>
                                        </td>

                                        <td className="p-4">
                                            {received} kg
                                        </td>

                                        <td className="p-4">
                                            {remaining} kg
                                        </td>

                                        <td className="p-4">
                                            {remaining > 0
                                                ? "Pending"
                                                : "Completed"}
                                        </td>

                                    </tr>
                                );
                            }
                        )}

                        {party.challans.length === 0 && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="p-6 text-center text-gray-500"
                                >
                                    No Challans Found
                                </td>
                            </tr>
                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}