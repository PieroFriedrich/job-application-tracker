import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const interviews = await prisma.interview.findMany({
    include: { application: { select: { id: true, company: true, role: true } } },
    orderBy: { scheduledAt: "asc" },
  });
  return NextResponse.json(interviews);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.applicationId) {
    return NextResponse.json({ error: "applicationId is required" }, { status: 400 });
  }

  const interview = await prisma.interview.create({
    data: {
      applicationId: body.applicationId,
      type: body.type || "other",
      scheduledAt: new Date(body.scheduledAt),
      notes: body.notes || null,
    },
    include: { application: { select: { id: true, company: true, role: true } } },
  });

  return NextResponse.json(interview, { status: 201 });
}
