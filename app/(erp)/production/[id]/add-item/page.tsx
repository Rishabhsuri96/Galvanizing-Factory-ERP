import Link from "next/link";
import { notFound } from "next/navigation";
import { ItemStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import AddProductionItemForm from "./AddProductionItemForm";

export default async function AddProductionItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    q?: string;
    itemId?: string;
  }>;
}) {
  await requirePermission("MANAGE_PRODUCTION");

  const { id } = await params;
  const { q, itemId } = await searchParams;
  const batchId = Number(id);
  const query = q?.trim() ?? "";
  const selectedItemId = Number(itemId);

  const batch =
    await prisma.productionBatch.findUnique({
      where: {
        id: batchId,
      },
      select: {
        id: true,
        batchNo: true,
      },
    });

  if (!batch) {
    notFound();
  }

  const searchFilter: Prisma.ChallanItemWhereInput =
    query
      ? {
        OR: [
          {
            itemName: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            challan: {
              challanNumber: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
          {
            challan: {
              party: {
                partyName: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      }
      : {};

  const itemWhere: Prisma.ChallanItemWhereInput = {
    pendingProductionWeight: {
      gt: 0,
    },
    status: {
      not: ItemStatus.COMPLETED,
    },
  };

  const [items, selectedItem] =
    await Promise.all([
      prisma.challanItem.findMany({
        where: itemWhere,
        include: {
          itemCategory: true,
          challan: {
            include: {
              party: true,
            },
          },
        },
        orderBy: {
          id: "desc",
        },
      }),
      selectedItemId
        ? prisma.challanItem.findFirst({
          where: {
            id: selectedItemId,
            pendingProductionWeight: {
              gt: 0,
            },
            status: {
              not: ItemStatus.COMPLETED,
            },
          },
          include: {
            itemCategory: true,
            challan: {
              include: {
                party: true,
              },
            },
            productionItems: {
              select: {
                inputWeight: true,
              },
            },
          },
        })
        : null,
    ]);

  function getSelectHref(
    challanItemId: number
  ) {
    const params = new URLSearchParams();

    if (query) {
      params.set("q", query);
    }

    params.set(
      "itemId",
      String(challanItemId)
    );

    return `/production/${batchId}/add-item?${params.toString()}`;
  }
  const availableItems = items
    .map((item) => ({
      ...item,
      availableWeight: item.pendingProductionWeight,
    }))
    .filter((item) => item.availableWeight > 0);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Add Production Item
          </h1>

          <p className="text-gray-500">
            {batch.batchNo}
          </p>
        </div>

        <Link
          href={`/production/${batch.id}`}
          className="rounded bg-gray-800 px-4 py-2 text-white"
        >
          Back
        </Link>
      </div>

      {selectedItem ? (
        <AddProductionItemForm
          batchId={batch.id}
          selectedItem={selectedItem}
        />
      ) : null}

      <div className="rounded-lg border bg-white p-6">
        <form className="mb-6">
          <label className="mb-1 block font-medium">
            Search
          </label>

          <div className="flex gap-3">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Party, challan number, or item name"
              className="w-full rounded border p-2"
            />

            <button
              type="submit"
              className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </form>

        <h2 className="mb-4 text-xl font-semibold">
          Pending Challan Items
        </h2>

        {availableItems.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-gray-50 p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-2xl">
              📦
            </div>

            <h3 className="text-lg font-semibold text-gray-900">
              No Material Available
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              There are no challan items available for production.
            </p>

            <div className="mt-6 text-sm text-gray-500">
              <p>Possible reasons:</p>

              <ul className="mt-2 space-y-1">
                <li>• All material has already been assigned.</li>
                <li>• No pending challans exist.</li>
                <li>• Your search did not match any records.</li>
              </ul>
            </div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="p-2 text-left">
                  Party
                </th>

                <th className="p-2 text-left">
                  Challan Number
                </th>

                <th className="p-2 text-left">
                  Item Name
                </th>

                <th className="p-2 text-left">
                  Category
                </th>

                <th className="p-2 text-left">
                  Size
                </th>

                <th className="p-2 text-left">
                  Remaining Weight
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
                    {item.challan.party.partyName}
                  </td>

                  <td className="p-2">
                    {item.challan.challanNumber}
                  </td>

                  <td className="p-2">
                    {item.itemName}
                  </td>

                  <td className="p-2">
                    {item.itemCategory?.name ?? "-"}
                  </td>

                  <td className="p-2">
                    {item.size ?? "-"}
                  </td>

                  <td className="p-2">
                    {item.availableWeight} kg
                  </td>

                  <td className="p-2">
                    <Link
                      href={getSelectHref(item.id)}
                      className="rounded bg-blue-600 px-3 py-2 text-white"
                    >
                      Select
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
