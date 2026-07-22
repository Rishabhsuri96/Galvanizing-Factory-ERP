"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded px-6 py-2 text-white transition ${
        pending
          ? "cursor-not-allowed bg-gray-400"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {pending ? "Assigning..." : "Assign to Production"}
    </button>
  );
}