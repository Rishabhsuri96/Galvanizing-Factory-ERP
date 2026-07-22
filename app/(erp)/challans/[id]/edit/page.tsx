import ChallanForm from "@/components/ChallanForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateChallan } from "./actions";

const standardSizes = new Set([
  "M8",
  "M10",
  "M12",
  "M16",
  "M20",
  "M22",
  "M24",
  "M30",
]);

function toDateInputValue(date: Date) {
  return date.toISOString().split("T")[0];
}

export default async function EditChallanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const challanId = Number(id);

  const [challan, parties, itemCategories] =
    await Promise.all([
      prisma.challan.findUnique({
        where: {
          id: challanId,
        },
        include: {
          items: {
            include: {
              dispatchItems: true,
              productionItems: true,
            },
          },
        },
      }),
      prisma.party.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          partyName: "asc",
        },
        select: {
          id: true,
          partyName: true,
        },
      }),
      prisma.itemCategory.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
        },
      }),
    ]);

  if (!challan) {
    notFound();
  }

  const hasStartedWork =
    challan.items.some(
      (item) =>
        item.dispatchItems.length > 0 ||
        item.productionItems.length > 0
    );

  return (
    <div className="max-w-5xl">
      <h1 className="mb-6 text-3xl font-bold">
        Edit Inward Challan
      </h1>

      {hasStartedWork ? (
        <div className="rounded border bg-white p-6 text-gray-500">
          This challan cannot be edited because dispatch or production work has already started.
        </div>
      ) : (
        <form
          action={updateChallan.bind(null, challan.id)}
        >
          <ChallanForm
            parties={parties}
            itemCategories={itemCategories}
            submitLabel="Update Challan"
            initialChallan={{
              partyId: challan.partyId,
              challanNumber:
                challan.challanNumber,
              receivedDate: toDateInputValue(
                challan.receivedDate
              ),
              vehicleNumber:
                challan.vehicleNumber ?? "",
              ewayNumber:
                challan.ewayNumber ?? "",
              items: challan.items.map((item) => {
                const itemSize =
                  item.size ?? "";
                const isStandardSize =
                  standardSizes.has(itemSize);

                return {
                  id: item.id,
                  itemCategoryId: String(
                    item.itemCategoryId ?? ""
                  ),
                  size: isStandardSize
                    ? itemSize
                    : itemSize
                      ? "Other"
                      : "",
                  customSize:
                    !isStandardSize && itemSize
                      ? itemSize
                      : "",
                  itemName: item.itemName,
                  weight: String(
                    item.receivedWeight
                  ),
                };
              }),
            }}
          />
        </form>
      )}
    </div>
  );
}
