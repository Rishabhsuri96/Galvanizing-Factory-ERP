"use client";

import { useMemo } from "react";
import { completeProductionItem } from "./actions";

type Props = {
  productionItem: {
    id: number;
    inputWeight: number;

    challanItem: {
      itemName: string;
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
  };
};

export default function CompleteProductionForm({
  productionItem,
}: Props) {
  const inputWeight = productionItem.inputWeight;

  return (
    <form
      action={completeProductionItem.bind(
        null,
        productionItem.id
      )}
      className="space-y-6 rounded-lg border bg-white p-6"
    >
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-500">
            Party
          </p>

          <p className="font-medium">
            {
              productionItem.challanItem.challan.party
                .partyName
            }
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Challan
          </p>

          <p className="font-medium">
            {
              productionItem.challanItem.challan
                .challanNumber
            }
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Item
          </p>

          <p className="font-medium">
            {productionItem.challanItem.itemName}
            {productionItem.challanItem.size
              ? ` ${productionItem.challanItem.size}`
              : ""}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Category
          </p>

          <p className="font-medium">
            {productionItem.challanItem
              .itemCategory?.name ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Input Weight
          </p>

          <p className="font-bold text-lg">
            {inputWeight} kg
          </p>
        </div>
      </div>

      <div>
        <label className="mb-1 block font-medium">
          Output Weight
        </label>

        <input
          type="number"
          name="outputWeight"
          step="0.01"
          min={inputWeight}
          required
          className="w-full rounded border p-2"
        />
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

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded bg-green-600 px-6 py-2 text-white hover:bg-green-700"
        >
          Complete Production
        </button>
      </div>
    </form>
  );
}