import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Interview, InterviewType } from "@/lib/types";
import { InterviewCalendar } from "@/components/InterviewCalendar";

export default async function InterviewsPage() {
  const [rawInterviews] = await Promise.all([
    prisma.interview.findMany({
      include: {
        application: { select: { id: true, company: true, role: true } },
      },
      orderBy: { scheduledAt: "asc" },
    }),
  ]);

  const interviews: Interview[] = rawInterviews.map((iv) => ({
    ...iv,
    type: iv.type as InterviewType,
    scheduledAt: iv.scheduledAt.toISOString(),
    createdAt: iv.createdAt.toISOString(),
    updatedAt: iv.updatedAt.toISOString(),
  }));

  const now = new Date();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Interviews</h1>
        <Link
          href="/interviews/new"
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Schedule interview
        </Link>
      </div>
      <InterviewCalendar
        interviews={interviews}
        initialYear={now.getFullYear()}
        initialMonth={now.getMonth()}
      />
    </div>
  );
}
