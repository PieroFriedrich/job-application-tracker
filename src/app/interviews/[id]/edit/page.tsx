import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Interview, InterviewType } from "@/lib/types";
import { InterviewForm } from "@/components/InterviewForm";

export default async function EditInterviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [interview, activeApplications] = await Promise.all([
    prisma.interview.findUnique({
      where: { id },
      include: {
        application: { select: { id: true, company: true, role: true } },
      },
    }),
    prisma.application.findMany({
      where: { status: "active" },
      select: { id: true, company: true, role: true },
      orderBy: { company: "asc" },
    }),
  ]);

  if (!interview) notFound();

  const formApplications = activeApplications.some(
    (a) => a.id === interview.applicationId,
  )
    ? activeApplications
    : [...activeApplications, interview.application];

  const serialized: Interview = {
    ...interview,
    type: interview.type as InterviewType,
    scheduledAt: interview.scheduledAt.toISOString(),
    createdAt: interview.createdAt.toISOString(),
    updatedAt: interview.updatedAt.toISOString(),
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Edit interview</h1>
      <InterviewForm
        interview={serialized}
        activeApplications={formApplications}
      />
    </div>
  );
}
