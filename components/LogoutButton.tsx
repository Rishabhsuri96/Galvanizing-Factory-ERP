"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {

    const confirmed =
      window.confirm(
        "Are you sure you want to logout?"
      );

    if (!confirmed) {
      return;
    }

    await fetch("/api/logout", {
      method: "POST",
    });

    window.location.href = "/login";
  }

  return (
    <button
      onClick={handleLogout}
      className="
w-full
rounded-lg
bg-red-600
px-2
py-1
text-white
font-medium
transition
duration-200
hover:scale-105
hover:bg-red-700
"
    >
      Logout
    </button>
  );
}