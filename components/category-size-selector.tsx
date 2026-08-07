"use client";

import { useEffect, useRef, useState } from "react";
import { getSizesByCategory } from "@/lib/api/sizes";

type Category = {
  id: number;
  name: string;
};

type Size = {
  id: number;
  name: string;
};

type CategorySizeSelectorProps = {
  categories: Category[];
  defaultCategoryId?: number;
  defaultSizeId?: number;
  categoryName?: string;
  sizeName?: string;
};

export default function CategorySizeSelector({
  categories,
  defaultCategoryId,
  defaultSizeId,
  categoryName = "itemCategoryId",
  sizeName = "sizeId",
}: CategorySizeSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | "">(
    defaultCategoryId ?? ""
  );

  const [selectedSize, setSelectedSize] = useState<number | "">("");

  const [sizes, setSizes] = useState<Size[]>([]);

  const [loading, setLoading] = useState(false);

  // Apply default size only once (Edit screen)
  const hasAppliedDefaultSize = useRef(false);

  useEffect(() => {
    if (!selectedCategory) {
      setSizes([]);
      setSelectedSize("");
      return;
    }

    const categoryId = selectedCategory;

    let ignore = false;

    async function loadSizes() {
      setLoading(true);

      try {
        const data = await getSizesByCategory(categoryId);

        if (ignore) return;

        setSizes(data);

        // Apply default size only on first load
        if (
          !hasAppliedDefaultSize.current &&
          defaultCategoryId === categoryId &&
          defaultSizeId
        ) {
          const exists = data.some(
            (size) => size.id === defaultSizeId
          );

          if (exists) {
            setSelectedSize(defaultSizeId);
          }

          hasAppliedDefaultSize.current = true;
        }
      } catch (error) {
        console.error("Failed to load sizes:", error);

        if (!ignore) {
          setSizes([]);
          setSelectedSize("");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadSizes();

    return () => {
      ignore = true;
    };
  }, [selectedCategory, defaultCategoryId, defaultSizeId]);

  return (
    <>
      <div>
        <label className="mb-1 block font-medium">
          Category
        </label>

        <select
          name={categoryName}
          value={selectedCategory}
          onChange={(e) => {
            const value =
              e.target.value === ""
                ? ""
                : Number(e.target.value);

            setSelectedCategory(value);

            // Reset size whenever category changes
            setSelectedSize("");
            setSizes([]);
          }}
          required
          className="w-full rounded border p-2"
        >
          <option value="">
            Select Category
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block font-medium">
          Size
        </label>

        <select
          name={sizeName}
          value={selectedSize}
          onChange={(e) =>
            setSelectedSize(
              e.target.value === ""
                ? ""
                : Number(e.target.value)
            )
          }
          required
          disabled={
            !selectedCategory ||
            loading ||
            sizes.length === 0
          }
          className="w-full rounded border p-2"
        >
          {!selectedCategory && (
            <option value="">
              Select a category first
            </option>
          )}

          {loading && (
            <option value="">
              Loading sizes...
            </option>
          )}

          {!loading &&
            selectedCategory &&
            sizes.length > 0 && (
              <option value="">
                Select Size
              </option>
            )}

          {!loading &&
            selectedCategory &&
            sizes.length === 0 && (
              <option value="">
                No sizes available
              </option>
            )}

          {!loading &&
            sizes.map((size) => (
              <option
                key={size.id}
                value={size.id}
              >
                {size.name}
              </option>
            ))}
        </select>
      </div>
    </>
  );
}