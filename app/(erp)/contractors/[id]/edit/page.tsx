import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ContractorForm from "../../new/ContractorForm";
import { updateContractor } from "../../actions";

export default async function EditContractorPage({
  params,
}: {
  params: { id: string };
}) {
  console.log("PARAMS ID:", params.id);

  const contractorId = Number(params.id);

  // ✅ SAFETY CHECK (IMPORTANT)
  if (!contractorId || Number.isNaN(contractorId)) {
    throw new Error("Invalid contractor ID");
  }

  const contractor = await prisma.contractor.findUnique({
    where: {
      id: contractorId,
    },
  });

  if (!contractor) {
    notFound();
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-semibold">
          Edit Contractor
        </h1>
      </div>

      <form action={updateContractor.bind(null, contractor.id)}>
        <ContractorForm
          submitLabel="Update Contractor"
          initialData={{
            name: contractor.name,
            phone: contractor.phone ?? "",
            address: contractor.address ?? "",
            remarks: contractor.remarks ?? "",
          }}
        />
      </form>

    </div>
  );
}