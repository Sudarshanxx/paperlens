// src/app/page.tsx
"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Upload,
  Link2,
  Zap,
  BookOpen,
  Brain,
  Sparkles,
  ChevronRight,
  X,
} from "lucide-react";

type InputType = "text" | "pdf" | "url";

export default function HomePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [inputType, setInputType] = useState<InputType>("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!title.trim()) { setError("Please enter a paper title."); return; }
    if (inputType === "text" && !content.trim()) { setError("Please paste the paper content."); return; }
    if (inputType === "url" && !url.trim()) { setError("Please enter a paper URL."); return; }
    if (inputType === "pdf" && !file) { setError("Please upload a PDF file."); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("inputType", inputType);
      if (inputType === "text") formData.append("content", content);
      if (inputType === "url") formData.append("url", url);
      if (inputType === "pdf" && file) formData.append("file", file);

      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start analysis");

      router.push(`/paper/${data.paperId}?jobId=${data.jobId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  const tabs: { type: InputType; label: string; icon: React.ReactNode }[] = [
    { type: "text", label: "Paste Text", icon: <FileText size={15} /> },
    { type: "pdf", label: "Upload PDF", icon: <Upload size={15} /> },
    { type: "url", label: "Paper URL", icon: <Link2 size={15} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="fixed top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-accent-violet/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-200px] right-[-100px] w-[500px] h-[500px] rounded-full bg-accent-cyan/8 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-6 py-5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center">
            <BookOpen size={16} className="text-accent-cyan" />
          </div>
          <span className="font-bold text-lg tracking-tight">PaperLens</span>
          <span className="text-xs bg-accent-violet/20 text-accent-violet border border-accent-violet/30 rounded-full px-2 py-0.5 ml-1">AI</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-[#94A3B8]">
          <a href="#how" className="hover:text-white transition-colors">How it works</a>
          <a href="https://arxiv.org" target="_blank" rel="noopener" className="hover:text-white transition-colors">Browse Papers</a>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 relative z-10">
        <div className="max-w-2xl w-full">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="flex items-center gap-1.5 text-xs font-mono text-accent-cyan/80 border border-accent-cyan/20 bg-accent-cyan/5 px-3 py-1.5 rounded-full">
              <Sparkles size={11} />
              Powered by Gemini 1.5 Flash
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-center text-4xl md:text-6xl font-extrabold tracking-tight mb-4 leading-[1.05]">
            See through any
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-blue-400 to-accent-violet">
              research paper.
            </span>
          </h1>
          <p className="text-center text-[#94A3B8] text-base md:text-lg mb-12 max-w-md mx-auto leading-relaxed">
            Paste, upload, or link a paper. Get visual explanations, mind maps, 
            math breakdowns, and learning cards — instantly.
          </p>

          {/* Input card */}
          <div className="gradient-border p-6 md:p-8">
            {/* Input type tabs */}
            <div className="flex gap-1 bg-bg-surface rounded-xl p-1 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.type}
                  onClick={() => setInputType(tab.type)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    inputType === tab.type
                      ? "bg-bg-card text-white shadow-sm"
                      : "text-[#64748B] hover:text-[#94A3B8]"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Title field */}
            <div className="mb-4">
              <label className="text-xs text-[#64748B] uppercase tracking-widest font-mono mb-2 block">
                Paper Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Attention Is All You Need"
                className="w-full bg-bg-surface border border-white/8 rounded-xl px-4 py-3 text-sm placeholder:text-[#334155] focus:outline-none focus:border-accent-cyan/40 focus:bg-bg-elevated transition-all"
              />
            </div>

            {/* Content field */}
            {inputType === "text" && (
              <div className="mb-6">
                <label className="text-xs text-[#64748B] uppercase tracking-widest font-mono mb-2 block">
                  Paper Content / Abstract
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste the abstract, introduction, or full paper text here..."
                  rows={7}
                  className="w-full bg-bg-surface border border-white/8 rounded-xl px-4 py-3 text-sm placeholder:text-[#334155] focus:outline-none focus:border-accent-cyan/40 focus:bg-bg-elevated transition-all resize-none leading-relaxed"
                />
              </div>
            )}

            {inputType === "url" && (
              <div className="mb-6">
                <label className="text-xs text-[#64748B] uppercase tracking-widest font-mono mb-2 block">
                  Paper URL
                </label>
                <div className="relative">
                  <Link2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569]" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://arxiv.org/abs/1706.03762"
                    className="w-full bg-bg-surface border border-white/8 rounded-xl pl-9 pr-4 py-3 text-sm placeholder:text-[#334155] focus:outline-none focus:border-accent-cyan/40 focus:bg-bg-elevated transition-all"
                  />
                </div>
                <p className="text-xs text-[#475569] mt-2">Supports arXiv, bioRxiv, and most paper links</p>
              </div>
            )}

            {inputType === "pdf" && (
              <div className="mb-6">
                <label className="text-xs text-[#64748B] uppercase tracking-widest font-mono mb-2 block">
                  PDF File
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    file
                      ? "border-accent-cyan/40 bg-accent-cyan/5"
                      : "border-white/10 hover:border-white/20 hover:bg-bg-elevated"
                  }`}
                >
                  {file ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText size={20} className="text-accent-cyan" />
                      <span className="text-sm text-white">{file.name}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                        className="text-[#64748B] hover:text-white"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={24} className="text-[#475569] mx-auto mb-2" />
                      <p className="text-sm text-[#64748B]">Drop a PDF here or click to browse</p>
                      <p className="text-xs text-[#334155] mt-1">Max 10MB</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                />
              </div>
            )}

            {error && (
              <div className="mb-4 bg-accent-rose/10 border border-accent-rose/30 text-accent-rose text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-accent-cyan to-blue-500 hover:from-accent-cyan/90 hover:to-blue-500/90 text-bg-base font-bold py-4 rounded-xl transition-all text-sm tracking-wide disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-accent-cyan/20"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-bg-base/40 border-t-bg-base rounded-full spin" />
                  Starting analysis...
                </>
              ) : (
                <>
                  <Zap size={16} />
                  Analyze Paper
                </>
              )}
            </button>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {[
              { icon: <Brain size={12} />, label: "AI Explanation" },
              { icon: <Sparkles size={12} />, label: "Mind Map" },
              { icon: <FileText size={12} />, label: "Math Breakdown" },
              { icon: <BookOpen size={12} />, label: "Learning Cards" },
            ].map((feat) => (
              <span
                key={feat.label}
                className="flex items-center gap-1.5 text-xs text-[#475569] border border-white/5 px-3 py-1.5 rounded-full"
              >
                {feat.icon}
                {feat.label}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* How it works */}
      <section id="how" className="relative z-10 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-xs text-[#334155] uppercase tracking-widest font-mono mb-8">How it works</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { n: "01", title: "Add Paper", desc: "Paste text, upload PDF, or drop a URL" },
              { n: "02", title: "AI Analyzes", desc: "Gemini reads and structures the paper" },
              { n: "03", title: "Understand", desc: "Visual explanation, maps & cards" },
            ].map((step, i) => (
              <div key={i} className="bg-bg-surface border border-white/5 rounded-2xl p-5 text-center">
                <div className="text-3xl font-extrabold text-white/5 font-mono mb-3">{step.n}</div>
                <div className="text-sm font-semibold mb-1">{step.title}</div>
                <div className="text-xs text-[#64748B] leading-relaxed">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
