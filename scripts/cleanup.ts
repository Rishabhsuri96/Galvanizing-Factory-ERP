import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting cleanup...");

  await prisma.dispatchItem.deleteMany();
  console.log("Dispatch items removed");

  await prisma.dispatch.deleteMany();
  console.log("Dispatches removed");

  await prisma.challanItem.deleteMany();
  console.log("Challan items removed");

  await prisma.challan.deleteMany();
  console.log("Challans removed");

  await prisma.party.deleteMany();
  console.log("Parties removed");

  await prisma.activityLog.deleteMany();
  console.log("Activity logs removed");

  await prisma.userPermission.deleteMany({
    where: {
      userId: {
        not: 1,
      },
    },
  });
  console.log("Test user permissions removed");

  await prisma.user.deleteMany({
    where: {
      id: {
        not: 1,
      },
    },
  });
  console.log("Test users removed");

  console.log("Cleanup completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });