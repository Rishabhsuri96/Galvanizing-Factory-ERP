import bcrypt from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const permissions = [
    {
      code: "VIEW_DASHBOARD",
      name: "View Dashboard",
    },
    {
      code: "VIEW_SEARCH",
      name: "View Search",
    },
    {
      code: "MANAGE_PARTIES",
      name: "Manage Parties",
    },
    {
      code: "MANAGE_CHALLANS",
      name: "Manage Challans",
    },
    {
      code: "MANAGE_PRODUCTION",
      name: "Manage Production",
    },
    {
      code: "MANAGE_DISPATCH",
      name: "Manage Dispatch",
    },
    {
      code: "VIEW_REPORTS",
      name: "View Reports",
    },
    {
      code: "MANAGE_USERS",
      name: "Manage Users",
    },
    {
      code: "VIEW_ACTIVITY_LOGS",
      name: "View Activity Logs",
    },
    {
      code: "MANAGE_CONTRACTORS",
      name: "Manage Contractors",
    },
    {
      code: "MANAGE_FURNACES",
      name: "Manage Furnaces",
    },
    {
      code: "MANAGE_ZINC",
      name: "Manage Zinc",
    },
    {
      code: "MANAGE_EXPENSES",
      name: "Manage Expenses",
    },
    {
      code: "VIEW_ANALYTICS",
      name: "View Analytics",
    },
    {
      code: "USE_AI_ASSISTANT",
      name: "Use AI Assistant",
    },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: {
        code: permission.code,
      },
      update: {},
      create: permission,
    });
  }

  const passwordHash = await bcrypt.hash(
    "owner123",
    10
  );

  const owner = await prisma.user.upsert({
    where: {
      username: "owner",
    },
    update: {},
    create: {
      name: "System Owner",
      username: "owner",
      passwordHash,
      role: UserRole.OWNER,
    },
  });

  const allPermissions =
    await prisma.permission.findMany();

  for (const permission of allPermissions) {
    await prisma.userPermission.upsert({
      where: {
        userId_permissionId: {
          userId: owner.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        userId: owner.id,
        permissionId: permission.id,
      },
    });
  }

  console.log("Owner user created");
  console.log("Permissions assigned");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });