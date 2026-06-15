import { StatsCharts } from "@/components/StatsCharts";
import { prisma } from "@/lib/prisma";
import { STATUSES, Status } from "@/lib/types";

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export default async function StatsPage() {
  const applications = await prisma.application.findMany({
    where: { appliedDate: { not: null }, status: { not: "wishlist" } },
    select: { status: true, appliedDate: true },
    orderBy: { appliedDate: "asc" },
  });

  const months = Array.from(
    new Set(applications.map((a) => monthKey(new Date(a.appliedDate!))))
  ).sort();

  const statusData = months.map((month) => {
    const entry: Record<string, string | number> = { month };
    for (const status of STATUSES.filter((s) => s !== "wishlist")) {
      entry[status] = applications.filter(
        (a) => monthKey(new Date(a.appliedDate!)) === month && a.status === status
      ).length;
    }
    return entry as { month: string } & Record<Exclude<Status, "wishlist">, number>;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Stats</h1>
      </div>

      {months.length === 0 ? (
        <p className="rounded-md border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          No applications with an applied date yet.
        </p>
      ) : (
        <StatsCharts statusData={statusData} />
      )}
    </div>
  );
}
