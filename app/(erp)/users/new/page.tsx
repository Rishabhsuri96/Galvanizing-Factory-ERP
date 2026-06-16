import { prisma } from "@/lib/prisma";
import UserForm from "@/components/UserForm";
import { createUser } from "./actions";

export default async function NewUserPage() {

  const permissions =
    await prisma.permission.findMany({
      orderBy: {
        name: "asc",
      },
    });

  return (
    <div className="max-w-4xl">

      <h1 className="text-3xl font-bold mb-6">
        Create User
      </h1>

      <form action={createUser}>
        <UserForm
          permissions={permissions}
        />
      </form>

    </div>
  );
}