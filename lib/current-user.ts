import { cookies } from "next/headers";
import { verifyToken } from "./auth";

export async function getCurrentUser() {
  const token = (await cookies()).get("session")?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = await verifyToken(token);

    return {
      id: Number(payload.userId),
      username: String(payload.username),
      permissions: payload.permissions as string[],
    };
  } catch {
    return null;
  }
}