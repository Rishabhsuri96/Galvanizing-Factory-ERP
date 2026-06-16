import { updateParty } from "./actions";
import { prisma } from "@/lib/prisma";

export default async function EditPartyPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const party =
    await prisma.party.findUnique({
      where: {
        id: Number(id),
      },
    });

  if (!party) {
    return <div>Party not found.</div>;
  }

  const updatePartyWithId =
    updateParty.bind(
      null,
      party.id
    );

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-3xl font-bold">
        Edit Party
      </h1>

      <form
        action={updatePartyWithId}
        className="space-y-4"
      >
        <div>
          <label className="mb-1 block">
            Party Name
          </label>

          <input
            name="partyName"
            defaultValue={
              party.partyName
            }
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block">
            GST Number
          </label>

          <input
            name="gstNumber"
            defaultValue={
              party.gstNumber ?? ""
            }
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block">
            Phone
          </label>

          <input
            name="phone"
            defaultValue={
              party.phone ?? ""
            }
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block">
            Email
          </label>

          <input
            name="email"
            defaultValue={
              party.email ?? ""
            }
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block">
            Address
          </label>

          <textarea
            name="address"
            defaultValue={
              party.address ?? ""
            }
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block">
            Contact Person
          </label>

          <input
            name="contactPerson"
            defaultValue={
              party.contactPerson ??
              ""
            }
            className="w-full rounded border p-2"
          />
        </div>

        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Update Party
        </button>
      </form>
    </div>
  );
}