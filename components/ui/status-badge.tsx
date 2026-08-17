import { ItemStatus } from "@prisma/client";

type StatusBadgeProps = {
  status: ItemStatus;
};

const statusStyles: Record<ItemStatus, string> = {
  RECEIVED:
    "bg-blue-100 text-blue-800 border-blue-200",

  PARTIALLY_PRODUCED:
    "bg-amber-100 text-amber-800 border-amber-200",

  READY:
    "bg-green-100 text-green-800 border-green-200",

  PARTIALLY_DISPATCHED:
    "bg-purple-100 text-purple-800 border-purple-200",

  COMPLETED:
    "bg-gray-100 text-gray-800 border-gray-200",
};

const statusLabels: Record<ItemStatus, string> = {
  RECEIVED: "Received",

  PARTIALLY_PRODUCED:
    "Partially Produced",

  READY: "Ready",

  PARTIALLY_DISPATCHED:
    "Partially Dispatched",

  COMPLETED: "Completed",
};

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      <span className="h-2 w-2 rounded-full bg-current" />

      {statusLabels[status]}
    </span>
  );
}