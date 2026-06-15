import { Board } from "@/components/Board";
import { prisma } from "@/lib/prisma";
import { Application } from "@/lib/types";

export default async function BoardPage() {
  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serialized: Application[] = applications.map((app) => ({
    ...app,
    appliedDate: app.appliedDate?.toISOString() ?? null,
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
  })) as Application[];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Board</h1>
      <Board applications={serialized} />
    </div>
  );
}
