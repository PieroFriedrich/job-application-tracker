import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const application = await prisma.application.findUnique({ where: { id } });

  if (!application) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(application);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  const data: Record<string, unknown> = {};
  if (body.company !== undefined) data.company = body.company;
  if (body.role !== undefined) data.role = body.role;
  if (body.jobUrl !== undefined) data.jobUrl = body.jobUrl || null;
  if (body.status !== undefined) data.status = body.status;
  if (body.stage !== undefined) data.stage = body.stage || "none";
  if (body.source !== undefined) data.source = body.source;
  if (body.coverLetter !== undefined) data.coverLetter = Boolean(body.coverLetter);
  if (body.appliedDate !== undefined) {
    data.appliedDate = body.appliedDate ? new Date(body.appliedDate) : null;
  }
  if (body.notes !== undefined) data.notes = body.notes || null;

  const application = await prisma.application.update({
    where: { id },
    data,
  });

  return NextResponse.json(application);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await prisma.application.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
