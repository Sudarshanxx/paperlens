// src/components/results/LearningCards.tsx
"use client";
import { useState } from "react";
import { Target, Lightbulb, Zap, Globe, GraduationCap, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { LearningCard } from "@/types";

const ICON_MAP: Record<string, React.ReactNode> = {
  target: <Target size={18} />,
  lightbulb: <Lightbulb size={18} />,
  zap: <Zap size={18} />,
  globe: <Globe size={18} />,
  "graduation-cap": <GraduationCap size={18} />,
};

const CARD_ACCENT = [
  { bg: "bg-accent-rose/10", border: "border-accent-rose/20", icon: "text-accent-rose" },
  { bg: "bg-accent-cyan/10", border: "border-accent-cyan/20", icon: "text-accent-cyan" },
  { bg: "bg-accent-violet/10", border: "border-accent-violet/20", icon: "text-accent-violet" },
  { bg: "bg-accent-green/10", border: "border-accent-green/20", icon: "text-accent-green" },
  { bg: "bg-accent-amber/10", border: "border-accent-amber/20", icon: "text-accent-amber" },
];

function Card({ card, index }: { card: LearningCard; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const accent = CARD_ACCENT[index % CARD_ACCENT.length];

  return (
    <div
      className={`bg-bg-elevated border ${accent.border} rounded-2xl p-5 card-hover cursor-pointer transition-all`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className={`w-9 h-9 rounded-xl ${accent.bg} border ${accent.border} flex items-center justify-center mb-4 ${accent.icon}`}>
        {ICON_MAP[card.icon] || <BookOpen size={18} />}
      </div>

      <p className="text-xs text-[#64748B] uppercase tracking-widest font-mono mb-2">
        {flipped ? "Answer" : "Question"}
      </p>

      <p className={`text-sm leading-relaxed ${flipped ? "text-[#CBD5E1]" : "text-white font-medium"}`}>
        {flipped ? card.answer : card.question}
      </p>

      <div className="mt-4 flex items-center justify-end">
        <span className={`text-xs flex items-center gap-1 ${accent.icon} opacity-60`}>
          {flipped ? <><ChevronUp size={11} /> Show question</> : <><ChevronDown size={11} /> Reveal answer</>}
        </span>
      </div>
    </div>
  );
}

export default function LearningCards({ cards }: { cards: LearningCard[] }) {
  return (
    <div className="bg-bg-surface border border-white/7 rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen size={18} className="text-accent-green" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[#94A3B8] font-mono">
          Visual Learning Cards
        </h2>
        <span className="text-xs text-[#475569] font-mono ml-2">tap to flip</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <Card key={i} card={card} index={i} />
        ))}
      </div>
    </div>
  );
}
