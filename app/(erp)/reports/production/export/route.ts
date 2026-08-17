import { prisma } from "@/lib/prisma";

export async function GET() {
  const batches = await prisma.productionBatch.findMany({
    include: {
      contractor: true,
      furnace: true,
      items: true,
    },
    orderBy: {
      processDate: "desc",
    },
  });

  const rows = [
    [
      "Batch",
      "Date",
      "Contractor",
      "Furnace",
      "Input (kg)",
      "Output (kg)",
      "Zinc (kg)",
      "Contractor Cost",
    ],
  ];

  for (const batch of batches) {
    const input = batch.items.reduce(
      (s, i) => s + i.inputWeight,
      0
    );

    const output = batch.items.reduce(
      (s, i) => s + (i.outputWeight ?? 0),
      0
    );

    const zinc = batch.items.reduce(
      (s, i) => s + (i.zincAddedWeight ?? 0),
      0
    );

    const cost = batch.items.reduce(
      (s, i) => s + (i.contractorAmount ?? 0),
      0
    );

    rows.push([
      batch.batchNo,
      batch.processDate.toLocaleDateString("en-IN"),
      batch.contractor.name,
      batch.furnace.name,
      input.toFixed(2),
      output.toFixed(2),
      zinc.toFixed(2),
      cost.toFixed(2),
    ]);
  }

  const csv = rows
    .map((row) => row.join(","))
    .join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition":
        'attachment; filename="production-report.csv"',
    },
  });
}