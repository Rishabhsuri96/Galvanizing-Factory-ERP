
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
const sidebarLink =
    "transition duration-150 hover:scale-105 hover:text-white";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const token =
        (await cookies())
            .get("session")
            ?.value;

    let permissions: string[] = [];
    let displayName = "";

    if (token) {
        try {
            const payload =
                await verifyToken(token);

            permissions =
                (payload.permissions ??
                    []) as string[];

            const user =
                await prisma.user.findUnique({
                    where: {
                        id: Number(payload.userId),
                    },
                    select: {
                        name: true,
                    },
                });

            displayName =
                user?.name ??
                String(payload.username ?? "");
        } catch { }
    }

    return (

        <html lang="en">
            <body>

                <div className="flex h-screen">

                    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col bg-gray-900 px-6 pt-3 text-white">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold">
                                GFS ERP
                            </h1>

                            <p className="text-sm text-gray-400">
                                Galvanizing Factory ERP
                            </p>
                        </div>

                        <nav className="flex-1 overflow-y-auto pr-2">
                            <div className="flex flex-col gap-6">
                                {/* Dashboard */}

                                {permissions.includes(
                                    "VIEW_DASHBOARD"
                                ) && (
                                        <Link
                                            href="/dashboard"
                                            className={sidebarLink}
                                        >
                                            Dashboard
                                        </Link>
                                    )}

                                {/* Operations */}

                                <div>
                                    <p className="mb-2 text-xs font-semibold uppercase text-gray-400">
                                        Operations
                                    </p>

                                    <div className="flex flex-col gap-3">

                                        {permissions.includes(
                                            "MANAGE_CHALLANS"
                                        ) && (
                                                <Link href="/challans" className={sidebarLink}>
                                                    Challans
                                                </Link>
                                            )}

                                        {permissions.includes(
                                            "MANAGE_CHALLANS"
                                        ) && (
                                                <Link href="/pending-challans" className={sidebarLink}>
                                                    Pending Challans
                                                </Link>
                                            )}

                                        {permissions.includes(
                                            "MANAGE_PRODUCTION"
                                        ) && (
                                                <Link href="/production" className={sidebarLink}>
                                                    Production
                                                </Link>
                                            )}

                                        {permissions.includes(
                                            "MANAGE_DISPATCH"
                                        ) && (
                                                <Link href="/dispatch" className={sidebarLink}>
                                                    Dispatch
                                                </Link>
                                            )}

                                    </div>
                                </div>

                                {/* Masters */}

                                <div>
                                    <p className="mb-2 text-xs font-semibold uppercase text-gray-400">
                                        Masters
                                    </p>

                                    <div className="flex flex-col gap-3">

                                        {permissions.includes("MANAGE_PARTIES") && (
                                            <Link href="/parties" className={sidebarLink}>
                                                Parties
                                            </Link>
                                        )}

                                        {permissions.includes("MANAGE_CONTRACTORS") && (
                                            <Link href="/contractors" className={sidebarLink}>
                                                Contractors
                                            </Link>
                                        )}

                                        {permissions.includes("MANAGE_FURNACES") && (
                                            <Link href="/furnaces" className={sidebarLink}>
                                                Furnaces
                                            </Link>
                                        )}

                                        {permissions.includes("MANAGE_PRODUCTION") && (
                                            <>
                                                <Link href="/item-categories" className={sidebarLink}>
                                                    Item Categories
                                                </Link>

                                                <Link href="/sizes" className={sidebarLink}>
                                                    Sizes
                                                </Link>

                                                <Link href="/contractor-rates" className={sidebarLink}>
                                                    Contractor Rates
                                                </Link>

                                                <Link href="/zinc-inventory" className={sidebarLink}>
                                                    Zinc Inventory
                                                </Link>
                                                <Link href="/chemical-inventory" className={sidebarLink}>
                                                    Chemical Inventory
                                                </Link>
                                            </>
                                        )}

                                    </div>
                                </div>

                                {/* Reports */}

                                <div>
                                    <p className="mb-2 text-xs font-semibold uppercase text-gray-400">
                                        Reports
                                    </p>

                                    <div className="flex flex-col gap-3">

                                        {permissions.includes(
                                            "VIEW_SEARCH"
                                        ) && (
                                                <Link href="/search" className={sidebarLink}>
                                                    Search
                                                </Link>
                                            )}

                                        {permissions.includes(
                                            "VIEW_REPORTS"
                                        ) && (
                                                <Link href="/reports" className={sidebarLink}>
                                                    Reports
                                                </Link>
                                            )}

                                    </div>
                                </div>

                                {/* Administration */}

                                <div>
                                    <p className="mb-2 text-xs font-semibold uppercase text-gray-400">
                                        Administration
                                    </p>

                                    <div className="flex flex-col gap-3">

                                        {permissions.includes(
                                            "MANAGE_USERS"
                                        ) && (
                                                <Link href="/users" className={sidebarLink}>
                                                    Users
                                                </Link>
                                            )}

                                        {permissions.includes(
                                            "VIEW_ACTIVITY_LOGS"
                                        ) && (
                                                <Link href="/activity-logs" className={sidebarLink}>
                                                    Activity Logs
                                                </Link>
                                            )}

                                    </div>
                                </div>

                            </div>


                        </nav>
                        <div className="border-t border-gray-700 pt-4 pb-4">

                            <p className="text-xs text-gray-400">
                                Logged in as
                            </p>

                            <p className="mb-4 font-medium">
                                {displayName}
                            </p>

                            <LogoutButton />

                        </div>

                    </aside>

                    <main className="ml-64 flex-1 overflow-y-auto bg-gray-100 p-8">
                        {children}
                    </main>

                </div>

            </body>
        </html>
    );
}
