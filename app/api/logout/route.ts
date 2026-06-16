import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import { logActivity } from "@/lib/activity";

export async function POST() {

  const user =
    await getCurrentUser();

  if (user) {
    await logActivity(
      user.id,
      "LOGOUT",
      `User ${user.username} logged out`
    );
  }

  const cookieStore =
    await cookies();

  cookieStore.delete("session");

  return NextResponse.json({
    success: true,
  });
}