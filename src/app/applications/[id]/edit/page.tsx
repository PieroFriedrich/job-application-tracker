import { notFound } from "next/navigation";
import { ApplicationForm } from "@/components/ApplicationForm";
import { prisma } from "@/lib/prisma";
import { Application } from "@/lib/types";

export default async function EditApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const application = await prisma.application.findUnique({ where: { id } });

  if (!application) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Edit application</h1>
      <ApplicationForm
        application={
          {
            ...application,
            appliedDate: application.appliedDate?.toISOString() ?? null,
            createdAt: application.createdAt.toISOString(),
            updatedAt: application.updatedAt.toISOString(),
          } as Application
        }
      />
    </div>
  );
}
