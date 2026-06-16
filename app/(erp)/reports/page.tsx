import Link from "next/link";

export default function ReportsPage() {
  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        Reports
      </h1>

      <div className="grid gap-4 md:grid-cols-2">

        <Link
          href="/pending-challans"
          className="rounded-xl border bg-white p-6 shadow-sm hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold">
            Pending Challans
          </h2>

          <p className="mt-2 text-gray-500">
            Material still lying in factory
          </p>
        </Link>

        <Link
          href="/dispatch"
          className="rounded-xl border bg-white p-6 shadow-sm hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold">
            Dispatch Report
          </h2>

          <p className="mt-2 text-gray-500">
            All dispatched vehicles and material
          </p>
        </Link>

        <Link
          href="/production"
          className="rounded-xl border bg-white p-6 shadow-sm hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold">
            Ready Material Report
          </h2>

          <p className="mt-2 text-gray-500">
            Material ready for dispatch
          </p>
        </Link>

        <Link
          href="/parties"
          className="rounded-xl border bg-white p-6 shadow-sm hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold">
            Party Report
          </h2>

          <p className="mt-2 text-gray-500">
            Party-wise material status
          </p>
        </Link>

      </div>

    </div>
  );
}