import { prisma } from "@/lib/prisma";

export default async function ActivityLogsPage() {
  const logs =
    await prisma.activityLog.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 200,
    });

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        Activity Logs
      </h1>

      <div className="bg-white border rounded-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">
                Time
              </th>

              <th className="p-3 text-left">
                User
              </th>

              <th className="p-3 text-left">
                Action
              </th>

              <th className="p-3 text-left">
                Details
              </th>
            </tr>
          </thead>

          <tbody>

            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-t"
              >
                <td className="p-3">
                  {log.createdAt.toLocaleString()}
                </td>

                <td className="p-3">
                  {log.user.username}
                </td>

                <td className="p-3">
                  {log.action}
                </td>

                <td className="p-3">
                  {log.details}
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}