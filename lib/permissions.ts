import { redirect } from "next/navigation";
import { getCurrentUser } from "./current-user";

export async function requirePermission(permission: string) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    if (!user.permissions.includes(permission)) {
        redirect("/unauthorized");
    }

    return user;
}