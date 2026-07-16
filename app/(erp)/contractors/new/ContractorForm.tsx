"use client";

import { createContractor } from "./actions";

export default function ContractorForm() {
  return (
    <form action={createContractor} className="space-y-6">

      <div className="rounded-lg border bg-white p-6">

        <div className="grid grid-cols-2 gap-6">

          <div>
            <label className="mb-2 block font-medium">
              Contractor Name *
            </label>

            <input
              name="name"
              required
              className="w-full rounded border p-2"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Phone
            </label>

            <input
              name="phone"
              className="w-full rounded border p-2"
            />
          </div>

          <div className="col-span-2">
            <label className="mb-2 block font-medium">
              Address
            </label>

            <textarea
              name="address"
              rows={3}
              className="w-full rounded border p-2"
            />
          </div>

          <div className="col-span-2">
            <label className="mb-2 block font-medium">
              Remarks
            </label>

            <textarea
              name="remarks"
              rows={3}
              className="w-full rounded border p-2"
            />
          </div>

        </div>

      </div>

      <div className="flex justify-end gap-3">

        <button
          type="submit"
          className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          Save Contractor
        </button>

      </div>

    </form>
  );
}