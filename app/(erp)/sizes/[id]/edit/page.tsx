import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { updateSize } from "./actions";

export default async function EditSizePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("MANAGE_PRODUCTION");

  const { id } = await params;

  const size = await prisma.size.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!size) {
    notFound();
  }

  const categories = await prisma.itemCategory.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Edit Size
          </h1>

          <p className="text-gray-500">
            Update the size details.
          </p>
        </div>

        <Link
          href="/sizes"
          className="rounded bg-gray-700 px-4 py-2 text-white"
        >
          Back
        </Link>
      </div>

      <form
        action={updateSize}
        className="space-y-5 rounded-lg border bg-white p-6"
      >
        <input
          type="hidden"
          name="id"
          value={size.id}
        />

        <div>
          <label className="mb-1 block font-medium">
            Category
          </label>

          <select
            name="itemCategoryId"
            defaultValue={size.itemCategoryId}
            required
            className="w-full rounded border p-2"
          >
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
            name="name"
            defaultValue={size.name}
            required
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">
            Status
          </label>

          <select
            name="isActive"
            defaultValue={String(size.isActive)}
            className="w-full rounded border p-2"
          >
            <option value="true">
              Active
            </option>

            <option value="false">
              Inactive
            </option>
          </select>
        </div>

        <button
          type="submit"
          className="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}