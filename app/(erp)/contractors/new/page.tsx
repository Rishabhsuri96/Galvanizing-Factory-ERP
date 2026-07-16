import ContractorForm from "./ContractorForm";

export default function NewContractorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Add Contractor
        </h1>

        <p className="text-gray-500">
          Create a new contractor
        </p>
      </div>

      <ContractorForm />
    </div>
  );
}