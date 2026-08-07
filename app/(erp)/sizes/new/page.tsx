import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { createSize } from "./actions";

export default async function NewSizePage() {
  await requirePermission("MANAGE_PRODUCTION");

  const categories = await prisma.itemCategory.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  if (categories.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">
          Add Size
        </h1>

        <div className="rounded border bg-yellow-50 p-4">
          <p className="text-yellow-800">
            No active item categories found.
          </p>

          <Link
            href="/item-categories/new"
            className="mt-3 inline-block text-blue-600 hover:underline"
          >
            Create an Item Category first
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Add Size
        </h1>

        <p className="text-gray-500">
          Create a new size for an item category.
        </p>
      </div>

      <form action={createSize} className="space-y-6">
        <div>
          <label className="mb-1 block font-medium">
            Category
          </label>

          <select
            name="itemCategoryId"
            required
            className="w-full rounded border px-3 py-2"
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

          <input
            type="text"
            name="name"
            required
            placeholder="Enter size"
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Save
          </button>

          <Link
            href="/sizes"
            className="rounded border px-4 py-2 hover:bg-gray-100"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}