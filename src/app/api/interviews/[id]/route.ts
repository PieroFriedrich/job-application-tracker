import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const interview = await prisma.interview.findUnique({
    where: { id },
    include: { application: { select: { id: true, company: true, role: true } } },
  });
  if (!interview) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(interview);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const data: Record<string, unknown> = {};
  if (body.applicationId !== undefined) data.applicationId = body.applicationId;
  if (body.type !== undefined) data.type = body.type || "other";
  if (body.scheduledAt !== undefined) data.scheduledAt = new Date(body.scheduledAt);
  if (body.notes !== undefined) data.notes = body.notes || null;

  const interview = await prisma.interview.update({
    where: { id },
    data,
    include: { application: { select: { id: true, company: true, role: true } } },
  });
  return NextResponse.json(interview);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await prisma.interview.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
