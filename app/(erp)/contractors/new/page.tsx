import ContractorForm from "./ContractorForm";
import { createContractor } from "./actions";

export default function NewContractorPage() {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-semibold">
          Add Contractor
        </h1>

        <p className="text-gray-500">
          Create a new contractor
        </p>
      </div>

      {/* ✅ IMPORTANT */}
      <form action={createContractor}>
        <ContractorForm submitLabel="Create Contractor" />
      </form>

    </div>
  );
}