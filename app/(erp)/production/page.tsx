import { prisma } from "@/lib/prisma";
import MarkReadyButton from "@/components/MarkReadyButton";

export default async function ProductionPage() {
  const items = await prisma.challanItem.findMany({
    include: {
      challan: {
        include: {
          party: true,
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });
  const readyItems = items.filter(
  (item) => item.status === "READY"
);

const receivedItems = items.filter(
  (item) => item.status === "RECEIVED"
);

const readyWeight = readyItems.reduce(
  (sum, item) => sum + item.currentWeight,
  0
);

const receivedWeight = receivedItems.reduce(
  (sum, item) => sum + item.currentWeight,
  0
);

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Ready Material
        </h1>

        <p className="text-gray-500">
          Manage material ready for dispatch
        </p>

      </div>
      <div className="grid grid-cols-4 gap-4">

  <div className="bg-white border rounded-lg p-4">
    <p className="text-sm text-gray-500">
      Ready Items
    </p>

    <p className="text-2xl font-bold">
      {readyItems.length}
    </p>
  </div>

  <div className="bg-white border rounded-lg p-4">
    <p className="text-sm text-gray-500">
      Ready Weight
    </p>

    <p className="text-2xl font-bold">
      {readyWeight} kg
    </p>
  </div>

  <div className="bg-white border rounded-lg p-4">
    <p className="text-sm text-gray-500">
      Received Items
    </p>

    <p className="text-2xl font-bold">
      {receivedItems.length}
    </p>
  </div>

  <div className="bg-white border rounded-lg p-4">
    <p className="text-sm text-gray-500">
      Received Weight
    </p>

    <p className="text-2xl font-bold">
      {receivedWeight} kg
    </p>
  </div>

</div>

      <div className="bg-white border rounded-lg overflow-hidden">

        {items.length === 0 ? (
          <div className="p-6">
            No material found.
          </div>
        ) : (
          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="text-left p-3">
                  Party
                </th>

                <th className="text-left p-3">
                  Challan
                </th>

                <th className="text-left p-3">
                  Item
                </th>

                <th className="text-left p-3">
                  Received
                </th>

                <th className="text-left p-3">
                  Current
                </th>

                <th className="text-left p-3">
                  Status
                </th>
                <th className="text-left p-3 w-40">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-t"
                >

                  <td className="p-3">
                    {item.challan.party.partyName}
                  </td>

                  <td className="p-3">
                    {item.challan.challanNumber}
                  </td>

                  <td className="p-3">
                    {item.itemName}
                  </td>

                  <td className="p-3">
                    {item.receivedWeight} kg
                  </td>

                  <td className="p-3">
                    {item.currentWeight} kg
                  </td>

                  <td className="p-3">
                    {item.status}
                  </td>
                  <td className="p-3">

                    {item.status === "RECEIVED" ||
                      item.status === "READY" ? (
                      <MarkReadyButton
                        itemId={item.id}
                        status={item.status}
                      />
                    ) : (
                      "-"
                    )}

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