import { prisma } from "@/lib/prisma";

export default async function ChallanDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const challan = await prisma.challan.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      party: true,
      items: {
        include: {
          dispatchItems: {
            include: {
              dispatch: true,
            },
          },
        },
      },
    },
  });

  if (!challan) {
    return (
      <div>
        Challan not found.
      </div>
    );
  }
  const dispatchHistory =
  challan.items.flatMap(
    (item) =>
      item.dispatchItems.map(
        (dispatchItem) => ({
          itemName: item.itemName,

          dispatchedWeight:
            dispatchItem.dispatchedWeight,

          vehicleNumber:
            dispatchItem.dispatch
              .vehicleNumber,

          dispatchDate:
            dispatchItem.dispatch
              .dispatchDate,
        })
      )
  );
  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Challan #{challan.challanNumber}
        </h1>

        <p className="text-gray-500">
          Material Receipt Details
        </p>

      </div>

      <div className="bg-white border rounded-lg p-4">

        <div className="grid grid-cols-2 gap-4">

          <div>
            <strong>Party:</strong>{" "}
            {challan.party.partyName}
          </div>

          <div>
            <strong>Date:</strong>{" "}
            {challan.receivedDate.toLocaleDateString()}
          </div>

          <div>
            <strong>Vehicle:</strong>{" "}
            {challan.vehicleNumber ?? "-"}
          </div>

          <div>
            <strong>E-Way:</strong>{" "}
            {challan.ewayNumber ?? "-"}
          </div>

        </div>

      </div>
      <div className="grid gap-4 md:grid-cols-3">

        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-gray-500">
            Received
          </p>

          <p className="text-3xl font-bold">
            {challan.receivedWeight} kg
          </p>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-gray-500">
            Remaining
          </p>

          <p className="text-3xl font-bold">
            {challan.items.reduce(
              (sum, item) =>
                sum + item.currentWeight,
              0
            )} kg
          </p>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-gray-500">
            Dispatched
          </p>

          <p className="text-3xl font-bold">
            {challan.receivedWeight -
              challan.items.reduce(
                (sum, item) =>
                  sum + item.currentWeight,
                0
              )} kg
          </p>
        </div>

      </div>

      <div className="bg-white border rounded-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-3">
                Item Name
              </th>

              <th className="text-left p-3">
                Received Weight
              </th>

              <th className="text-left p-3">
                Current Weight
              </th>

              <th className="text-left p-3">
                Status
              </th>
              <th className="text-left p-3">
                Dispatched
              </th>

            </tr>

          </thead>

          <tbody>

            {challan.items.map((item) => (
              <tr
                key={item.id}
                className="border-t"
              >

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
                  {item.receivedWeight -
                    item.currentWeight}{" "}
                  kg
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      <div className="bg-white border rounded-lg p-4">

        <p className="text-lg font-bold">
          Total Weight: {challan.receivedWeight} kg
        </p>

      </div>
      <div className="bg-white border rounded-lg overflow-hidden">

        <div className="p-4 border-b">

          <h2 className="text-xl font-semibold">
            Dispatch History
          </h2>

        </div>

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-3">
                Date
              </th>

              <th className="text-left p-3">
                Vehicle
              </th>

              <th className="text-left p-3">
                Item
              </th>

              <th className="text-left p-3">
                Weight
              </th>

            </tr>

          </thead>

          <tbody>

            {dispatchHistory.length === 0 ? (

              <tr>

                <td
                  colSpan={4}
                  className="p-6 text-center text-gray-500"
                >
                  No Dispatches Yet
                </td>

              </tr>

            ) : (

              dispatchHistory.map(
                (entry, index) => (

                  <tr
                    key={index}
                    className="border-t"
                  >

                    <td className="p-3">

                      {new Date(
                        entry.dispatchDate
                      ).toLocaleDateString()}

                    </td>

                    <td className="p-3">

                      {entry.vehicleNumber ??
                        "-"}

                    </td>

                    <td className="p-3">

                      {entry.itemName}

                    </td>

                    <td className="p-3">

                      {entry.dispatchedWeight} kg

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>
    </div>
  );
}