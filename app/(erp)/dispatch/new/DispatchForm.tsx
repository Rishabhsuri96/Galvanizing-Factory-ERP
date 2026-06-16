"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDispatch } from "./actions";

type AvailableItem = {
    id: number;
    itemName: string;
    currentWeight: number;
    challan: {
        challanNumber: string;
        party: {
            partyName: string;
        };
    };
};

type TruckItem = {
    id: number;
    itemName: string;
    partyName: string;
    challanNumber: string;
    weight: number;
};

type Props = {
    availableItems: AvailableItem[];
};

export default function DispatchForm({
    availableItems,
}: Props) {
    const router = useRouter();

    const [vehicleNumber, setVehicleNumber] =
        useState("");

    const [remarks, setRemarks] =
        useState("");

    const [truckItems, setTruckItems] =
        useState<TruckItem[]>([]);

    const [weights, setWeights] = useState<
        Record<number, string>
    >({});

    function getRemainingWeight(
        item: AvailableItem
    ) {
        const alreadyAdded = truckItems
            .filter(
                (truckItem) =>
                    truckItem.id === item.id
            )
            .reduce(
                (sum, truckItem) =>
                    sum + truckItem.weight,
                0
            );

        return (
            item.currentWeight - alreadyAdded
        );
    }

    function addItem(item: AvailableItem) {
        const enteredWeight = Number(
            weights[item.id] || 0
        );

        if (enteredWeight <= 0) {
            alert(
                "Dispatch weight must be greater than 0."
            );
            return;
        }

        const remainingWeight =
            getRemainingWeight(item);

        if (
            enteredWeight >
            remainingWeight
        ) {
            alert(
                `Only ${remainingWeight} kg available.`
            );
            return;
        }

        setTruckItems((previous) => {
            const existingIndex =
                previous.findIndex(
                    (truckItem) =>
                        truckItem.id === item.id
                );

            if (existingIndex >= 0) {
                const updated = [...previous];

                updated[existingIndex] = {
                    ...updated[existingIndex],
                    weight:
                        updated[
                            existingIndex
                        ].weight + enteredWeight,
                };

                return updated;
            }

            return [
                ...previous,
                {
                    id: item.id,
                    itemName: item.itemName,
                    partyName:
                        item.challan.party.partyName,
                    challanNumber:
                        item.challan.challanNumber,
                    weight: enteredWeight,
                },
            ];
        });

        setWeights((previous) => ({
            ...previous,
            [item.id]: "",
        }));
    }

    function removeItem(id: number) {
        setTruckItems((previous) =>
            previous.filter(
                (item) => item.id !== id
            )
        );
    }

    return (
        <div className="space-y-6">
            {/* Vehicle Details */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold">
                    Vehicle Details
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Vehicle Number *
                        </label>

                        <input
                            type="text"
                            value={vehicleNumber}
                            onChange={(e) =>
                                setVehicleNumber(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border p-2"
                            placeholder="PB10AB1234"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Remarks
                        </label>

                        <input
                            type="text"
                            value={remarks}
                            onChange={(e) =>
                                setRemarks(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border p-2"
                            placeholder="Optional"
                        />
                    </div>
                </div>
            </div>

            {/* Materials In Vehicle */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold">
                    Materials In Vehicle
                </h2>

                {truckItems.length === 0 ? (
                    <p className="text-gray-500">
                        No material added yet.
                    </p>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2 text-left">
                                    Party
                                </th>

                                <th className="p-2 text-left">
                                    Challan
                                </th>

                                <th className="p-2 text-left">
                                    Item
                                </th>

                                <th className="p-2 text-left">
                                    Weight
                                </th>

                                <th className="p-2 text-left">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {truckItems.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b"
                                >
                                    <td className="p-2">
                                        {item.partyName}
                                    </td>

                                    <td className="p-2">
                                        {item.challanNumber}
                                    </td>

                                    <td className="p-2">
                                        {item.itemName}
                                    </td>

                                    <td className="p-2">
                                        {item.weight} kg
                                    </td>

                                    <td className="p-2">
                                        <button
                                            onClick={() =>
                                                removeItem(item.id)
                                            }
                                            className="rounded bg-red-600 px-3 py-1 text-white"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Available Ready Material */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold">
                    Available Ready Material
                </h2>

                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2 text-left">
                                Party
                            </th>

                            <th className="p-2 text-left">
                                Challan
                            </th>

                            <th className="p-2 text-left">
                                Item
                            </th>

                            <th className="p-2 text-left">
                                Available
                            </th>

                            <th className="p-2 text-left">
                                Dispatch Weight
                            </th>

                            <th className="p-2 text-left">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {availableItems.map((item) => (
                            <tr
                                key={item.id}
                                className="border-b"
                            >
                                <td className="p-2">
                                    {
                                        item.challan.party
                                            .partyName
                                    }
                                </td>

                                <td className="p-2">
                                    {
                                        item.challan
                                            .challanNumber
                                    }
                                </td>

                                <td className="p-2">
                                    {item.itemName}
                                </td>

                                <td className="p-2">
                                    {getRemainingWeight(
                                        item
                                    )}{" "}
                                    kg
                                </td>

                                <td className="p-2">
                                    <input
                                        type="number"
                                        value={
                                            weights[item.id] ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            setWeights(
                                                (
                                                    previous
                                                ) => ({
                                                    ...previous,
                                                    [item.id]:
                                                        e.target
                                                            .value,
                                                })
                                            )
                                        }
                                        className="w-28 rounded border p-2"
                                    />
                                </td>

                                <td className="p-2">
                                    <button
                                        onClick={() =>
                                            addItem(item)
                                        }
                                        className="rounded bg-green-600 px-3 py-2 text-white"
                                    >
                                        Add
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button
                onClick={async () => {
                    try {
                        await createDispatch(
                            vehicleNumber,
                            remarks,
                            truckItems.map(
                                (item) => ({
                                    id: item.id,
                                    weight:
                                        item.weight,
                                })
                            )
                        );

                        alert("Dispatch saved successfully");

                        window.location.href = "/dispatch";
                    } catch (error) {
                        alert(
                            error instanceof Error
                                ? error.message
                                : "Failed to save dispatch"
                        );
                    }
                }}
                className="rounded-lg bg-blue-600 px-6 py-3 text-white"
            >
                Save Dispatch
            </button>
        </div>
    );
}