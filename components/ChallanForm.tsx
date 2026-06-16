"use client";

import { useState } from "react";

type ItemRow = {
    itemName: string;
    weight: string;
};

type PartyOption = {
    id: number;
    partyName: string;
};

export default function ChallanForm({
    parties,
}: {
    parties: PartyOption[];
}) {
    const [items, setItems] = useState<ItemRow[]>([
        {
            itemName: "",
            weight: "",
        },
    ]);

    const addItem = () => {
        setItems([
            ...items,
            {
                itemName: "",
                weight: "",
            },
        ]);
    };

    const removeItem = (index: number) => {
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

        updatedItems[index][field] = value;

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

                <label className="block mb-1">
                    Party
                </label>

                <select
                    name="partyId"
                    className="border p-2 w-full rounded"
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

                <label className="block mb-1">
                    Challan Number
                </label>

                <input
                    name="challanNumber"
                    className="border p-2 w-full rounded"
                />

            </div>
            <div>

                <label className="block mb-1">
                    Received Date
                </label>

                <input
                    type="date"
                    name="receivedDate"
                    defaultValue={
                        new Date().toISOString().split("T")[0]
                    }
                    className="border p-2 w-full rounded"
                    required
                />

            </div>

            <div>

                <label className="block mb-1">
                    Vehicle Number
                </label>

                <input
                    name="vehicleNumber"
                    className="border p-2 w-full rounded"
                />

            </div>

            <div>

                <label className="block mb-1">
                    E-Way Number
                </label>

                <input
                    name="ewayNumber"
                    className="border p-2 w-full rounded"
                />

            </div>

            <div className="border rounded p-4">

                <h2 className="font-bold mb-4">
                    Challan Items
                </h2>

                {items.map((item, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-12 gap-2 mb-2"
                    >

                        <input
                            name={`itemName-${index}`}
                            placeholder="Item Name"
                            value={item.itemName}
                            onChange={(e) =>
                                updateItem(
                                    index,
                                    "itemName",
                                    e.target.value
                                )
                            }
                            className="col-span-7 border p-2 rounded"
                        />

                        <input
                            name={`weight-${index}`}
                            placeholder="Weight"
                            type="number"
                            value={item.weight}
                            onChange={(e) =>
                                updateItem(
                                    index,
                                    "weight",
                                    e.target.value
                                )
                            }
                            className="col-span-3 border p-2 rounded"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                removeItem(index)
                            }
                            className="col-span-2 bg-red-500 text-white rounded"
                        >
                            Remove
                        </button>

                    </div>
                ))}

                <button
                    type="button"
                    onClick={addItem}
                    className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
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
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Save Challan
            </button>

        </div>
    );
}