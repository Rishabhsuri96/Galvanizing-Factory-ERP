import Link from "next/link";
import { requirePermission } from "@/lib/permissions";
import { createItemCategory } from "./actions";

export default async function NewItemCategoryPage() {
  await requirePermission("MANAGE_PRODUCTION");

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            New Item Category
          </h1>

          <p className="text-gray-500">
            Create a new item category.
          </p>
        </div>

        <Link
          href="/item-categories"
          className="rounded bg-gray-700 px-4 py-2 text-white"
        >
          Back
        </Link>
      </div>

      <form
        action={createItemCategory}
        className="rounded-lg border bg-white p-6 space-y-5"
      >
        <div>
          <label className="mb-1 block font-medium">
            Category Name
          </label>

          <input
            name="name"
            required
            className="w-full rounded border p-2"
            placeholder="Example: Nut"
          />
        </div>

        

        <button
          type="submit"
          className="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          Create Category
        </button>
      </form>
    </div>
  );
}