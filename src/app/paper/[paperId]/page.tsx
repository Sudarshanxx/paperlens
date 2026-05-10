// src/app/paper/[paperId]/page.tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BookOpen, CheckCircle, Circle, RefreshCw, AlertTriangle, ChevronRight } from "lucide-react";
import ResultsView from "@/components/results/ResultsView";
import { AnalysisResult } from "@/types";

const PROCESSING_STEPS = [
  "Paper received",
  "Reading content",
  "Finding key ideas",
  "Explaining math",
  "Creating mind map",
  "Preparing visual summary",
];

interface JobData {
  id: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  step?: string | null;
  error?: string | null;
  result?: AnalysisResult | null;
  paper?: { id: string; title: string; inputType: string; sourceUrl?: string | null };
}

export default function PaperPage({ params }: { params: { paperId: string } }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const jobId = searchParams.get("jobId");

  const [job, setJob] = useState<JobData | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [pollError, setPollError] = useState("");

  const fetchJob = useCallback(async () => {
    if (!jobId) return;
    try {
      const res = await fetch(`/api/jobs/${jobId}`);
      if (!res.ok) { setPollError("Failed to load job status."); return; }
      const data: JobData = await res.json();
      setJob(data);
    } catch {
      setPollError("Network error while checking status.");
    }
  }, [jobId]);

  useEffect(() => {
    fetchJob();
    const interval = setInterval(() => {
      if (job?.status === "COMPLETED" || job?.status === "FAILED") {
        clearInterval(interval);
        return;
      }
      fetchJob();
    }, 2000);
    return () => clearInterval(interval);
  }, [fetchJob, job?.status]);

  const handleRetry = async () => {
    if (!jobId) return;
    setRetrying(true);
    await fetch(`/api/jobs/${jobId}`, { method: "POST" });
    setRetrying(false);
    fetchJob();
  };

  const currentStepIndex = job?.step
    ? PROCESSING_STEPS.findIndex((s) => s === job.step)
    : -1;

  if (job?.status === "COMPLETED" && job.result) {
    return (
      <ResultsView
        result={job.result}
        paper={{
          title: job.paper?.title || "Research Paper",
          inputType: job.paper?.inputType || "text",
          sourceUrl: job.paper?.sourceUrl,
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-violet/8 blur-[150px] pointer-events-none" />

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 px-6 py-5 flex items-center gap-2 border-b border-white/5 z-10">
        <button onClick={() => router.push("/")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center">
            <BookOpen size={16} className="text-accent-cyan" />
          </div>
          <span className="font-bold text-lg tracking-tight">PaperLens</span>
          <span className="text-xs bg-accent-violet/20 text-accent-violet border border-accent-violet/30 rounded-full px-2 py-0.5 ml-1">AI</span>
        </button>
      </div>

      <div className="max-w-lg w-full relative z-10">
        {/* Status header */}
        {job?.status === "FAILED" ? (
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-full bg-accent-rose/10 border border-accent-rose/30 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle size={28} className="text-accent-rose" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Analysis failed</h2>
            <p className="text-[#64748B] text-sm mb-6">{job.error || "An unexpected error occurred."}</p>
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="flex items-center gap-2 bg-bg-card border border-white/10 hover:border-accent-cyan/30 px-5 py-3 rounded-xl text-sm font-medium mx-auto transition-all"
            >
              <RefreshCw size={14} className={retrying ? "spin" : ""} />
              {retrying ? "Retrying..." : "Retry Analysis"}
            </button>
          </div>
        ) : (
          <div className="text-center mb-10">
            {/* Animated icon */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-cyan/20 to-accent-violet/20 border border-accent-cyan/20 flex items-center justify-center mx-auto mb-6 relative">
              <BookOpen size={32} className="text-accent-cyan" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-cyan/10 to-transparent animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {job?.paper?.title || "Analyzing your paper..."}
            </h2>
            <p className="text-[#64748B] text-sm">
              {job?.step || "Preparing..."}
            </p>
          </div>
        )}

        {/* Steps */}
        {job?.status !== "FAILED" && (
          <div className="bg-bg-surface border border-white/5 rounded-2xl p-6">
            <div className="space-y-4">
              {PROCESSING_STEPS.map((step, i) => {
                const isDone = currentStepIndex > i;
                const isActive = currentStepIndex === i;
                const isPending = currentStepIndex < i;

                return (
                  <div key={step} className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {isDone ? (
                        <CheckCircle size={18} className="text-accent-green" />
                      ) : isActive ? (
                        <div className="w-[18px] h-[18px] rounded-full border-2 border-accent-cyan border-t-transparent spin" />
                      ) : (
                        <Circle size={18} className="text-[#1E293B]" />
                      )}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <span className={`text-sm ${isDone ? "text-[#94A3B8]" : isActive ? "text-white font-medium" : "text-[#334155]"}`}>
                        {step}
                      </span>
                      {isDone && (
                        <span className="text-xs text-accent-green font-mono">done</span>
                      )}
                      {isActive && (
                        <span className="text-xs text-accent-cyan font-mono pulse-dot">•••</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="mt-6 bg-bg-elevated rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-cyan to-blue-500 transition-all duration-700 ease-out rounded-full"
                style={{
                  width: `${
                    currentStepIndex < 0
                      ? 5
                      : Math.round(((currentStepIndex + 1) / PROCESSING_STEPS.length) * 100)
                  }%`,
                }}
              />
            </div>

            <p className="text-center text-xs text-[#334155] mt-4 font-mono">
              This usually takes 10–30 seconds
            </p>
          </div>
        )}

        {pollError && (
          <p className="text-center text-xs text-accent-rose mt-4">{pollError}</p>
        )}

        {/* Back link */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/")}
            className="text-xs text-[#475569] hover:text-white transition-colors flex items-center gap-1 mx-auto"
          >
            Analyze another paper <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
