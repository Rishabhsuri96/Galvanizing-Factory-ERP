import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import CategorySizeSelector from "@/components/category-size-selector";
import { updateContractorRate } from "./actions";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditContractorRatePage({
  params,
}: Props) {
  await requirePermission("MANAGE_PRODUCTION");

  const { id } = await params;

  const rateId = Number(id);

  if (Number.isNaN(rateId)) {
    notFound();
  }

  const [rate, contractors, categories] =
    await Promise.all([
      prisma.contractorRate.findUnique({
        where: {
          id: rateId,
        },
        include: {
          size: true,
        },
      }),

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

  if (!rate) {
    notFound();
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Edit Contractor Rate
        </h1>

        <p className="text-gray-500">
          Update contractor rate.
        </p>
      </div>

      <form
        action={updateContractorRate}
        className="space-y-6 rounded-lg border bg-white p-6"
      >
        <input
          type="hidden"
          name="id"
          value={rate.id}
        />

        <div>
          <label className="mb-1 block font-medium">
            Contractor
          </label>

          <select
            name="contractorId"
            required
            defaultValue={rate.contractorId}
            className="w-full rounded border p-2"
          >
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
          defaultCategoryId={rate.itemCategoryId}
          defaultSizeId={rate.sizeId ?? undefined}
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
            defaultValue={rate.ratePerKg}
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
            defaultValue={
              rate.effectiveFrom
                .toISOString()
                .split("T")[0]
            }
            className="w-full rounded border p-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="isActive"
            type="checkbox"
            name="isActive"
            defaultChecked={rate.isActive}
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
            Update
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