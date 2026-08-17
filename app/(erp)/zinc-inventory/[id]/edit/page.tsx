import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { updateZincEntry } from "./actions";
import { ZincTransactionType } from "@prisma/client";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditZincEntryPage({ params }: Props) {
  const { id: rawId } = await params;
  const id = parseInt(rawId, 10);

  if (!id) notFound();

  const entry = await prisma.zincInventory.findUnique({
    where: { id },
  });

  if (!entry) notFound();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Edit Zinc Entry
          </h1>
          <p className="text-gray-500">
            Update zinc transaction details.
          </p>
        </div>

        <Link
          href="/zinc-inventory"
          className="rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-800"
        >
          Back
        </Link>
      </div>

      {/* Form */}
      <form
        action={updateZincEntry}
        className="space-y-5 rounded-lg border bg-white p-6"
      >
        <input type="hidden" name="id" value={entry.id} />

        {/* Type */}
        <div>
          <label className="mb-1 block font-medium">
            Transaction Type
          </label>

          <select
            name="type"
            defaultValue={entry.type}
            required
            className="w-full rounded border p-2"
          >
            <option value="PURCHASE">
              Zinc Added (Purchase)
            </option>

            <option value="ADJUSTMENT">
              Zinc Used / Removed
            </option>
          </select>
        </div>

        {/* Weight */}
        <div>
          <label className="mb-1 block font-medium">
            Weight (kg)
          </label>

          <input
            type="number"
            name="weight"
            defaultValue={entry.weight}
            min="0.01"
            step="0.01"
            required
            className="w-full rounded border p-2"
          />
        </div>

        {/* Rate */}
        <div>
          <label className="mb-1 block font-medium">
            Rate per Kg
          </label>

          <input
            type="number"
            name="ratePerKg"
            defaultValue={entry.ratePerKg ?? ""}
            min="0"
            step="0.01"
            className="w-full rounded border p-2"
          />
        </div>

        {/* Supplier */}
        <div>
          <label className="mb-1 block font-medium">
            Supplier
          </label>

          <input
            name="supplier"
            defaultValue={entry.supplier ?? ""}
            className="w-full rounded border p-2"
          />
        </div>

        {/* Remarks */}
        <div>
          <label className="mb-1 block font-medium">
            Remarks
          </label>

          <textarea
            name="remarks"
            defaultValue={entry.remarks ?? ""}
            rows={4}
            className="w-full rounded border p-2"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Update Entry
          </button>
        </div>
      </form>
    </div>
  );
}