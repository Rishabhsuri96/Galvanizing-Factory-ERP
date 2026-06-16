"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { logActivity } from "@/lib/activity";


export async function toggleUserStatus(
    userId: number
) {
    const cookieStore = await cookies();

    const token =
        cookieStore.get("session")?.value;

    if (!token) {
        return;
    }

    const payload =
        await verifyToken(token);

    const currentUserId =
        Number(payload.userId);
    if (
        currentUserId === userId
    ) {
        return;
    }
    const user =
        await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

    if (!user) {
        return;
    }
    const newStatus =
        !user.isActive;
    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            isActive: newStatus,
        },
    });
    await logActivity(
        currentUserId,
        newStatus
            ? "USER_ENABLED"
            : "USER_DISABLED",
        `${newStatus ? "Enabled" : "Disabled"} user ${user.username}`
    );

    revalidatePath("/users");
}