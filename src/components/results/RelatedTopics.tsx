// src/components/results/RelatedTopics.tsx
import { Compass, ExternalLink } from "lucide-react";

interface Topic {
  label: string;
  searchQuery: string;
}

const ACCENT_CYCLE = [
  "hover:border-accent-cyan/40 hover:bg-accent-cyan/5 hover:text-accent-cyan",
  "hover:border-accent-violet/40 hover:bg-accent-violet/5 hover:text-accent-violet",
  "hover:border-accent-green/40 hover:bg-accent-green/5 hover:text-accent-green",
  "hover:border-accent-amber/40 hover:bg-accent-amber/5 hover:text-accent-amber",
  "hover:border-accent-rose/40 hover:bg-accent-rose/5 hover:text-accent-rose",
];

export default function RelatedTopics({ topics }: { topics: Topic[] }) {
  return (
    <div className="bg-bg-surface border border-white/7 rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <Compass size={18} className="text-accent-amber" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[#94A3B8] font-mono">
          Related Topics
        </h2>
      </div>

      <div className="flex flex-wrap gap-3">
        {topics.map((topic, i) => (
          <a
            key={topic.label}
            href={`https://arxiv.org/search/?query=${encodeURIComponent(topic.searchQuery)}&searchtype=all`}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center gap-2 border border-white/10 bg-bg-elevated text-[#94A3B8] transition-all px-4 py-2.5 rounded-xl text-sm font-medium ${ACCENT_CYCLE[i % ACCENT_CYCLE.length]}`}
          >
            {topic.label}
            <ExternalLink size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        ))}
      </div>
      <p className="text-xs text-[#334155] mt-4 font-mono">
        Click any topic to search related papers on arXiv →
      </p>
    </div>
  );
}
