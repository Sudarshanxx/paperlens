// src/app/api/papers/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const papers = await prisma.paper.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      job: {
        select: { id: true, status: true, step: true },
      },
    },
  });
  return NextResponse.json(papers);
}
