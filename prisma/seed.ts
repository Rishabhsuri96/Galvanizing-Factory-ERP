import bcrypt from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash(
    "owner123",
    10
  );

  await prisma.$transaction(async (tx) => {
    // ==========================
    // Permissions
    // ==========================
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
        code: "VIEW_ANALYTICS",
        name: "View Analytics",
      },
      {
        code: "MANAGE_ITEM_CATEGORIES",
        name: "Manage Item Categories",
      },
      {
        code: "MANAGE_EXPENSES",
        name: "Manage Expenses",
      },
      {
        code: "USE_AI_ASSISTANT",
        name: "Use AI Assistant",
      },
    ];

    for (const permission of permissions) {
      await tx.permission.upsert({
        where: {
          code: permission.code,
        },
        update: {},
        create: permission,
      });
    }

    console.log("[OK] Permissions seeded");

    // ==========================
    // Item Categories
    // ==========================
    const itemCategories = [
      "Nut Bolt",
      "Washer",
      "Stud",
      "Structure",
      "Others",
    ];

    for (const name of itemCategories) {
      await tx.itemCategory.upsert({
        where: {
          name,
        },
        update: {},
        create: {
          name,
          isActive: true,
        },
      });
    }

    console.log("[OK] Item categories seeded");

    // ==========================
    // Default Furnaces
    // ==========================
    const furnaces = [
      "Furnace 1",
      "Furnace 2",
      "Furnace 3",
    ];

    for (const name of furnaces) {
      await tx.furnace.upsert({
        where: {
          name,
        },
        update: {},
        create: {
          name,
        },
      });
    }

    console.log("[OK] Furnaces seeded");

    // ==========================
    // Owner User
    // ==========================
    const owner = await tx.user.upsert({
      where: {
        username: "owner",
      },
      update: {},
      create: {
        name: "Administrator",
        username: "owner",
        passwordHash,
        role: UserRole.OWNER,
        isActive: true,
      },
    });

    console.log("[OK] Owner user created");

    // ==========================
    // Assign All Permissions
    // ==========================
    const allPermissions =
      await tx.permission.findMany();

    for (const permission of allPermissions) {
      await tx.userPermission.upsert({
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

    console.log("[OK] Permissions assigned");
  });

  console.log("[OK] Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
