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

type RateInputRowProps = {
  categoryId: number;
  categoryName: string;
};

export default function RateInputRow({
  categoryId,
  categoryName,
}: RateInputRowProps) {
  const [selectedSize, setSelectedSize] =
    useState("");
  const [rateValue, setRateValue] =
    useState("");

  const needsSize =
    rateValue.trim().length > 0;
  const needsRate =
    selectedSize.length > 0;

  return (
    <div className="grid grid-cols-3 items-center gap-6">
      <label className="font-medium">
        {categoryName}
      </label>

      <div className="space-y-2">
        <select
          name={`category-${categoryId}-size`}
          required={needsSize}
          value={selectedSize}
          onChange={(event) =>
            setSelectedSize(event.target.value)
          }
          className="w-full rounded border p-2"
        >
          <option value="">
            Select size
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

        {selectedSize === "Other" && (
          <input
            type="text"
            name={`category-${categoryId}-custom-size`}
            required={needsSize}
            placeholder="Enter size"
            className="w-full rounded border p-2"
          />
        )}
      </div>

      <input
        type="number"
        step="0.01"
        min="0"
        onWheel={(e) => e.currentTarget.blur()}
        name={`category-${categoryId}-rate`}
        required={needsRate}
        value={rateValue}
        onChange={(event) =>
          setRateValue(event.target.value)
        }
        className="rounded border p-2"
      />
    </div>
  );
}
