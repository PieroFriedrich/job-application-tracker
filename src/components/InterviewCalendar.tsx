"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { INTERVIEW_TYPE_LABELS, Interview, InterviewType } from "@/lib/types";

type Props = {
  interviews: Interview[];
  initialYear: number;
  initialMonth: number;
};

const DAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function dayKey(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

function todayKey() {
  const now = new Date();
  return dayKey(now.getFullYear(), now.getMonth(), now.getDate());
}

export function InterviewCalendar({
  interviews,
  initialYear,
  initialMonth,
}: Props) {
  const router = useRouter();
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const today = todayKey();

  const interviewsByDay = new Map<string, Interview[]>();
  for (const iv of interviews) {
    const key = iv.scheduledAt.slice(0, 10);
    if (!interviewsByDay.has(key)) interviewsByDay.set(key, []);
    interviewsByDay.get(key)!.push(iv);
  }

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function prevMonth() {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
    setSelectedDay(null);
  }

  function nextMonth() {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
    setSelectedDay(null);
  }

  function handleDayClick(key: string) {
    setSelectedDay((prev) => (prev === key ? null : key));
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    await fetch(`/api/interviews/${id}`, { method: "DELETE" });
    setDeleting(null);
    router.refresh();
  }

  const monthLabel = new Date(year, month, 1).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const visibleInterviews = selectedDay
    ? (interviewsByDay.get(selectedDay) ?? [])
    : interviews.filter((iv) => iv.scheduledAt.slice(0, 10) >= today);

  const listHeader = selectedDay
    ? `Interviews on ${new Date(selectedDay + "T00:00:00").toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}`
    : "Upcoming interviews";

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 p-4 max-w-sm dark:border-gray-700">
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={prevMonth}
            className="rounded px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            ‹
          </button>
          <span className="text-sm font-semibold">{monthLabel}</span>
          <button
            onClick={nextMonth}
            className="rounded px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 gap-y-1">
          {DAY_HEADERS.map((d) => (
            <div
              key={d}
              className="text-center text-xs font-medium text-gray-500 pb-1 dark:text-gray-400"
            >
              {d}
            </div>
          ))}

          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`blank-${i}`} />
          ))}

          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
            const key = dayKey(year, month, d);
            const hasInterviews = interviewsByDay.has(key);
            const isToday = key === today;
            const isSelected = key === selectedDay;
            const isPast = key < today;

            return (
              <button
                key={d}
                onClick={() => handleDayClick(key)}
                className={[
                  "flex flex-col items-center rounded-md py-1 text-sm transition-colors",
                  isPast && !isToday ? "text-gray-400 dark:text-gray-500" : "",
                  isToday ? "ring-2 ring-blue-500 dark:ring-blue-400" : "",
                  isSelected
                    ? "bg-blue-100 font-semibold dark:bg-blue-900/40"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800",
                ].join(" ")}
              >
                {d}
                {hasInterviews ? (
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
                ) : (
                  <span className="mt-0.5 h-1.5 w-1.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-base font-semibold">{listHeader}</h2>

        {visibleInterviews.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No interviews to show.</p>
        ) : (
          <ul className="space-y-3">
            {visibleInterviews.map((iv) => {
              const dt = new Date(iv.scheduledAt);
              const time = dt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              const date = dt.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              return (
                <li
                  key={iv.id}
                  className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {iv.application.company}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {iv.application.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>
                        {date} at {time}
                      </span>
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {INTERVIEW_TYPE_LABELS[iv.type as InterviewType] ?? iv.type}
                      </span>
                    </div>
                    {iv.notes && (
                      <p className="text-xs text-gray-500 line-clamp-2 dark:text-gray-400">
                        {iv.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Link
                      href={`/interviews/${iv.id}/edit`}
                      className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(iv.id)}
                      disabled={deleting === iv.id}
                      className="text-xs text-red-600 hover:underline disabled:opacity-50 dark:text-red-400"
                    >
                      {deleting === iv.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
