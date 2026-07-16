import { createProductionBatch } from "./actions";

type DropdownOption = {
  id: number;
  name: string;
};

type ProductionBatchFormProps = {
  contractors: DropdownOption[];
  furnaces: DropdownOption[];
};

export default function ProductionBatchForm({
  contractors,
  furnaces,
}: ProductionBatchFormProps) {
  return (
    <form
      action={createProductionBatch}
      className="rounded-lg border bg-white p-6"
    >
      <div className="space-y-5">
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
              Select contractor
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

        <div>
          <label className="mb-1 block font-medium">
            Furnace
          </label>

          <select
            name="furnaceId"
            required
            className="w-full rounded border p-2"
          >
            <option value="">
              Select furnace
            </option>

            {furnaces.map((furnace) => (
              <option
                key={furnace.id}
                value={furnace.id}
              >
                {furnace.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block font-medium">
            Shift
          </label>

          <select
            name="shift"
            required
            className="w-full rounded border p-2"
          >
            <option value="">
              Select shift
            </option>
            <option value="DAY">
              DAY
            </option>
            <option value="NIGHT">
              NIGHT
            </option>
          </select>
        </div>

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
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          Create Batch
        </button>
      </div>
    </form>
  );
}
