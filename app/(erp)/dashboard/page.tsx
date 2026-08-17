import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const pendingResult = await prisma.challanItem.aggregate({
    where: {
      pendingProductionWeight: {
        gt: 0,
      },
    },
    _sum: {
      pendingProductionWeight: true,
    },
  });

  const readyResult = await prisma.challanItem.aggregate({
    where: {
      readyWeight: {
        gt: 0,
      },
    },
    _sum: {
      readyWeight: true,
    },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayDispatches =
    await prisma.dispatch.findMany({
      where: {
        dispatchDate: {
          gte: today,
        },
      },
      include: {
        items: true,
      },
    });

  const todayDispatchWeight =
    todayDispatches.reduce(
      (sum, dispatch) =>
        sum +
        dispatch.items.reduce(
          (itemSum, item) =>
            itemSum + item.outputWeight,
          0
        ),
      0
    );

  const vehiclesToday =
    await prisma.dispatch.count({
      where: {
        dispatchDate: {
          gte: today,
        },
      },
    });

  const pendingChallans =
    await prisma.challan.count({
      where: {
        items: {
          some: {
            pendingProductionWeight: {
              gt: 0,
            },
          },
        },
      },
    });

  const pendingChallansPreview =
    await prisma.challan.findMany({
      where: {
        items: {
          some: {
            pendingProductionWeight: {
              gt: 0,
            },
          },
        },
      },
      include: {
        party: true,
        items: true,
      },
      orderBy: {
        receivedDate: "desc",
      },
      take: 5,
    });

  const totalParties =
    await prisma.party.count();
  const todayProduction =
    await prisma.productionBatchItem.aggregate({
      where: {
        completedAt: {
          gte: today,
        },
      },
      _sum: {
        inputWeight: true,
        outputWeight: true,
        contractorAmount: true,
      },
    });

  const activeProductionBatches =
    await prisma.productionBatch.count({
      where: {
        items: {
          some: {
            completedAt: null,
          },
        },
      },
    });

  const recentDispatches =
    await prisma.dispatch.findMany({
      include: {
        items: true,
      },
      orderBy: {
        dispatchDate: "desc",
      },
      take: 5,
    });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Factory Dashboard
      </h1>

      <div className="grid gap-4 md:grid-cols-4">
        <Link href="/pending-challans">
          <div className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition cursor-pointer">
            <h2 className="text-sm text-gray-500">
              Pending For Galvanizing
            </h2>

            <p className="mt-2 text-3xl font-bold">
              {pendingResult._sum.pendingProductionWeight ?? 0} kg
            </p>
          </div>
        </Link>

        <Link href="/production">
          <div className="rounded-xl border-2 border-green-500 bg-white p-6 shadow-sm">
            <h2 className="text-sm text-gray-500">
              Ready For Dispatch
            </h2>

            <p className="mt-2 text-3xl font-bold">
              {readyResult._sum.readyWeight ?? 0} kg
            </p>
          </div>
        </Link>

        <Link href="/pending-challans">
          <div className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition cursor-pointer">
            <h2 className="text-sm text-gray-500">
              Pending Challans
            </h2>

            <p className="mt-2 text-3xl font-bold">
              {pendingChallans}
            </p>
          </div>
        </Link>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-sm text-gray-500">
            Today's Dispatch
          </h2>

          <p className="mt-2 text-3xl font-bold">
            {todayDispatchWeight} kg
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-sm text-gray-500">
            Vehicles Today
          </h2>

          <p className="mt-2 text-3xl font-bold">
            {vehiclesToday}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-sm text-gray-500">
            Total Parties
          </h2>

          <p className="mt-2 text-3xl font-bold">
            {totalParties}
          </p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-sm text-gray-500">
            Today's Production
          </h2>

          <p className="mt-2 text-3xl font-bold">
            {todayProduction._sum.inputWeight ?? 0} kg
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-sm text-gray-500">
            Today's Output
          </h2>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {todayProduction._sum.outputWeight ?? 0} kg
          </p>
        </div>

       

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-sm text-gray-500">
            Today's Contractor Cost
          </h2>

          <p className="mt-2 text-3xl font-bold text-purple-600">
            ₹ {todayProduction._sum.contractorAmount ?? 0}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-sm text-gray-500">
            Active Production Batches
          </h2>

          <p className="mt-2 text-3xl font-bold">
            {activeProductionBatches}
          </p>
        </div>
      </div>


      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Pending Challans
          </h2>

          <Link
            href="/pending-challans"
            className="text-blue-600 hover:underline"
          >
            View All →
          </Link>
        </div>

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
                Pending Production
              </th>

              <th className="p-2 text-left">
                Date
              </th>
            </tr>
          </thead>

          <tbody>
            {pendingChallansPreview.map(
              (challan) => {
                const pendingProductionWeight =
                  challan.items.reduce(
                    (sum, item) =>
                      sum +
                      item.pendingProductionWeight,
                    0
                  );

                return (
                  <tr
                    key={challan.id}
                    className="border-b"
                  >
                    <td className="p-2">
                      {challan.party.partyName}
                    </td>

                    <td className="p-2">
                      <Link
                        href={`/challans/${challan.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {challan.challanNumber}
                      </Link>
                    </td>

                    <td className="p-2">
                      {pendingProductionWeight} kg
                    </td>

                    <td className="p-2">
                      {challan.receivedDate.toLocaleDateString()}
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">
          Recent Dispatches
        </h2>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">
                Vehicle
              </th>

              <th className="p-2 text-left">
                Date
              </th>

              <th className="p-2 text-left">
                Items
              </th>

              <th className="p-2 text-left">
                Weight
              </th>
            </tr>
          </thead>

          <tbody>
            {recentDispatches.map(
              (dispatch) => {
                const totalWeight =
                  dispatch.items.reduce(
                    (sum, item) =>
                      sum + item.outputWeight,
                    0
                  );

                return (
                  <tr
                    key={dispatch.id}
                    className="border-b"
                  >
                    <td className="p-2">
                      {dispatch.vehicleNumber}
                    </td>

                    <td className="p-2">
                      {new Date(
                        dispatch.dispatchDate
                      ).toLocaleDateString()}
                    </td>

                    <td className="p-2">
                      {dispatch.items.length}
                    </td>

                    <td className="p-2">
                      {totalWeight} kg
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}