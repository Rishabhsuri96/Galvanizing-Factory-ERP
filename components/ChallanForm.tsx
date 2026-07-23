"use client";

import { useState } from "react";

const sizeOptions = [
  "M8",
  "M10",
  "M12",
  "M16",
  "M20",
  "M22",
  "M24",
  "M30",
  "Other",
];

type ItemRow = {
  id?: number;
  itemCategoryId: string;
  size: string;
  customSize: string;
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
  initialChallan,
  submitLabel = "Save Challan",
}: {
  parties: PartyOption[];
  itemCategories: ItemCategoryOption[];
  initialChallan?: InitialChallan;
  submitLabel?: string;
}) {
  const [items, setItems] = useState<ItemRow[]>(
    initialChallan?.items.length
      ? initialChallan.items
      : [
          {
            itemCategoryId: "",
            size: "",
            customSize: "",
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
        size: "",
        customSize: "",
        itemName: "",
        weight: "",
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) {
      return;
    }

    setItems(
      items.filter((_, i) => i !== index)
    );
  };

  const updateItem = (
    index: number,
    field: keyof ItemRow,
    value: string
  ) => {
    const updatedItems = [...items];

    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    if (
      field === "size" &&
      value !== "Other"
    ) {
      updatedItems[index].customSize = "";
    }

    setItems(updatedItems);
  };

  const totalWeight = items.reduce(
    (sum, item) =>
      sum + (Number(item.weight) || 0),
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-1 block">
          Party
        </label>

        <select
          name="partyId"
          defaultValue={
            initialChallan?.partyId ?? ""
          }
          required
          className="w-full rounded border p-2"
        >
          <option value="">
            Select Party
          </option>

          {parties.map((party) => (
            <option
              key={party.id}
              value={party.id}
            >
              {party.partyName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block">
          Challan Number
        </label>

        <input
          name="challanNumber"
          defaultValue={
            initialChallan?.challanNumber
          }
          required
          className="w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="mb-1 block">
          Received Date
        </label>

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

      <div>
        <label className="mb-1 block">
          Vehicle Number
        </label>

        <input
          name="vehicleNumber"
          defaultValue={
            initialChallan?.vehicleNumber
          }
          className="w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="mb-1 block">
          E-Way Number
        </label>

        <input
          name="ewayNumber"
          defaultValue={
            initialChallan?.ewayNumber
          }
          className="w-full rounded border p-2"
        />
      </div>

      <div className="rounded border p-4">
        <h2 className="mb-4 font-bold">
          Challan Items
        </h2>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-2"
            >
              <select
                name={`itemCategoryId-${index}`}
                value={item.itemCategoryId}
                onChange={(event) =>
                  updateItem(
                    index,
                    "itemCategoryId",
                    event.target.value
                  )
                }
                required
                className="col-span-2 rounded border p-2"
              >
                <option value="">
                  Category
                </option>

                {itemCategories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>

              <div className="col-span-2 space-y-2">
                <select
                  name={`size-${index}`}
                  value={item.size}
                  onChange={(event) =>
                    updateItem(
                      index,
                      "size",
                      event.target.value
                    )
                  }
                  required
                  className="w-full rounded border p-2"
                >
                  <option value="">
                    Size
                  </option>

                  {sizeOptions.map((size) => (
                    <option
                      key={size}
                      value={size}
                    >
                      {size}
                    </option>
                  ))}
                </select>

                {item.size === "Other" && (
                  <input
                    name={`customSize-${index}`}
                    placeholder="Custom Size"
                    value={item.customSize}
                    onChange={(event) =>
                      updateItem(
                        index,
                        "customSize",
                        event.target.value
                      )
                    }
                    required
                    className="w-full rounded border p-2"
                  />
                )}
              </div>

              <input
                name={`itemName-${index}`}
                placeholder="Item Name"
                value={item.itemName}
                onChange={(event) =>
                  updateItem(
                    index,
                    "itemName",
                    event.target.value
                  )
                }
                required
                className="col-span-4 rounded border p-2"
              />

              <input
                name={`weight-${index}`}
                placeholder="Received Weight"
                type="number"
                min="0.01"
                step="0.01"
                onWheel={(e) => e.currentTarget.blur()}
                value={item.weight}
                onChange={(event) =>
                  updateItem(
                    index,
                    "weight",
                    event.target.value
                  )
                }
                required
                className="col-span-2 rounded border p-2"
              />

              <button
                type="button"
                onClick={() =>
                  removeItem(index)
                }
                className="col-span-2 rounded bg-red-500 text-white"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="mt-3 rounded bg-green-600 px-4 py-2 text-white"
        >
          + Add Item
        </button>
      </div>

      <div className="text-xl font-bold">
        Total Weight: {totalWeight} kg
      </div>

      <input
        type="hidden"
        name="items"
        value={JSON.stringify(items)}
      />

      <button
        type="submit"
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        {submitLabel}
      </button>
    </div>
  );
}
