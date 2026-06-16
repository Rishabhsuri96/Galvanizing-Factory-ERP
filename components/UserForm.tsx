type Permission = {
  id: number;
  code: string;
  name: string;
};

export default function UserForm({
  permissions,
}: {
  permissions: Permission[];
}) {
  return (
    <div className="space-y-6">

      <div>
        <label className="block mb-1">
          Name
        </label>

        <input
          name="name"
          className="border p-2 w-full rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1">
          Username
        </label>

        <input
          name="username"
          className="border p-2 w-full rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1">
          Password
        </label>

        <input
          type="password"
          name="password"
          className="border p-2 w-full rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1">
          Role
        </label>

        <select
          name="role"
          className="border p-2 w-full rounded"
        >
          <option value="OWNER">
            OWNER
          </option>

          <option value="MANAGER">
            MANAGER
          </option>

          <option value="ACCOUNTANT">
            ACCOUNTANT
          </option>
        </select>
      </div>

      <div className="border rounded p-4">

        <h2 className="font-bold mb-4">
          Permissions
        </h2>

        <div className="grid md:grid-cols-2 gap-3">

          {permissions.map(
            (permission) => (
              <label
                key={permission.id}
                className="flex gap-2"
              >
                <input
                  type="checkbox"
                  name="permissions"
                  value={permission.id}
                />

                {permission.name}
              </label>
            )
          )}

        </div>

      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create User
      </button>

    </div>
  );
}