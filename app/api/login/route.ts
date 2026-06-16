import { prisma } from "@/lib/prisma";
import { createToken } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/activity";

export async function POST(
  request: Request
) {
  const body = await request.json();

  const user = await prisma.user.findUnique({
  where: {
    username: body.username,
  },
  include: {
    permissions: {
      include: {
        permission: true,
      },
    },
  },
});

  if (!user) {
    return NextResponse.json(
      {
        error: "Invalid username",
      },
      {
        status: 401,
      }
    );
  }
  if (!user.isActive) {
  return NextResponse.json(
    {
      error:
        "Your account has been disabled. Contact administrator.",
    },
    {
      status: 403,
    }
  );
}

  const validPassword =
    await bcrypt.compare(
      body.password,
      user.passwordHash
    );

  if (!validPassword) {
    return NextResponse.json(
      {
        error: "Invalid password",
      },
      {
        status: 401,
      }
    );
  }
  const permissions =
  user.permissions.map(
    (p) => p.permission.code
  );
  const token = await createToken(
  user.id,
  user.username,
  permissions
);

  const cookieStore = await cookies();

  cookieStore.set(
    "session",
    token,
    {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    }
  );
  await logActivity(
  user.id,
  "LOGIN",
  `User ${user.username} logged in`
);

  return NextResponse.json({
    success: true,
  });
}