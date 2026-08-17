import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

export default async function ProductionReportPage() {
    await requirePermission("MANAGE_PRODUCTION");

    const batches = await prisma.productionBatch.findMany({
        include: {
            contractor: true,
            furnace: true,
            items: true,
        },
        orderBy: {
            processDate: "desc",
        },
    });

    const totalInput = batches.reduce(
        (sum, batch) =>
            sum +
            batch.items.reduce(
                (s, item) => s + item.inputWeight,
                0
            ),
        0
    );

    const totalOutput = batches.reduce(
        (sum, batch) =>
            sum +
            batch.items.reduce(
                (s, item) => s + (item.outputWeight ?? 0),
                0
            ),
        0
    );

    const totalZinc = batches.reduce(
        (sum, batch) =>
            sum +
            batch.items.reduce(
                (s, item) => s + (item.zincAddedWeight ?? 0),
                0
            ),
        0
    );

    const totalContractorCost = batches.reduce(
        (sum, batch) =>
            sum +
            batch.items.reduce(
                (s, item) => s + (item.contractorAmount ?? 0),
                0
            ),
        0
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">
                    Production Report
                </h1>

                <p className="text-gray-500">
                    Production summary, zinc consumption and contractor cost.
                </p>
            </div>
            <a
                href="/reports/production/export"
                className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
                Export CSV
            </a>

            <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-lg border bg-white p-4">
                    <p className="text-sm text-gray-500">
                        Total Input
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                        {totalInput.toFixed(2)} kg
                    </p>
                </div>

                <div className="rounded-lg border bg-white p-4">
                    <p className="text-sm text-gray-500">
                        Total Output
                    </p>

                    <p className="mt-2 text-2xl font-bold text-green-600">
                        {totalOutput.toFixed(2)} kg
                    </p>
                </div>

                <div className="rounded-lg border bg-white p-4">
                    <p className="text-sm text-gray-500">
                        Zinc Consumed
                    </p>

                    <p className="mt-2 text-2xl font-bold text-yellow-600">
                        {totalZinc.toFixed(2)} kg
                    </p>
                </div>

                <div className="rounded-lg border bg-white p-4">
                    <p className="text-sm text-gray-500">
                        Contractor Cost
                    </p>

                    <p className="mt-2 text-2xl font-bold text-purple-600">
                        ₹ {totalContractorCost.toFixed(2)}
                    </p>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border bg-white">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Batch</th>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Contractor</th>
                            <th className="p-3 text-left">Furnace</th>
                            <th className="p-3 text-left">Input</th>
                            <th className="p-3 text-left">Output</th>
                            <th className="p-3 text-left">Zinc</th>
                            <th className="p-3 text-left">Cost</th>
                        </tr>
                    </thead>

                    <tbody>
                        {batches.map((batch) => {
                            const input = batch.items.reduce(
                                (s, item) => s + item.inputWeight,
                                0
                            );

                            const output = batch.items.reduce(
                                (s, item) => s + (item.outputWeight ?? 0),
                                0
                            );

                            const zinc = batch.items.reduce(
                                (s, item) => s + (item.zincAddedWeight ?? 0),
                                0
                            );

                            const cost = batch.items.reduce(
                                (s, item) => s + (item.contractorAmount ?? 0),
                                0
                            );

                            return (
                                <tr
                                    key={batch.id}
                                    className="border-t"
                                >
                                    <td className="p-3">
                                        {batch.batchNo}
                                    </td>

                                    <td className="p-3">
                                        {batch.processDate.toLocaleDateString("en-IN")}
                                    </td>

                                    <td className="p-3">
                                        {batch.contractor.name}
                                    </td>

                                    <td className="p-3">
                                        {batch.furnace.name}
                                    </td>

                                    <td className="p-3">
                                        {input.toFixed(2)} kg
                                    </td>

                                    <td className="p-3">
                                        {output.toFixed(2)} kg
                                    </td>

                                    <td className="p-3">
                                        {zinc.toFixed(2)} kg
                                    </td>

                                    <td className="p-3">
                                        ₹ {cost.toFixed(2)}
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