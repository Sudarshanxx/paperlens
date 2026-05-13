// src/app/api/analyze/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processJob } from "@/lib/processor";
import { fetchTextFromUrl } from "@/lib/fetchPaperUrl";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let title = "";
    let rawContent = "";
    let inputType = "text";
    let sourceUrl: string | undefined;
    let fileName: string | undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      title = formData.get("title") as string;
      inputType = formData.get("inputType") as string;

      if (inputType === "pdf") {
        const file = formData.get("file") as File;
        if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
        fileName = file.name;
        try {
          const buffer = Buffer.from(await file.arrayBuffer());
          const pdfParse = (await import("pdf-parse")).default;
          const pdfData = await pdfParse(buffer);
          rawContent = pdfData.text;
        } catch {
          rawContent = `PDF file: ${fileName}. Please analyze based on the title.`;
        }
        if (!rawContent?.trim()) {
          rawContent = `Research paper titled: ${title}.`;
        }
      } else if (inputType === "url") {
        sourceUrl = formData.get("url") as string;
        rawContent = await fetchTextFromUrl(sourceUrl);
      } else {
        rawContent = formData.get("content") as string;
      }
    } else {
      const body = await req.json();
      title = body.title;
      inputType = body.inputType || "text";
      rawContent = body.content || "";
      sourceUrl = body.url;
      if (inputType === "url" && sourceUrl) {
        rawContent = await fetchTextFromUrl(sourceUrl);
      }
    }

    if (!title?.trim()) return NextResponse.json({ error: "Title is required" }, { status: 400 });
    if (!rawContent?.trim()) return NextResponse.json({ error: "Paper content is required" }, { status: 400 });

    // Create paper and job
    const paper = await prisma.paper.create({
      data: { title: title.trim(), inputType, rawContent, sourceUrl, fileName },
    });

    const job = await prisma.job.create({
      data: { paperId: paper.id, status: "PENDING", step: "Queued" },
    });

    // On Vercel: await the job directly in this request (within 60s timeout)
    // This is reliable on serverless — fire-and-forget gets killed
    await processJob(job.id, paper.id);

    return NextResponse.json({ paperId: paper.id, jobId: job.id });
  } catch (err) {
    console.error("Analyze error:", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}