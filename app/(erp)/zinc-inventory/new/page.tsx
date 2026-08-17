import Link from "next/link";
import { createZincEntry } from "./actions";

export default function NewZincEntryPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Add Zinc Entry
          </h1>

          <p className="text-gray-500">
            Record zinc purchase or stock adjustment.
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
        action={createZincEntry}
        className="space-y-5 rounded-lg border bg-white p-6"
      >
        {/* Type */}
        <div>
          <label className="mb-1 block font-medium">
            Transaction Type
          </label>

          <select
            name="type"
            required
            className="w-full rounded border p-2"
          >
            <option value="">
              Select Type
            </option>

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
            min="0.01"
            step="0.01"
            required
            className="w-full rounded border p-2"
          />
        </div>

        {/* Rate */}
        <div>
          <label className="mb-1 block font-medium">
            Rate per Kg (Only for Purchase)
          </label>

          <input
            type="number"
            name="ratePerKg"
            min="0"
            step="0.01"
            className="w-full rounded border p-2"
          />
        </div>

        {/* Supplier */}
        <div>
          <label className="mb-1 block font-medium">
            Supplier (Only for Purchase)
          </label>

          <input
            name="supplier"
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
            Save Entry
          </button>
        </div>
      </form>
    </div>
  );
}