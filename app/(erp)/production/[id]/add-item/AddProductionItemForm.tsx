"use client";
import { assignProductionItem } from "./actions";
import SubmitButton from "./SubmitButton";
type SelectedItem = {
  id: number;
  itemName: string;
  pendingProductionWeight: number;
  size: string | null;
  itemCategory: {
    name: string;
  } | null;
  challan: {
    challanNumber: string;
    party: {
      partyName: string;
    };
  };
};

type AddProductionItemFormProps = {
  batchId: number;
  selectedItem: SelectedItem;
};

export default function AddProductionItemForm({
  batchId,
  selectedItem,
}: AddProductionItemFormProps) {
  return (
    <form
      action={assignProductionItem.bind(null, batchId)}
      className="rounded-lg border bg-white p-6"
    >
      <input
        type="hidden"
        name="challanItemId"
        value={selectedItem.id}
      />

      <h2 className="mb-4 text-xl font-semibold">
        Selected Item
      </h2>

      <div className="mb-6 grid grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-500">
            Party
          </p>

          <p className="font-medium">
            {selectedItem.challan.party.partyName}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Challan
          </p>

          <p className="font-medium">
            {selectedItem.challan.challanNumber}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Item
          </p>

          <p className="font-medium">
            {selectedItem.itemName}
            {selectedItem.size
              ? ` ${selectedItem.size}`
              : ""}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Available for Production
          </p>

          <p className="font-medium">
            {selectedItem.pendingProductionWeight} kg
          </p>
        </div>
      </div>

      <div>
        <label className="mb-1 block font-medium">
          Weight to Assign
        </label>

        <input
          type="number"
          name="processedWeight"
          min="0.01"
          onWheel={(e) => e.currentTarget.blur()}
          max={selectedItem.pendingProductionWeight}
          step="0.01"
          required
          className="w-full rounded border p-2"
        />
        <p className="mt-1 text-sm text-gray-500">
          Enter a value up to {selectedItem.pendingProductionWeight} kg.
        </p>
      </div>

      <div className="mt-8 flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
