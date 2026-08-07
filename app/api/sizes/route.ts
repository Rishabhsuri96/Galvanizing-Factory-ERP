import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

export async function GET(request: Request) {
  await requirePermission("MANAGE_PRODUCTION");

  const { searchParams } = new URL(request.url);

  const categoryId = Number(
    searchParams.get("categoryId")
  );

  if (!categoryId || Number.isNaN(categoryId)) {
    return NextResponse.json([], {
      status: 200,
    });
  }

  const sizes = await prisma.size.findMany({
    where: {
      itemCategoryId: categoryId,
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
    },
  });

  return NextResponse.json(sizes);
}