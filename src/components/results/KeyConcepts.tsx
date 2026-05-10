// src/components/results/KeyConcepts.tsx
import { Hash } from "lucide-react";

const TAG_COLORS = [
  "bg-accent-cyan/8 border-accent-cyan/20 text-accent-cyan",
  "bg-accent-violet/8 border-accent-violet/20 text-accent-violet",
  "bg-accent-green/8 border-accent-green/20 text-accent-green",
  "bg-accent-amber/8 border-accent-amber/20 text-accent-amber",
  "bg-blue-500/8 border-blue-500/20 text-blue-400",
];

export default function KeyConcepts({ concepts }: { concepts: string[] }) {
  return (
    <div className="h-full bg-bg-surface border border-white/7 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <Hash size={16} className="text-accent-cyan" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[#94A3B8] font-mono">
          Key Concepts
        </h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {concepts.map((concept, i) => (
          <span
            key={concept}
            className={`text-xs border px-3 py-1.5 rounded-full font-medium ${TAG_COLORS[i % TAG_COLORS.length]}`}
          >
            {concept}
          </span>
        ))}
      </div>
    </div>
  );
}
