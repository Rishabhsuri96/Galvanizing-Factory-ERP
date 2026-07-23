import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { updateItemCategory } from "./actions";

export default async function EditItemCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePermission("MANAGE_PRODUCTION");

  const { id } = await params;

  const category =
    await prisma.itemCategory.findUnique({
      where: {
        id: Number(id),
      },
    });

  if (!category) {
    notFound();
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Edit Item Category
          </h1>

          <p className="text-gray-500">
            Update the item category.
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
        action={updateItemCategory}
        className="space-y-5 rounded-lg border bg-white p-6"
      >
        <input
          type="hidden"
          name="id"
          value={category.id}
        />

        <div>
          <label className="mb-1 block font-medium">
            Category Name
          </label>

          <input
            name="name"
            defaultValue={category.name}
            required
            className="w-full rounded border p-2"
          />
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