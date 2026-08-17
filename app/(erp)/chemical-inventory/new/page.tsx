import Link from "next/link";
import { createChemicalEntry } from "./actions";

export default function NewChemicalEntryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Add Chemical Entry
          </h1>
          <p className="text-gray-500">
            Record stock movement (IN / OUT)
          </p>
        </div>

        <Link
          href="/chemical-inventory"
          className="rounded bg-gray-700 px-4 py-2 text-white"
        >
          Back
        </Link>
      </div>

      <form
        action={createChemicalEntry}
        className="space-y-5 rounded-lg border bg-white p-6"
      >
        {/* Chemical Name */}
        <div>
          <label className="block font-medium">
            Chemical Name
          </label>
          <input
            name="chemical"
            required
            className="w-full rounded border p-2"
            placeholder="e.g. ACID, FLUX"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block font-medium">
            Entry Type
          </label>
          <select
            name="type"
            required
            className="w-full rounded border p-2"
          >
            <option value="IN">Stock In (+)</option>
            <option value="OUT">Stock Out (-)</option>
          </select>
        </div>

        {/* Weight */}
        <div>
          <label className="block font-medium">
            Weight (kg)
          </label>
          <input
            type="number"
            name="weight"
            step="0.01"
            required
            className="w-full rounded border p-2"
          />
        </div>

        {/* Supplier */}
        <div>
          <label className="block font-medium">
            Supplier
          </label>
          <input
            name="supplier"
            className="w-full rounded border p-2"
            placeholder="Optional"
          />
        </div>

        {/* Remarks */}
        <div>
          <label className="block font-medium">
            Remarks
          </label>
          <textarea
            name="remarks"
            className="w-full rounded border p-2"
            placeholder="Optional notes"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button className="rounded bg-blue-600 px-6 py-2 text-white">
            Create Entry
          </button>
        </div>
      </form>
    </div>
  );
}