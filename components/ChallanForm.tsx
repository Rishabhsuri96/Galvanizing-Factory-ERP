"use client";

import { useState } from "react";

type ItemRow = {
  itemCategoryId: string;
  sizeId: string;
  itemName: string;
  weight: string;
};

type PartyOption = {
  id: number;
  partyName: string;
};

type ItemCategoryOption = {
  id: number;
  name: string;
};

type SizeOption = {
  id: number;
  name: string;
  itemCategoryId: number;
};

type InitialChallan = {
  partyId: number;
  challanNumber: string;
  receivedDate: string;
  vehicleNumber: string;
  ewayNumber: string;
  items: ItemRow[];
};

export default function ChallanForm({
  parties,
  itemCategories,
  sizes,
  initialChallan,
  submitLabel = "Save Challan",
}: {
  parties: PartyOption[];
  itemCategories: ItemCategoryOption[];
  sizes: SizeOption[];
  initialChallan?: InitialChallan;
  submitLabel?: string;
}) {
  const [items, setItems] = useState<ItemRow[]>(
    initialChallan?.items?.length
      ? initialChallan.items
      : [
          {
            itemCategoryId: "",
            sizeId: "",
            itemName: "",
            weight: "",
          },
        ]
  );

  const addItem = () => {
    setItems([
      ...items,
      {
        itemCategoryId: "",
        sizeId: "",
        itemName: "",
        weight: "",
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) return;

    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof ItemRow,
    value: string
  ) => {
    const updated = [...items];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    // 🔥 reset size when category changes
    if (field === "itemCategoryId") {
      updated[index].sizeId = "";
    }

    setItems(updated);
  };

  const totalWeight = items.reduce(
    (sum, item) => sum + (Number(item.weight) || 0),
    0
  );

  return (
    <div className="space-y-6">

      {/* PARTY */}
      <div>
        <label className="mb-1 block">Party</label>
        <select
          name="partyId"
          defaultValue={initialChallan?.partyId ?? ""}
          required
          className="w-full rounded border p-2"
        >
          <option value="">Select Party</option>
          {parties.map((party) => (
            <option key={party.id} value={party.id}>
              {party.partyName}
            </option>
          ))}
        </select>
      </div>

      {/* CHALLAN NUMBER */}
      <div>
        <label className="mb-1 block">Challan Number</label>
        <input
          name="challanNumber"
          defaultValue={initialChallan?.challanNumber}
          required
          className="w-full rounded border p-2"
        />
      </div>

      {/* DATE */}
      <div>
        <label className="mb-1 block">Received Date</label>
        <input
          type="date"
          name="receivedDate"
          defaultValue={
            initialChallan?.receivedDate ??
            new Date().toISOString().split("T")[0]
          }
          required
          className="w-full rounded border p-2"
        />
      </div>

      {/* VEHICLE */}
      <div>
        <label className="mb-1 block">Vehicle Number</label>
        <input
          name="vehicleNumber"
          defaultValue={initialChallan?.vehicleNumber}
          className="w-full rounded border p-2"
        />
      </div>

      {/* EWAY */}
      <div>
        <label className="mb-1 block">E-Way Number</label>
        <input
          name="ewayNumber"
          defaultValue={initialChallan?.ewayNumber}
          className="w-full rounded border p-2"
        />
      </div>

      {/* ITEMS */}
      <div className="rounded border p-4">
        <h2 className="mb-4 font-bold">Challan Items</h2>

        <div className="space-y-3">
          {items.map((item, index) => {
            const filteredSizes = sizes.filter(
              (s) =>
                s.itemCategoryId ===
                Number(item.itemCategoryId)
            );

            return (
              <div
                key={index}
                className="grid grid-cols-12 gap-2"
              >
                {/* CATEGORY */}
                <select
                  value={item.itemCategoryId}
                  onChange={(e) =>
                    updateItem(
                      index,
                      "itemCategoryId",
                      e.target.value
                    )
                  }
                  required
                  className="col-span-2 rounded border p-2"
                >
                  <option value="">Category</option>
                  {itemCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                {/* SIZE */}
                <select
                  value={item.sizeId}
                  onChange={(e) =>
                    updateItem(
                      index,
                      "sizeId",
                      e.target.value
                    )
                  }
                  required
                  className="col-span-2 rounded border p-2"
                >
                  <option value="">Size</option>

                  {filteredSizes.map((size) => (
                    <option key={size.id} value={size.id}>
                      {size.name}
                    </option>
                  ))}
                </select>

                {/* ITEM NAME */}
                <input
                  placeholder="Item Name"
                  value={item.itemName}
                  onChange={(e) =>
                    updateItem(
                      index,
                      "itemName",
                      e.target.value
                    )
                  }
                  required
                  className="col-span-4 rounded border p-2"
                />

                {/* WEIGHT */}
                <input
                  type="number"
                  placeholder="Weight"
                  min="0.01"
                  step="0.01"
                  value={item.weight}
                  onChange={(e) =>
                    updateItem(
                      index,
                      "weight",
                      e.target.value
                    )
                  }
                  required
                  className="col-span-2 rounded border p-2"
                />

                {/* REMOVE */}
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="col-span-2 rounded bg-red-500 text-white"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="mt-3 rounded bg-green-600 px-4 py-2 text-white"
        >
          + Add Item
        </button>
      </div>

      {/* TOTAL */}
      <div className="text-xl font-bold">
        Total Weight: {totalWeight} kg
      </div>

      {/* HIDDEN JSON */}
      <input
        type="hidden"
        name="items"
        value={JSON.stringify(items)}
      />

      {/* SUBMIT */}
      <button
        type="submit"
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        {submitLabel}
      </button>
    </div>
  );
}