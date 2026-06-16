"use server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import bcrypt from "bcryptjs";
import {
  prisma,
} from "@/lib/prisma";

import {
  UserRole,
} from "@prisma/client";

import {
  redirect,
} from "next/navigation";

export async function createUser(
  formData: FormData
) {
  const name =
    formData.get("name") as string;

  const username =
    formData.get("username") as string;

  const password =
    formData.get("password") as string;

  const role =
    formData.get("role") as UserRole;

  const selectedPermissions =
    formData.getAll("permissions");

  const passwordHash =
    await bcrypt.hash(
      password,
      10
    );

  const user =
    await prisma.user.create({
      data: {
        name,
        username,
        passwordHash,
        role,
      },
    });

  for (
    const permissionId
    of selectedPermissions
  ) {
    await prisma.userPermission.create({
      data: {
        userId: user.id,
        permissionId: Number(
          permissionId
        ),
      },
    });
  }
  const cookieStore =
    await cookies();

  const token =
    cookieStore.get("session")?.value;

  if (token) {
    const payload =
      await verifyToken(token);

    await logActivity(
      Number(payload.userId),
      "USER_CREATED",
      `Created user ${user.username}`
    );
  }

  redirect("/users");
}