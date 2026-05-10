// src/lib/processor.ts
import { prisma } from "./prisma";
import { analyzeWithGemini } from "./gemini";

const STEPS = [
  "Paper received",
  "Reading content",
  "Finding key ideas",
  "Explaining math",
  "Creating mind map",
  "Preparing visual summary",
];

async function updateStep(jobId: string, step: string) {
  await prisma.job.update({
    where: { id: jobId },
    data: { step },
  });
}

export async function processJob(jobId: string, paperId: string) {
  try {
    // Mark as processing
    await prisma.job.update({
      where: { id: jobId },
      data: { status: "PROCESSING", step: STEPS[0] },
    });

    const paper = await prisma.paper.findUnique({ where: { id: paperId } });
    if (!paper) throw new Error("Paper not found");

    await updateStep(jobId, STEPS[1]);
    await sleep(400);

    await updateStep(jobId, STEPS[2]);
    await sleep(300);

    await updateStep(jobId, STEPS[3]);
    // Run the actual AI analysis
    const result = await analyzeWithGemini(paper.rawContent, paper.title);

    await updateStep(jobId, STEPS[4]);
    await sleep(300);

    await updateStep(jobId, STEPS[5]);
    await sleep(200);

    // Store completed result
    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: "COMPLETED",
        step: "Done",
        result: result as object,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: "FAILED",
        error: message,
        step: "Failed",
      },
    });
    throw err;
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
