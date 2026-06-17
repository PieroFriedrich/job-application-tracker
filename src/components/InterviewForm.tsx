"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  INTERVIEW_TYPE_LABELS,
  INTERVIEW_TYPES,
  Interview,
  InterviewType,
} from "@/lib/types";

type Props = {
  interview?: Interview;
  activeApplications: { id: string; company: string; role: string }[];
};

function toDatetimeLocalValue(iso: string | null) {
  if (!iso) return "";
  return iso.slice(0, 16);
}

export function InterviewForm({ interview, activeApplications }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formApplications =
    interview &&
    !activeApplications.some((a) => a.id === interview.applicationId)
      ? [...activeApplications, interview.application]
      : activeApplications;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      applicationId: formData.get("applicationId"),
      type: formData.get("type"),
      scheduledAt: formData.get("scheduledAt"),
      notes: formData.get("notes"),
    };

    const url = interview
      ? `/api/interviews/${interview.id}`
      : "/api/interviews";
    const method = interview ? "PATCH" : "POST";

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

    router.push("/interviews");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label htmlFor="applicationId" className="block text-sm font-medium">
          Job application
        </label>
        <select
          id="applicationId"
          name="applicationId"
          required
          defaultValue={interview?.applicationId ?? ""}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {formApplications.length === 0 ? (
            <option value="" disabled>
              No active applications
            </option>
          ) : (
            <>
              <option value="" disabled>
                Select an application
              </option>
              {formApplications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.company} — {app.role}
                </option>
              ))}
            </>
          )}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium">
            Interview type
          </label>
          <select
            id="type"
            name="type"
            defaultValue={interview?.type ?? "other"}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {INTERVIEW_TYPES.map((type: InterviewType) => (
              <option key={type} value={type}>
                {INTERVIEW_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="scheduledAt" className="block text-sm font-medium">
            Date &amp; time
          </label>
          <input
            id="scheduledAt"
            name="scheduledAt"
            type="datetime-local"
            required
            defaultValue={toDatetimeLocalValue(interview?.scheduledAt ?? null)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={interview?.notes ?? ""}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting || formApplications.length === 0}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting
            ? "Saving..."
            : interview
              ? "Save changes"
              : "Schedule interview"}
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
