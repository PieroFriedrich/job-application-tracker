"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Application,
  SOURCE_LABELS,
  SOURCES,
  STATUS_LABELS,
  STATUSES,
  Source,
  Status,
} from "@/lib/types";

type Props = {
  application?: Application;
};

function toDateInputValue(value: string | null) {
  if (!value) return "";
  return value.slice(0, 10);
}

export function ApplicationForm({ application }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      company: formData.get("company"),
      role: formData.get("role"),
      jobUrl: formData.get("jobUrl"),
      status: formData.get("status"),
      source: formData.get("source"),
      coverLetter: formData.get("coverLetter") === "on",
      appliedDate: formData.get("appliedDate"),
      notes: formData.get("notes"),
    };

    const url = application
      ? `/api/applications/${application.id}`
      : "/api/applications";
    const method = application ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label htmlFor="company" className="block text-sm font-medium">
          Company
        </label>
        <input
          id="company"
          name="company"
          type="text"
          required
          defaultValue={application?.company}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium">
          Role
        </label>
        <input
          id="role"
          name="role"
          type="text"
          required
          defaultValue={application?.role}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="jobUrl" className="block text-sm font-medium">
          Job posting URL
        </label>
        <input
          id="jobUrl"
          name="jobUrl"
          type="url"
          defaultValue={application?.jobUrl ?? ""}
          placeholder="https://"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={application?.status ?? "wishlist"}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {STATUSES.map((status: Status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="source" className="block text-sm font-medium">
            Source
          </label>
          <select
            id="source"
            name="source"
            defaultValue={application?.source ?? "other"}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {SOURCES.map((source: Source) => (
              <option key={source} value={source}>
                {SOURCE_LABELS[source]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="appliedDate" className="block text-sm font-medium">
            Applied date
          </label>
          <input
            id="appliedDate"
            name="appliedDate"
            type="date"
            defaultValue={toDateInputValue(application?.appliedDate ?? null)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="coverLetter"
          name="coverLetter"
          type="checkbox"
          defaultChecked={application?.coverLetter ?? false}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="coverLetter" className="text-sm font-medium">
          Submitted a cover letter
        </label>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={application?.notes ?? ""}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Saving..." : application ? "Save changes" : "Add application"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
