import { STAGE_LABELS, STATUS_LABELS, Stage, Status } from "@/lib/types";

const STATUS_STYLES: Record<Status, string> = {
  pending: "bg-amber-100 text-amber-700",
  active: "bg-blue-100 text-blue-700",
  inactive: "bg-red-100 text-red-700",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export function StageBadge({ stage }: { stage: Stage }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        stage === "offer"
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {STAGE_LABELS[stage]}
    </span>
  );
}
