import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { saveRates } from "./actions";
import RateInputRow from "./RateInputRow";

export default async function ContractorRatesPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const contractorId = Number(id);

    const contractor = await prisma.contractor.findUnique({
        where: {
            id: contractorId,
        },
    });

    if (!contractor) {
        notFound();
    }

    const categories = await prisma.itemCategory.findMany({
        where: {
            isActive: true,
        },
        orderBy: {
            name: "asc",
        },
    });

    return (
        <div className="space-y-6">

            {/* Header */}

            <div>
                <h1 className="text-3xl font-bold">
                    Contractor Rates
                </h1>

                <p className="text-gray-500">
                    {contractor.name}
                </p>
            </div>

            {/* Rate Form */}

            <form
                action={saveRates.bind(null, contractorId)}
                className="rounded-lg border bg-white p-6"
            >

                <div className="space-y-5">

                    {categories.map((category) => (

                        <RateInputRow
                            key={category.id}
                            categoryId={category.id}
                            categoryName={category.name}
                        />

                    ))}

                </div>

                <div className="mt-8 flex justify-end">

                    <button
                        type="submit"
                        className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
                    >
                        Save Rates
                    </button>

                </div>

            </form>

        </div>
    );
}
