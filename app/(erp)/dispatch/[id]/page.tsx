import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};
export default async function DispatchDetailPage({
  params,
}: Props) {
  const { id: rawId } = await params;
  // ✅ prevent crash on first render
  if (!rawId) {
    return <div>Loading...</div>;
  }

  const id = parseInt(rawId, 10);

  // ✅ handle invalid safely (NO throw)
  if (!id) {
    notFound();
  }

  const dispatch = await prisma.dispatch.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          challanItem: {
            include: {
              challan: {
                include: {
                  party: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!dispatch) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">
        Dispatch Details
      </h1>

      <div className="rounded-xl border bg-white p-6 shadow-sm space-y-2">
        <p>
          <strong>Vehicle:</strong>{" "}
          {dispatch.vehicleNumber}
        </p>

        <p>
          <strong>Date:</strong>{" "}
          {new Date(dispatch.dispatchDate).toLocaleDateString()}
        </p>

        <p>
          <strong>Remarks:</strong>{" "}
          {dispatch.remarks || "-"}
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-2 text-left">Party</th>
              <th className="p-2 text-left">Challan</th>
              <th className="p-2 text-left">Item</th>
              <th className="p-2 text-left">Input</th>
              <th className="p-2 text-left">Output</th>
              <th className="p-2 text-left">Zinc Added</th>
              <th className="p-2 text-left">Zinc %</th>
            </tr>
          </thead>

          <tbody>
            {dispatch.items.map((item) => {
              const input = item.inputWeight || 0;
              const output = item.outputWeight || 0;

              const zincAdded = output - input;

              const zincPercentage =
                input > 0 ? (zincAdded / input) * 100 : 0;

              return (
                <tr key={item.id} className="border-b">
                  <td className="p-2">
                    {
                      item.challanItem.challan.party
                        .partyName
                    }
                  </td>

                  <td className="p-2">
                    {
                      item.challanItem.challan
                        .challanNumber
                    }
                  </td>

                  <td className="p-2">
                    {item.challanItem.itemName}
                  </td>

                  <td className="p-2">
                    {input} kg
                  </td>

                  <td className="p-2">
                    {output} kg
                  </td>

                  <td className="p-2">
                    {zincAdded.toFixed(2)} kg
                  </td>

                  <td className="p-2">
                    {zincPercentage.toFixed(2)} %
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}