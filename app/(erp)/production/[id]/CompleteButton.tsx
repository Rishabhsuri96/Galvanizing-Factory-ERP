"use client";

import { useTransition } from "react";
import { completeProductionItem } from "./actions";

type Props = {
    productionItemId: number;
};

export default function CompleteButton({
    productionItemId,
}: Props) {
    const [isPending, startTransition] = useTransition();

    function handleComplete() {
        const remarks =
            window.prompt("Remarks (optional)") ?? "";

        startTransition(async () => {
            try {
                await completeProductionItem(
                    productionItemId,
                    remarks
                );
            } catch (err) {
                alert(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong."
                );
            }
        });
    }
    return (
        <button
            onClick={handleComplete}
            disabled={isPending}
            className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700 disabled:bg-gray-400"
        >
            {isPending ? "Completing..." : "Complete"}
        </button>
    );
}