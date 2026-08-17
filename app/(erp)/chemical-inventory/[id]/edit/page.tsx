import Link from "next/link";
import { updateChemicalEntry } from "./actions";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditChemicalEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ MUST await params in Next.js 16
  const { id: idParam } = await params;

  console.log("PARAM ID:", idParam);

  const id = Number(idParam);

  if (!id || isNaN(id)) {
    console.error("Invalid ID:", idParam);
    return notFound();
  }

  const entry = await prisma.chemicalInventory.findUnique({
    where: { id },
  });

  if (!entry) {
    console.error("Entry not found");
    return notFound();
  }

  async function updateAction(formData: FormData) {
    "use server";
    await updateChemicalEntry(id, formData);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">
          Edit Chemical Entry
        </h1>

        <Link
          href="/chemical-inventory"
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Back
        </Link>
      </div>

      <form
        action={updateAction}
        className="space-y-5 rounded-lg border bg-white p-6"
      >
        <input
          name="chemical"
          defaultValue={entry.chemical}
          className="w-full border p-2"
        />

        <select
          name="type"
          defaultValue={entry.type}
          className="w-full border p-2"
        >
          <option value="IN">IN</option>
          <option value="OUT">OUT</option>
        </select>

        <input
          type="number"
          name="weight"
          defaultValue={entry.weight}
          className="w-full border p-2"
        />

        <input
          name="supplier"
          defaultValue={entry.supplier ?? ""}
          className="w-full border p-2"
        />

        <textarea
          name="remarks"
          defaultValue={entry.remarks ?? ""}
          className="w-full border p-2"
        />

        <button className="bg-blue-600 text-white px-6 py-2 rounded">
          Update Entry
        </button>
      </form>
    </div>
  );
}