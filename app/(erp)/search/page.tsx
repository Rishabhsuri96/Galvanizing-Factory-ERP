import { prisma } from "@/lib/prisma";
import Link from "next/link";

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({
  searchParams,
}: Props) {
  const { q } = await searchParams;

  const query = q?.trim() || "";

  const parties =
    query.length === 0
      ? []
      : await prisma.party.findMany({
          where: {
            OR: [
              {
                partyName: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                gstNumber: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            ],
          },
        });

  const challans =
    query.length === 0
      ? []
      : await prisma.challan.findMany({
          where: {
            OR: [
              {
                challanNumber: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                vehicleNumber: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            ],
          },
          include: {
            party: true,
          },
        });

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        Search
      </h1>

      <form>
        <input
          name="q"
          defaultValue={query}
          placeholder="Party, Challan, Vehicle..."
          className="w-full rounded-lg border p-3"
        />
      </form>

      {/* Parties */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="mb-4 text-xl font-semibold">
          Parties
        </h2>

        {parties.length === 0 ? (
          <p className="text-gray-500">
            No matching parties
          </p>
        ) : (
          <div className="space-y-2">

            {parties.map((party) => (
              <Link
                key={party.id}
                href={`/parties/${party.id}`}
                className="block rounded border p-3 hover:bg-gray-50"
              >
                {party.partyName}
              </Link>
            ))}

          </div>
        )}

      </div>

      {/* Challans */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="mb-4 text-xl font-semibold">
          Challans
        </h2>

        {challans.length === 0 ? (
          <p className="text-gray-500">
            No matching challans
          </p>
        ) : (
          <div className="space-y-2">

            {challans.map(
              (challan) => (
                <Link
                  key={challan.id}
                  href={`/challans/${challan.id}`}
                  className="block rounded border p-3 hover:bg-gray-50"
                >
                  Challan #
                  {challan.challanNumber}
                  {" • "}
                  {
                    challan.party
                      .partyName
                  }
                </Link>
              )
            )}

          </div>
        )}

      </div>

    </div>
  );
}