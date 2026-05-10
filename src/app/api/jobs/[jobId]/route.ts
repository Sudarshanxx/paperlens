// src/app/api/jobs/[jobId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const job = await prisma.job.findUnique({
    where: { id: params.jobId },
    include: { paper: { select: { id: true, title: true, inputType: true, sourceUrl: true, fileName: true } } },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: job.id,
    status: job.status,
    step: job.step,
    error: job.error,
    result: job.result,
    paper: job.paper,
  });
}

// Retry a failed job
export async function POST(
  _req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const job = await prisma.job.findUnique({ where: { id: params.jobId } });
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  if (job.status !== "FAILED") {
    return NextResponse.json({ error: "Only failed jobs can be retried" }, { status: 400 });
  }

  await prisma.job.update({
    where: { id: params.jobId },
    data: { status: "PENDING", step: "Queued", error: null },
  });

  const { processJob } = await import("@/lib/processor");
  processJob(params.jobId, job.paperId).catch(console.error);

  return NextResponse.json({ ok: true });
}
