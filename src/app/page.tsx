import Link from "next/link";
import { DeleteButton } from "@/components/DeleteButton";
import { StatusBadge } from "@/components/StatusBadge";
import { prisma } from "@/lib/prisma";
import { STATUS_LABELS, STATUSES, Status } from "@/lib/types";

type SearchParams = {
  status?: string;
  sort?: string;
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
  const { status, sort } = await searchParams;

  const sortKey = sort && SORT_OPTIONS[sort] ? sort : "newest";
  const isValidStatus = status && (STATUSES as readonly string[]).includes(status);

  const applications = await prisma.application.findMany({
    where: isValidStatus ? { status } : undefined,
    orderBy: SORT_OPTIONS[sortKey].orderBy,
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Applications</h1>
        <p className="text-sm text-gray-500">
          {applications.length} application{applications.length === 1 ? "" : "s"}
        </p>
      </div>

      <form className="mb-4 flex flex-wrap gap-3 text-sm">
        <label className="flex items-center gap-2">
          Status
          <select
            name="status"
            defaultValue={status ?? ""}
            className="rounded-md border border-gray-300 px-2 py-1"
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
          Sort by
          <select
            name="sort"
            defaultValue={sortKey}
            className="rounded-md border border-gray-300 px-2 py-1"
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
          className="rounded-md border border-gray-300 px-3 py-1 font-medium hover:bg-gray-50"
        >
          Apply
        </button>
      </form>

      {applications.length === 0 ? (
        <p className="rounded-md border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          No applications yet.{" "}
          <Link href="/applications/new" className="text-blue-600 hover:underline">
            Add your first one
          </Link>
          .
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Company</th>
                <th className="px-4 py-2 text-left font-medium">Role</th>
                <th className="px-4 py-2 text-left font-medium">Status</th>
                <th className="px-4 py-2 text-left font-medium">Applied</th>
                <th className="px-4 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.map((app) => (
                <tr key={app.id}>
                  <td className="px-4 py-2 font-medium">
                    {app.jobUrl ? (
                      <a
                        href={app.jobUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-blue-600 hover:underline"
                      >
                        {app.company}
                      </a>
                    ) : (
                      app.company
                    )}
                  </td>
                  <td className="px-4 py-2">{app.role}</td>
                  <td className="px-4 py-2">
                    <StatusBadge status={app.status as Status} />
                  </td>
                  <td className="px-4 py-2 text-gray-500">
                    {app.appliedDate
                      ? new Date(app.appliedDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/applications/${app.id}/edit`}
                        className="text-sm font-medium text-gray-600 hover:text-blue-600"
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
