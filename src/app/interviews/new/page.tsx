import { prisma } from "@/lib/prisma";
import { InterviewForm } from "@/components/InterviewForm";

export default async function NewInterviewPage() {
  const activeApplications = await prisma.application.findMany({
    where: { status: "active" },
    select: { id: true, company: true, role: true },
    orderBy: { company: "asc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Schedule interview</h1>
      <InterviewForm activeApplications={activeApplications} />
    </div>
  );
}
