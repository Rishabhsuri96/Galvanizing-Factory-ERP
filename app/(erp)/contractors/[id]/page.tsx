import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ContractorDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const contractor = await prisma.contractor.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      rates: {
        where: {
          isActive: true,
        },
        include: {
          itemCategory: true,
          size: true,
        },
        orderBy: [
          {
            itemCategory: {
              name: "asc",
            },
          },
          {
            size: {
              name: "asc",
            },
          }
        ],
      },
      batches: {
        orderBy: {
          processDate: "desc",
        },
        take: 10,
      },
    },
  });

  if (!contractor) {
    notFound();
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            {contractor.name}
          </h1>

          <p className="text-gray-500">
            Contractor Details
          </p>
        </div>

        <Link
          href={`/contractors/${contractor.id}/edit`}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Edit Contractor
        </Link>

      </div>

      {/* Basic Information */}

      <div className="rounded-lg border bg-white p-6">

        <h2 className="mb-4 text-xl font-semibold">
          Basic Information
        </h2>

        <div className="grid grid-cols-2 gap-6">

          <div>
            <p className="text-sm text-gray-500">
              Name
            </p>

            <p className="font-medium">
              {contractor.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Phone
            </p>

            <p className="font-medium">
              {contractor.phone || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Address
            </p>

            <p className="font-medium">
              {contractor.address || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Status
            </p>

            <p
              className={
                contractor.isActive
                  ? "font-medium text-green-600"
                  : "font-medium text-red-600"
              }
            >
              {contractor.isActive ? "Active" : "Disabled"}
            </p>
          </div>

          <div className="col-span-2">
            <p className="text-sm text-gray-500">
              Remarks
            </p>

            <p className="font-medium">
              {contractor.remarks || "-"}
            </p>
          </div>

        </div>

      </div>

      {/* Current Rates */}

      <div className="rounded-lg border bg-white p-6">

        <h2 className="mb-4 text-xl font-semibold">
          Current Rates
        </h2>

        {contractor.rates.length === 0 ? (
          <p className="text-gray-500">
            No active rates found.
          </p>
        ) : (
          <table className="w-full">

            <thead className="border-b">

              <tr>

                <th className="p-2 text-left">
                  Category
                </th>

                <th className="p-2 text-left">
                  Size
                </th>

                <th className="p-2 text-left">
                  Rate
                </th>

                <th className="p-2 text-left">
                  Effective From
                </th>

              </tr>

            </thead>

            <tbody>

              {contractor.rates.map((rate) => (

                <tr
                  key={rate.id}
                  className="border-b"
                >

                  <td className="p-2">
                    {rate.itemCategory.name}
                  </td>

                  <td className="p-2">
                    {rate.size?.name ?? "-"}
                  </td>

                  <td className="p-2">
                    ₹{rate.ratePerKg.toFixed(2)} / kg
                  </td>

                  <td className="p-2">
                    {rate.effectiveFrom.toLocaleDateString()}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>
        )}

      </div>

      {/* Production Summary */}

      <div className="rounded-lg border bg-white p-6">

        <h2 className="mb-4 text-xl font-semibold">
          Production Summary
        </h2>

        <div className="grid grid-cols-3 gap-6">

          <div>

            <p className="text-sm text-gray-500">
              Total Batches
            </p>

            <p className="text-2xl font-bold">
              {contractor.batches.length}
            </p>

          </div>

          <div>

            <p className="text-sm text-gray-500">
              Last Batch
            </p>

            <p className="font-medium">
              {contractor.batches[0]?.batchNo ?? "-"}
            </p>

          </div>

          <div>

            <p className="text-sm text-gray-500">
              Last Process Date
            </p>

            <p className="font-medium">
              {contractor.batches[0]
                ? contractor.batches[0].processDate.toLocaleDateString()
                : "-"}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}
