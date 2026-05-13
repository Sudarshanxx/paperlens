// src/components/results/PaperPreview.tsx
import { ExternalLink, FileText, Link2 } from "lucide-react";

interface Props {
  title: string;
  inputType: string;
  sourceUrl?: string | null;
}

export default function PaperPreview({ title, inputType, sourceUrl }: Props) {
  const isArxiv = sourceUrl?.includes("arxiv.org");
  const arxivId = isArxiv ? sourceUrl?.match(/abs\/([^\s?]+)/)?.[1] : null;

  return (
    <div className="bg-bg-surface border border-white/7 rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <FileText size={18} className="text-accent-cyan" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[#94A3B8] font-mono">
          Paper Preview
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-5 items-start">
        {/* Visual document card */}
        <div className="flex-shrink-0 w-full md:w-48">
          <div className="bg-bg-elevated border border-white/8 rounded-xl overflow-hidden">
            {/* Fake PDF page preview */}
            <div className="bg-white h-56 p-4 relative flex flex-col">
              {/* Header bar simulation */}
              <div className="h-2 bg-gray-800 rounded-sm mb-3 w-3/4" />
              <div className="h-1.5 bg-gray-200 rounded-sm mb-1.5 w-full" />
              <div className="h-1.5 bg-gray-200 rounded-sm mb-1.5 w-5/6" />
              <div className="h-1.5 bg-gray-200 rounded-sm mb-3 w-4/6" />
              <div className="h-1 bg-gray-100 rounded-sm mb-1 w-full" />
              <div className="h-1 bg-gray-100 rounded-sm mb-1 w-full" />
              <div className="h-1 bg-gray-100 rounded-sm mb-1 w-5/6" />
              <div className="h-1 bg-gray-100 rounded-sm mb-3 w-full" />
              <div className="h-1 bg-gray-100 rounded-sm mb-1 w-full" />
              <div className="h-1 bg-gray-100 rounded-sm mb-1 w-4/6" />
              <div className="h-1 bg-gray-100 rounded-sm mb-3 w-full" />
              <div className="h-8 bg-gray-100 rounded-sm mb-2 w-full" />
              <div className="h-1 bg-gray-100 rounded-sm mb-1 w-full" />
              <div className="h-1 bg-gray-100 rounded-sm w-3/6" />
              {/* PDF label */}
              <div className="absolute bottom-2 right-2 text-[8px] text-gray-300 font-mono">PDF</div>
            </div>
            <div className="bg-bg-card px-3 py-2">
              <p className="text-xs text-[#64748B] truncate">{title}</p>
            </div>
          </div>
        </div>

        {/* Paper info */}
        <div className="flex-1">
          <h3 className="text-base font-semibold text-white mb-2 leading-snug">{title}</h3>

          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
              inputType === "pdf"
                ? "bg-accent-rose/10 border-accent-rose/20 text-accent-rose"
                : inputType === "url"
                ? "bg-accent-cyan/10 border-accent-cyan/20 text-accent-cyan"
                : "bg-accent-violet/10 border-accent-violet/20 text-accent-violet"
            }`}>
              {inputType === "pdf" ? "📄 PDF Upload" : inputType === "url" ? "🔗 URL" : "📝 Text"}
            </span>
            {isArxiv && (
              <span className="text-xs px-2.5 py-1 rounded-full border bg-accent-amber/10 border-accent-amber/20 text-accent-amber font-medium">
                arXiv
              </span>
            )}
          </div>

          {/* Links */}
          <div className="space-y-2">
            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-accent-cyan transition-colors group"
              >
                <Link2 size={14} className="text-[#475569] group-hover:text-accent-cyan" />
                View original paper
                <ExternalLink size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            )}
            {arxivId && (
              <a
                href={`https://arxiv.org/pdf/${arxivId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-accent-cyan transition-colors group"
              >
                <FileText size={14} className="text-[#475569] group-hover:text-accent-cyan" />
                Download PDF from arXiv
                <ExternalLink size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            )}
            {!sourceUrl && (
              <p className="text-sm text-[#475569] italic">
                Paper analyzed from pasted text — no external link available.
              </p>
            )}
          </div>

          {/* arXiv abstract embed hint */}
          {arxivId && (
            <div className="mt-4 bg-bg-elevated border border-white/5 rounded-xl px-4 py-3">
              <p className="text-xs text-[#64748B]">
                <span className="text-accent-amber font-medium">arXiv:{arxivId}</span>
                {" "}— click the links above to read the full paper or download the PDF.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}