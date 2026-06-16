"use client";

import { toggleReady } from "@/app/(erp)/production/actions";

export default function MarkReadyButton({
    itemId,
    status,
}: {
    itemId: number;
    status: string;
}) {
    return (
        <button
            onClick={async () => {
                await toggleReady(itemId);
            }}
            className={
                status === "RECEIVED"
                    ? "bg-green-600 text-white px-3 py-1 rounded"
                    : "bg-orange-500 text-white px-3 py-1 rounded"
            }
        >
            {status === "RECEIVED"
                ? "Mark Ready"
                : "Undo"}

        </button>
    );
}