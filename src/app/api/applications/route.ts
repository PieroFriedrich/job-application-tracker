import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(applications);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const application = await prisma.application.create({
    data: {
      company: body.company,
      role: body.role,
      jobUrl: body.jobUrl || null,
      status: body.status || "wishlist",
      stage: body.stage || null,
      source: body.source || "other",
      coverLetter: Boolean(body.coverLetter),
      appliedDate: body.appliedDate ? new Date(body.appliedDate) : null,
      notes: body.notes || null,
    },
  });

  return NextResponse.json(application, { status: 201 });
}
