import { prisma } from "@/lib/prisma";
import DispatchForm from "./DispatchForm";

export default async function NewDispatchPage() {
  const availableItems = await prisma.challanItem.findMany({
    where: {
      status: {
        in: ["READY", "PARTIALLY_DISPATCHED"],
      },
      currentWeight: {
        gt: 0,
      },
    },
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

  return (

    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        New Dispatch
      </h1>
<DispatchForm
        availableItems={availableItems}
      />
      
    
      {/* Available Material */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">
          Available Ready Material
        </h2>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">
                Party
              </th>

              <th className="p-2 text-left">
                Challan
              </th>

              <th className="p-2 text-left">
                Item
              </th>

              <th className="p-2 text-left">
                Available Weight
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
                  {item.currentWeight} kg
                </td>
              </tr>
            ))}

            {availableItems.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="p-6 text-center text-gray-500"
                >
                  No dispatchable material found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
      </div>
          
    </div>
  );
}