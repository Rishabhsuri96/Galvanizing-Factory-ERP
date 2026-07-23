import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

export default async function ItemCategoriesPage() {
  await requirePermission("MANAGE_PRODUCTION");

  const categories = await prisma.itemCategory.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Item Categories
          </h1>

          <p className="text-gray-500">
            Manage item categories used throughout the ERP.
          </p>
        </div>

        <Link
          href="/item-categories/new"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Add Category
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">
                Name
              </th>

              <th className="p-3 text-left">
                Status
              </th>

              

              <th className="p-3 text-right">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="p-6 text-center text-gray-500"
                >
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-t"
                >
                  <td className="p-3 font-medium">
                    {category.name}
                  </td>

                  <td className="p-3">
                    {category.isActive ? (
                      <span className="rounded bg-green-100 px-2 py-1 text-sm text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="rounded bg-red-100 px-2 py-1 text-sm text-red-700">
                        Inactive
                      </span>
                    )}
                  </td>


                  <td className="p-3 text-right">
                    <Link
                      href={`/item-categories/${category.id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}