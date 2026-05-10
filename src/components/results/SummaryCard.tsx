// src/components/results/SummaryCard.tsx
import { Target, Cpu, BarChart2, Tag } from "lucide-react";
import { AnalysisResult } from "@/types";

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: "text-accent-green border-accent-green/30 bg-accent-green/10",
  Intermediate: "text-accent-amber border-accent-amber/30 bg-accent-amber/10",
  Advanced: "text-accent-rose border-accent-rose/30 bg-accent-rose/10",
  Expert: "text-accent-violet border-accent-violet/30 bg-accent-violet/10",
};

export default function SummaryCard({ summary }: { summary: AnalysisResult["summary"] }) {
  const diffClass = DIFFICULTY_COLORS[summary.difficulty] || DIFFICULTY_COLORS.Intermediate;

  return (
    <div className="h-full bg-bg-surface border border-white/7 rounded-2xl p-6 md:p-8">
      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="flex items-center gap-1.5 text-xs border border-white/10 text-[#94A3B8] px-2.5 py-1 rounded-full">
          <Tag size={11} />
          {summary.category}
        </span>
        <span className={`text-xs border px-2.5 py-1 rounded-full font-medium ${diffClass}`}>
          {summary.difficulty}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-xl md:text-2xl font-bold leading-snug mb-3">
        {summary.title}
      </h1>

      {/* One-liner */}
      <p className="text-accent-cyan text-sm font-medium mb-6 leading-relaxed">
        {summary.oneLiner}
      </p>

      <div className="space-y-4">
        {/* Problem */}
        <div className="flex gap-3">
          <div className="flex-shrink-0 mt-0.5 w-7 h-7 rounded-lg bg-accent-rose/10 border border-accent-rose/20 flex items-center justify-center">
            <Target size={14} className="text-accent-rose" />
          </div>
          <div>
            <p className="text-xs text-[#64748B] uppercase tracking-widest font-mono mb-1">Problem</p>
            <p className="text-sm text-[#CBD5E1] leading-relaxed">{summary.problemSolved}</p>
          </div>
        </div>

        {/* Method */}
        <div className="flex gap-3">
          <div className="flex-shrink-0 mt-0.5 w-7 h-7 rounded-lg bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center">
            <Cpu size={14} className="text-accent-violet" />
          </div>
          <div>
            <p className="text-xs text-[#64748B] uppercase tracking-widest font-mono mb-1">Method</p>
            <p className="text-sm text-[#CBD5E1] leading-relaxed">{summary.methodUsed}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
