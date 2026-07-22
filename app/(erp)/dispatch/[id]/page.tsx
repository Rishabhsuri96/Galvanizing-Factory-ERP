import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DispatchDetailPage(
  { params }: Props
) {
  const { id } = await params;

  const dispatch =
    await prisma.dispatch.findUnique({
      where: {
        id: Number(id),
      },
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
      <h1 className="text-3xl font-bold">
        Dispatch Details
      </h1>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <p>
          <strong>Vehicle:</strong>{" "}
          {dispatch.vehicleNumber}
        </p>

        <p>
          <strong>Date:</strong>{" "}
          {new Date(
            dispatch.dispatchDate
          ).toLocaleDateString()}
        </p>

        <p>
          <strong>Remarks:</strong>{" "}
          {dispatch.remarks || "-"}
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
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
                Output Weight
              </th>

              <th className="p-2 text-left">
                Zinc Added
              </th>

              <th className="p-2 text-left">
                Zinc %
              </th>
            </tr>
          </thead>

          <tbody>
            {dispatch.items.map(
              (item) => (
                <tr
                  key={item.id}
                  className="border-b"
                >
                  <td className="p-2">
                    {
                      item.challanItem
                        .challan.party
                        .partyName
                    }
                  </td>

                  <td className="p-2">
                    {
                      item.challanItem
                        .challan
                        .challanNumber
                    }
                  </td>

                  <td className="p-2">
                    {
                      item.challanItem
                        .itemName
                    }
                  </td>

                  <td className="p-2">
                    {item.actualOutputWeight} kg
                  </td>

                  <td className="p-2">
                    {item.zincAddedWeight?.toFixed(2)} kg
                  </td>

                  <td className="p-2">
                    {item.zincPercentage?.toFixed(2)} %
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}