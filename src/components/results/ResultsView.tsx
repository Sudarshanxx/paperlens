// src/components/results/ResultsView.tsx
"use client";
import { useRouter } from "next/navigation";
import { BookOpen, ArrowLeft, ExternalLink } from "lucide-react";
import SummaryCard from "./SummaryCard";
import KeyConcepts from "./KeyConcepts";
import MathSection from "./MathSection";
import MindMapSection from "./MindMapSection";
import LearningCards from "./LearningCards";
import RelatedTopics from "./RelatedTopics";
import { AnalysisResult } from "@/types";

interface Props {
  result: AnalysisResult;
  paper: {
    title: string;
    inputType: string;
    sourceUrl?: string | null;
  };
}

export default function ResultsView({ result, paper }: Props) {
  const router = useRouter();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background glows */}
      <div className="fixed top-[-300px] right-[-200px] w-[700px] h-[700px] rounded-full bg-accent-violet/8 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full bg-accent-cyan/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-bg-base/80 backdrop-blur-xl border-b border-white/5 px-4 md:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-[#64748B] hover:text-white transition-colors text-sm"
            >
              <ArrowLeft size={16} />
              <span className="hidden md:inline">New paper</span>
            </button>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center">
                <BookOpen size={14} className="text-accent-cyan" />
              </div>
              <span className="font-bold text-sm">PaperLens</span>
              <span className="text-xs bg-accent-violet/20 text-accent-violet border border-accent-violet/30 rounded-full px-2 py-0.5">AI</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {paper.sourceUrl && (
              <a
                href={paper.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs border border-white/10 hover:border-accent-cyan/30 px-3 py-1.5 rounded-lg transition-all text-[#94A3B8] hover:text-white"
              >
                <ExternalLink size={12} />
                View Original
              </a>
            )}
            <span className="hidden md:block text-sm text-[#475569] max-w-xs truncate">
              {paper.title}
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-10">
        {/* Summary + Concepts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 fade-up">
            <SummaryCard summary={result.summary} />
          </div>
          <div className="fade-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
            <KeyConcepts concepts={result.keyConcepts} />
          </div>
        </div>

        {/* Math section */}
        <div className="mb-8 fade-up" style={{ animationDelay: "0.15s", opacity: 0 }}>
          <MathSection math={result.math} />
        </div>

        {/* Mind map */}
        <div className="mb-8 fade-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
          <MindMapSection mindMap={result.mindMap} />
        </div>

        {/* Learning cards */}
        <div className="mb-8 fade-up" style={{ animationDelay: "0.25s", opacity: 0 }}>
          <LearningCards cards={result.learningCards} />
        </div>

        {/* Related topics */}
        <div className="mb-10 fade-up" style={{ animationDelay: "0.3s", opacity: 0 }}>
          <RelatedTopics topics={result.relatedTopics} />
        </div>

        {/* Analyze another */}
        <div className="text-center pb-10">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 bg-bg-surface border border-white/8 hover:border-accent-cyan/30 px-6 py-3 rounded-xl text-sm font-medium transition-all hover:bg-bg-elevated"
          >
            <BookOpen size={15} />
            Analyze Another Paper
          </button>
        </div>
      </main>
    </div>
  );
}
