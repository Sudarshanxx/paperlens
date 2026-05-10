// src/components/results/MathSection.tsx
"use client";
import { useState } from "react";
import { Sigma, ChevronDown, ChevronUp, Info } from "lucide-react";
import { AnalysisResult, MathEquation } from "@/types";

function EquationCard({ eq }: { eq: MathEquation }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-bg-elevated border border-white/5 rounded-xl overflow-hidden">
      {/* Equation display */}
      <div className="bg-bg-card border-b border-white/5 px-6 py-5 text-center">
        <code className="text-accent-cyan font-mono text-base md:text-lg tracking-wide break-all">
          {eq.latex}
        </code>
      </div>

      {/* Meaning */}
      <div className="px-6 py-4">
        <p className="text-sm text-[#CBD5E1] leading-relaxed">{eq.meaning}</p>
      </div>

      {/* Symbols table */}
      {eq.symbols.length > 0 && (
        <div className="px-6 pb-4">
          <p className="text-xs text-[#64748B] uppercase tracking-widest font-mono mb-3">Symbols</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {eq.symbols.map((sym) => (
              <div key={sym.symbol} className="flex items-start gap-2 bg-bg-base/50 rounded-lg px-3 py-2">
                <code className="text-accent-amber font-mono text-sm flex-shrink-0">{sym.symbol}</code>
                <span className="text-xs text-[#94A3B8] leading-relaxed">— {sym.meaning}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toggle details */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-center gap-2 text-xs text-[#64748B] hover:text-white transition-colors border-t border-white/5 px-6 py-3"
      >
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        {open ? "Hide" : "Show"} step-by-step explanation
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-white/5">
          {/* Steps */}
          <div className="mt-4 mb-5">
            <p className="text-xs text-[#64748B] uppercase tracking-widest font-mono mb-3">Step-by-Step</p>
            <ol className="space-y-2">
              {eq.stepByStep.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-[#94A3B8] leading-relaxed">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-bg-card border border-white/10 flex items-center justify-center text-xs text-[#64748B] mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Human explanation */}
          <div className="bg-accent-cyan/5 border border-accent-cyan/15 rounded-xl px-5 py-4">
            <div className="flex items-center gap-2 mb-2">
              <Info size={13} className="text-accent-cyan" />
              <span className="text-xs text-accent-cyan font-mono uppercase tracking-wider">Plain English</span>
            </div>
            <p className="text-sm text-[#CBD5E1] leading-relaxed">{eq.humanExplanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MathSection({ math }: { math: AnalysisResult["math"] }) {
  return (
    <div className="bg-bg-surface border border-white/7 rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <Sigma size={18} className="text-accent-amber" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[#94A3B8] font-mono">
          Math Made Simple
        </h2>
      </div>

      {!math.hasEquations || math.equations.length === 0 ? (
        <div className="bg-bg-elevated border border-dashed border-white/10 rounded-xl px-6 py-10 text-center">
          <Sigma size={28} className="text-[#334155] mx-auto mb-3" />
          <p className="text-sm text-[#475569]">No major mathematical equation found in this paper.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {math.equations.map((eq, i) => (
            <EquationCard key={i} eq={eq} />
          ))}
        </div>
      )}
    </div>
  );
}
