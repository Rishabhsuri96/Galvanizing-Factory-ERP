import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

import ProductionBatchForm from "./ProductionBatchForm";

export default async function NewProductionBatchPage() {
  await requirePermission("MANAGE_PRODUCTION");

  const [contractors, furnaces] = await Promise.all([
    prisma.contractor.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    }),

    prisma.furnace.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          New Production Batch
        </h1>

        <p className="text-gray-500">
          Create a production batch before selecting challan items.
        </p>
      </div>

      <ProductionBatchForm
        contractors={contractors}
        furnaces={furnaces}
      />
    </div>
  );
}
