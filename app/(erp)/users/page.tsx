import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { toggleUserStatus } from "./actions";

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export default async function UsersPage() {
    const cookieStore = await cookies();

    const token =
        cookieStore.get("session")?.value;

    let currentUserId = 0;

    if (token) {
        const payload =
            await verifyToken(token);

        currentUserId =
            Number(payload.userId);
    }
    const users = await prisma.user.findMany({
        include: {
            permissions: true,
        },
        orderBy: {
            name: "asc",
        },
    });

    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-3xl font-bold">
                        Users
                    </h1>

                    <p className="text-gray-500">
                        Manage ERP users
                    </p>
                </div>

                <Link
                    href="/users/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    + New User
                </Link>

            </div>

            <div className="bg-white border rounded-lg overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">
                                Name
                            </th>

                            <th className="p-3 text-left">
                                Username
                            </th>

                            <th className="p-3 text-left">
                                Role
                            </th>

                            <th className="p-3 text-left">
                                Permissions
                            </th>
                            <th className="p-3 text-left">
                                Status
                            </th>
                            <th className="p-3 text-left">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>

                        {users.map((user) => (
                            <tr
                                key={user.id}
                                className="border-t"
                            >
                                <td className="p-3">
                                    {user.name}
                                </td>

                                <td className="p-3">
                                    {user.username}
                                </td>

                                <td className="p-3">
                                    {user.role}
                                </td>

                                <td className="p-3">
                                    {user.permissions.length}
                                </td>
                                <td className="p-3">
                                    {user.isActive ? (
                                        <span className="text-green-600 font-medium">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="text-red-600 font-medium">
                                            Disabled
                                        </span>
                                    )}
                                </td>
                                <td className="p-3">

                                    {user.id === currentUserId ? (

                                        <span className="text-gray-500 text-sm">
                                            Current User
                                        </span>

                                    ) : (

                                        <form
                                            action={async () => {
                                                "use server";

                                                await toggleUserStatus(
                                                    user.id
                                                );
                                            }}
                                        >
                                            <button
                                                type="submit"
                                                className={
                                                    user.isActive
                                                        ? "rounded bg-red-600 px-3 py-1 text-white"
                                                        : "rounded bg-green-600 px-3 py-1 text-white"
                                                }
                                            >
                                                {user.isActive
                                                    ? "Disable"
                                                    : "Enable"}
                                            </button>
                                        </form>

                                    )}

                                </td>
                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}