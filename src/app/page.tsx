import Link from "next/link";
import { DeleteButton } from "@/components/DeleteButton";
import { StageBadge, StatusBadge } from "@/components/StatusBadge";
import { prisma } from "@/lib/prisma";
import { STATUS_LABELS, STATUSES, Stage, Status } from "@/lib/types";

type SearchParams = {
  status?: string;
  sort?: string;
  year?: string;
};

const SORT_OPTIONS: Record<string, { label: string; orderBy: Record<string, "asc" | "desc"> }> = {
  newest: { label: "Date applied (newest)", orderBy: { appliedDate: "desc" } },
  oldest: { label: "Date applied (oldest)", orderBy: { appliedDate: "asc" } },
  company: { label: "Company (A-Z)", orderBy: { company: "asc" } },
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { status, sort, year } = await searchParams;

  const sortKey = sort && SORT_OPTIONS[sort] ? sort : "newest";
  const isValidStatus = status && (STATUSES as readonly string[]).includes(status);

  const appliedDates = await prisma.application.findMany({
    where: { appliedDate: { not: null } },
    select: { appliedDate: true },
  });
  const years = Array.from(
    new Set(appliedDates.map((a) => new Date(a.appliedDate!).getFullYear()))
  ).sort((a, b) => b - a);

  const isValidYear = !!year && /^\d{4}$/.test(year) && years.includes(Number(year));

  const applications = await prisma.application.findMany({
    where: {
      ...(isValidStatus ? { status } : {}),
      ...(isValidYear
        ? {
            appliedDate: {
              gte: new Date(`${year}-01-01T00:00:00.000Z`),
              lt: new Date(`${Number(year) + 1}-01-01T00:00:00.000Z`),
            },
          }
        : {}),
    },
    orderBy: SORT_OPTIONS[sortKey].orderBy,
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Applications</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {applications.length} application{applications.length === 1 ? "" : "s"}
        </p>
      </div>

      <form className="mb-4 flex flex-wrap gap-3 text-sm">
        <label className="flex items-center gap-2">
          Status
          <select
            name="status"
            defaultValue={status ?? ""}
            className="rounded-md border border-gray-300 bg-white px-2 py-1 dark:border-gray-600 dark:bg-gray-900"
          >
            <option value="">All</option>
            {STATUSES.map((s: Status) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2">
          Year
          <select
            name="year"
            defaultValue={isValidYear ? year : ""}
            className="rounded-md border border-gray-300 bg-white px-2 py-1 dark:border-gray-600 dark:bg-gray-900"
          >
            <option value="">All</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2">
          Sort by
          <select
            name="sort"
            defaultValue={sortKey}
            className="rounded-md border border-gray-300 bg-white px-2 py-1 dark:border-gray-600 dark:bg-gray-900"
          >
            {Object.entries(SORT_OPTIONS).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="rounded-md border border-gray-300 px-3 py-1 font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
        >
          Apply
        </button>
      </form>

      {applications.length === 0 ? (
        <p className="rounded-md border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
          No applications yet.{" "}
          <Link href="/applications/new" className="text-blue-600 hover:underline dark:text-blue-400">
            Add your first one
          </Link>
          .
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
          <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Company</th>
                <th className="px-4 py-2 text-left font-medium">Role</th>
                <th className="px-4 py-2 text-left font-medium">Stage</th>
                <th className="px-4 py-2 text-left font-medium">Status</th>
                <th className="px-4 py-2 text-left font-medium">Applied</th>
                <th className="px-4 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {applications.map((app) => (
                <tr key={app.id}>
                  <td className="px-4 py-2 font-medium">
                    {app.jobUrl ? (
                      <a
                        href={app.jobUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-blue-600 hover:underline dark:hover:text-blue-400"
                      >
                        {app.company}
                      </a>
                    ) : (
                      app.company
                    )}
                  </td>
                  <td className="px-4 py-2">{app.role}</td>
                  <td className="px-4 py-2">
                    <StageBadge stage={app.stage as Stage} />
                  </td>
                  <td className="px-4 py-2">
                    <StatusBadge status={app.status as Status} />
                  </td>
                  <td className="px-4 py-2 text-gray-500 dark:text-gray-400">
                    {app.appliedDate
                      ? new Date(app.appliedDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/applications/${app.id}/edit`}
                        className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                      >
                        Edit
                      </Link>
                      <DeleteButton id={app.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
