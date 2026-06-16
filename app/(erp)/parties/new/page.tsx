import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { logActivity } from "@/lib/activity";

async function createParty(formData: FormData) {
  "use server";

  const partyName = formData.get("partyName") as string;
  const gstNumber = formData.get("gstNumber") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const contactPerson = formData.get("contactPerson") as string;

  const party = await prisma.party.create({
    data: {
      partyName,
      gstNumber,
      phone,
      email,
      contactPerson,
    },
  });

  const currentUser =
    await getCurrentUser();

  if (currentUser) {
    await logActivity(
      currentUser.id,
      "PARTY_CREATED",
      party.partyName
    );
  }

  redirect("/parties");
}

export default function NewPartyPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Add Party
      </h1>

      <form action={createParty} className="space-y-4">

        <input
          name="partyName"
          placeholder="Party Name"
          className="border p-2 w-full"
          required
        />

        <input
          name="gstNumber"
          placeholder="GST Number"
          className="border p-2 w-full"
        />

        <input
          name="phone"
          placeholder="Phone"
          className="border p-2 w-full"
        />

        <input
          name="email"
          placeholder="Email"
          className="border p-2 w-full"
        />

        <input
          name="contactPerson"
          placeholder="Contact Person"
          className="border p-2 w-full"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2"
        >
          Save Party
        </button>

      </form>
    </div>
  );
}