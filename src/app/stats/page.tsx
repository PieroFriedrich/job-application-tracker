import { StatsCharts } from "@/components/StatsCharts";
import { prisma } from "@/lib/prisma";
import { STATUSES, Status } from "@/lib/types";

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  const { year } = await searchParams;

  const appliedDates = await prisma.application.findMany({
    where: { appliedDate: { not: null }, status: { not: "wishlist" } },
    select: { appliedDate: true },
  });
  const years = Array.from(
    new Set(appliedDates.map((a) => new Date(a.appliedDate!).getFullYear()))
  ).sort((a, b) => b - a);

  const isValidYear = !!year && /^\d{4}$/.test(year) && years.includes(Number(year));

  const applications = await prisma.application.findMany({
    where: {
      status: { not: "wishlist" },
      appliedDate: {
        not: null,
        ...(isValidYear
          ? {
              gte: new Date(`${year}-01-01T00:00:00.000Z`),
              lt: new Date(`${Number(year) + 1}-01-01T00:00:00.000Z`),
            }
          : {}),
      },
    },
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

      <form className="mb-4 flex flex-wrap gap-3 text-sm">
        <label className="flex items-center gap-2">
          Year
          <select
            name="year"
            defaultValue={isValidYear ? year : ""}
            className="rounded-md border border-gray-300 px-2 py-1"
          >
            <option value="">All</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="rounded-md border border-gray-300 px-3 py-1 font-medium hover:bg-gray-50"
        >
          Apply
        </button>
      </form>

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
