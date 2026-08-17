import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ChallansPage() {
  const challans = await prisma.challan.findMany({
    include: {
      party: true,
      items: true,
    },
    orderBy: {
      receivedDate: "desc",
    },
  });

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Inward Challans
          </h1>

          <p className="text-gray-500">
            Manage incoming factory material
          </p>
        </div>

        <div className="flex gap-2">

          <Link
            href="/challans/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            + New Challan
          </Link>

          

        </div>

      </div>

      <div className="bg-white border rounded-lg p-4">

        <p className="text-sm text-gray-500">
          Total Challans
        </p>

        <p className="text-3xl font-bold">
          {challans.length}
        </p>

      </div>

      <div className="bg-white border rounded-lg overflow-hidden">

        {challans.length === 0 ? (
          <div className="p-6">
            No challans found.
          </div>
        ) : (
          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="text-left p-3">
                  Challan No
                </th>

                <th className="text-left p-3">
                  Party
                </th>

                <th className="text-left p-3">
                  Date
                </th>

                <th className="text-left p-3">
                  Vehicle
                </th>

                <th className="text-left p-3">
                  Weight
                </th>

                <th className="text-left p-3">
                  Items
                </th>

              </tr>

            </thead>

            <tbody>

              {challans.map((challan) => (
                <tr
                  key={challan.id}
                  className="border-t"
                >

                  <td className="p-3">

                    <Link
                      href={`/challans/${challan.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {challan.challanNumber}
                    </Link>

                  </td>

                  <td className="p-3">
                    {challan.party.partyName}
                  </td>

                  <td className="p-3">
                    {challan.receivedDate.toLocaleDateString()}
                  </td>

                  <td className="p-3">
                    {challan.vehicleNumber ?? "-"}
                  </td>

                  <td className="p-3">
                    {challan.receivedWeight} kg
                  </td>

                  <td className="p-3">
                    {challan.items.length}
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