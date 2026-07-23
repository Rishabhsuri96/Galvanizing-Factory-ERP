import { prisma } from "@/lib/prisma";

export default async function PendingChallansPage() {
    const challans = await prisma.challan.findMany({
        where: {
            items: {
                some: {
                    pendingProductionWeight: {
                        gt: 0,
                    },
                },
            },
        },

        include: {
            party: true,
            items: true,
        },

        orderBy: {
            receivedDate: "desc",
        },
    });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">
                Pending Challans
            </h1>
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">
                    Total Pending Challans
                </p>

                <p className="mt-2 text-3xl font-bold">
                    {challans.length}
                </p>
            </div>

            <div className="rounded-xl border bg-white shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-gray-50">

                            <th className="p-4 text-left">
                                Party
                            </th>

                            <th className="p-4 text-left">
                                Challan
                            </th>
                            <th className="p-4 text-left">
                                Date
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
                        {challans.map((challan) => {
                            const receivedWeight =
                                challan.items.reduce(
                                    (sum, item) =>
                                        sum +
                                        item.receivedWeight,
                                    0
                                );

                            const remainingWeight =
                                challan.items.reduce(
                                    (sum, item) =>
                                        sum +
                                        item.pendingProductionWeight,
                                    0
                                );

                            const status =
                                remainingWeight > 0
                                    ? "Pending"
                                    : "Completed";

                            return (
                                <tr
                                    key={challan.id}
                                    className="border-b"
                                >
                                    <td className="p-4">
                                        {
                                            challan.party
                                                .partyName
                                        }
                                    </td>

                                    <td className="p-4">
                                        <a
                                            href={`/challans/${challan.id}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {challan.challanNumber}
                                        </a>
                                    </td>
                                    <td className="p-4">
                                        {challan.receivedDate.toLocaleDateString()}
                                    </td>

                                    <td className="p-4">
                                        {receivedWeight} kg
                                    </td>

                                    <td className="p-4">
                                        {remainingWeight} kg
                                    </td>

                                    <td className="p-4">
                                        {status}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}