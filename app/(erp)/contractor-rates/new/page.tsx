import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { createContractorRate } from "./actions";
import CategorySizeSelector from "@/components/category-size-selector";

export default async function NewContractorRatePage() {
    await requirePermission("MANAGE_PRODUCTION");

    const [contractors, categories] = await Promise.all([
        prisma.contractor.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                name: "asc",
            },
        }),

        prisma.itemCategory.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                name: "asc",
            },
        }),
    ]);

    return (
        <div className="max-w-3xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold">
                    Add Contractor Rate
                </h1>

                <p className="text-gray-500">
                    Create a new contractor rate.
                </p>
            </div>

            <form
                action={createContractorRate}
                className="space-y-6 rounded-lg border bg-white p-6"
            >
                <div>
                    <label className="mb-1 block font-medium">
                        Contractor
                    </label>

                    <select
                        name="contractorId"
                        required
                        className="w-full rounded border p-2"
                    >
                        <option value="">
                            Select Contractor
                        </option>

                        {contractors.map((contractor) => (
                            <option
                                key={contractor.id}
                                value={contractor.id}
                            >
                                {contractor.name}
                            </option>
                        ))}
                    </select>
                </div>

                <CategorySizeSelector
                    categories={categories}
                />

                <div>
                    <label className="mb-1 block font-medium">
                        Rate Per Kg (₹)
                    </label>

                    <input
                        type="number"
                        name="ratePerKg"
                        required
                        min="0.01"
                        step="0.01"
                        placeholder="Enter rate per kg"
                        className="w-full rounded border p-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block font-medium">
                        Effective From
                    </label>

                    <input
                        type="date"
                        name="effectiveFrom"
                        required
                        defaultValue={new Date().toISOString().split("T")[0]}
                        className="w-full rounded border p-2"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        id="isActive"
                        type="checkbox"
                        name="isActive"
                        defaultChecked
                    />

                    <label htmlFor="isActive">
                        Active
                    </label>
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Save
                    </button>

                    <Link
                        href="/contractor-rates"
                        className="rounded border px-4 py-2 hover:bg-gray-100"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}