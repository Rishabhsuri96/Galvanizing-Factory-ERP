import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function proxy(
  request: NextRequest
) {
  const token =
    request.cookies.get("session")
      ?.value;

  const pathname =
    request.nextUrl.pathname;

  const publicRoutes = [
    "/login",
    "/api/login",
  ];

  const isPublic =
    publicRoutes.some((route) =>
      pathname.startsWith(route)
    );

  if (isPublic) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    );
  }

  try {
    const payload =
      await verifyToken(token);

    const permissions =
      (payload.permissions ??
        []) as string[];

    const routePermissions = [
      {
        path: "/dashboard",
        permission:
          "VIEW_DASHBOARD",
      },
      {
        path: "/search",
        permission:
          "VIEW_SEARCH",
      },
      {
        path: "/parties",
        permission:
          "MANAGE_PARTIES",
      },
      {
        path: "/challans",
        permission:
          "MANAGE_CHALLANS",
      },
      {
        path: "/production",
        permission:
          "MANAGE_PRODUCTION",
      },
      {
        path: "/dispatch",
        permission:
          "MANAGE_DISPATCH",
      },
      {
        path: "/reports",
        permission:
          "VIEW_REPORTS",
      },
      {
        path: "/users",
        permission:
          "MANAGE_USERS",
      },
      {
        path: "/activity-logs",
        permission: "VIEW_ACTIVITY_LOGS",
      }
    ];

    const matchedRoute =
      routePermissions.find(
        (route) =>
          pathname.startsWith(
            route.path
          )
      );

    if (
      matchedRoute &&
      !permissions.includes(
        matchedRoute.permission
      )
    ) {
      return NextResponse.redirect(
        new URL(
          "/dashboard",
          request.url
        )
      );
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    );
  }
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/parties/:path*",
    "/challans/:path*",
    "/production/:path*",
    "/dispatch/:path*",
    "/reports/:path*",
    "/search/:path*",
    "/users/:path*",
    "/pending-challans/:path*",
    "/activity-logs/:path*",
  ],
};