// src/app/page.tsx
"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FileText, Upload, Link2, Zap, BookOpen, Sparkles, X, ArrowRight, FlaskConical } from "lucide-react";

type InputType = "text" | "pdf" | "url";

const EXAMPLE_PAPER = {
  title: "Attention Is All You Need",
  content: `We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train. Our model achieves 28.4 BLEU on the WMT 2014 English-to-German translation task, improving over the existing best results, including ensembles, by over 2 BLEU.

The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.

The attention function maps a query and a set of key-value pairs to an output. We compute Scaled Dot-Product Attention: Attention(Q,K,V) = softmax(QK^T / sqrt(dk))V. Multi-Head Attention allows the model to jointly attend to information from different representation subspaces at different positions.`,
};

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

  const loadExample = () => {
    setInputType("text");
    setTitle(EXAMPLE_PAPER.title);
    setContent(EXAMPLE_PAPER.content);
    setError("");
  };

  const handleSubmit = async () => {
    setError("");
    if (!title.trim()) { setError("Give your paper a title — even a short one works."); return; }
    if (inputType === "text" && !content.trim()) { setError("Paste at least the abstract of the paper."); return; }
    if (inputType === "url" && !url.trim()) { setError("Please enter a paper URL."); return; }
    if (inputType === "pdf" && !file) { setError("Please upload your PDF file."); return; }

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
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="fixed top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-accent-violet/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-200px] right-[-100px] w-[500px] h-[500px] rounded-full bg-accent-cyan/8 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center">
            <BookOpen size={16} className="text-accent-cyan" />
          </div>
          <span className="font-bold text-lg tracking-tight">PaperLens</span>
          <span className="text-xs bg-accent-violet/20 text-accent-violet border border-accent-violet/30 rounded-full px-2 py-0.5 ml-1">AI</span>
        </div>
        <button
          onClick={loadExample}
          className="hidden md:flex items-center gap-1.5 text-xs text-[#64748B] hover:text-accent-cyan border border-white/8 hover:border-accent-cyan/30 px-3 py-1.5 rounded-full transition-all"
        >
          <FlaskConical size={12} />
          Try an example
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">
        <div className="max-w-xl w-full">

          {/* Headline */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-accent-cyan/80 border border-accent-cyan/20 bg-accent-cyan/5 px-3 py-1.5 rounded-full mb-4">
              <Sparkles size={10} />
             Powered by Groq + Llama 3.3
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 leading-[1.08]">
              Understand any paper
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-blue-400 to-accent-violet">
                in 30 seconds.
              </span>
            </h1>
            <p className="text-[#64748B] text-sm md:text-base leading-relaxed">
              Paste an abstract, upload a PDF, or drop an arXiv link.
              <br className="hidden md:block" />
              Get visual breakdowns with mind maps, math & learning cards.
            </p>
          </div>

          {/* Card */}
          <div className="gradient-border p-5 md:p-6">

            {/* Step 1 */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 rounded-full bg-accent-cyan/20 border border-accent-cyan/40 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-accent-cyan">1</span>
              </div>
              <span className="text-xs text-[#94A3B8] font-medium">Choose how to add your paper</span>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-bg-surface rounded-xl p-1 mb-4">
              {([
                { type: "text" as InputType, label: "Paste Text", icon: <FileText size={13} />, hint: "Abstract or full text" },
                { type: "pdf" as InputType, label: "Upload PDF", icon: <Upload size={13} />, hint: "Any research PDF" },
                { type: "url" as InputType, label: "arXiv / URL", icon: <Link2 size={13} />, hint: "Direct paper link" },
              ]).map((tab) => (
                <button
                  key={tab.type}
                  onClick={() => setInputType(tab.type)}
                  className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1 rounded-lg transition-all ${
                    inputType === tab.type ? "bg-bg-card text-white shadow-sm" : "text-[#64748B] hover:text-[#94A3B8]"
                  }`}
                >
                  <span className="flex items-center gap-1 text-xs font-semibold">{tab.icon} {tab.label}</span>
                  <span className="text-[10px] text-[#475569]">{tab.hint}</span>
                </button>
              ))}
            </div>

            {/* Text input */}
            {inputType === "text" && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-[#64748B] font-medium">Abstract or paper text</label>
                  <button onClick={loadExample} className="text-xs text-accent-cyan/70 hover:text-accent-cyan transition-colors flex items-center gap-1">
                    <FlaskConical size={10} /> Load example
                  </button>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={"Paste the abstract or full paper text here...\n\nEven just the abstract works great!"}
                  rows={6}
                  className="w-full bg-bg-surface border border-white/8 rounded-xl px-4 py-3 text-sm placeholder:text-[#2D3B55] focus:outline-none focus:border-accent-cyan/40 focus:bg-bg-elevated transition-all resize-none leading-relaxed"
                />
              </div>
            )}

            {/* URL input */}
            {inputType === "url" && (
              <div className="mb-4">
                <label className="text-xs text-[#64748B] font-medium mb-1.5 block">Paper URL</label>
                <div className="relative mb-2">
                  <Link2 size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#475569]" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => { setUrl(e.target.value); if (!title && e.target.value.includes("arxiv")) setTitle("arXiv Paper"); }}
                    placeholder="https://arxiv.org/abs/1706.03762"
                    className="w-full bg-bg-surface border border-white/8 rounded-xl pl-10 pr-4 py-3 text-sm placeholder:text-[#2D3B55] focus:outline-none focus:border-accent-cyan/40 transition-all"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs text-[#475569] self-center">Try:</span>
                  {[
                    { label: "Transformers (2017)", url: "https://arxiv.org/abs/1706.03762", title: "Attention Is All You Need" },
                    { label: "BERT (2018)", url: "https://arxiv.org/abs/1810.04805", title: "BERT" },
                  ].map((ex) => (
                    <button key={ex.label} onClick={() => { setUrl(ex.url); setTitle(ex.title); }}
                      className="text-xs text-accent-cyan/70 hover:text-accent-cyan border border-accent-cyan/15 hover:border-accent-cyan/40 px-2.5 py-1 rounded-lg transition-all">
                      {ex.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PDF input */}
            {inputType === "pdf" && (
              <div className="mb-4">
                <label className="text-xs text-[#64748B] font-medium mb-1.5 block">Upload your PDF</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-7 text-center cursor-pointer transition-all ${file ? "border-accent-cyan/40 bg-accent-cyan/5" : "border-white/10 hover:border-accent-cyan/20 hover:bg-bg-elevated"}`}
                >
                  {file ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText size={18} className="text-accent-cyan" />
                      <span className="text-sm text-white font-medium">{file.name}</span>
                      <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-[#64748B] hover:text-accent-rose transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={22} className="text-[#475569] mx-auto mb-2" />
                      <p className="text-sm text-[#64748B] font-medium">Click to browse or drag & drop</p>
                      <p className="text-xs text-[#334155] mt-1">PDF up to 10MB</p>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
              </div>
            )}

            {/* Divider + Step 2 */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-white/5" />
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-accent-violet/20 border border-accent-violet/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-accent-violet">2</span>
                </div>
                <span className="text-xs text-[#94A3B8] font-medium">Give it a title</span>
              </div>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            <div className="mb-5">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Paper title (e.g. Attention Is All You Need)"
                className="w-full bg-bg-surface border border-white/8 rounded-xl px-4 py-3 text-sm placeholder:text-[#2D3B55] focus:outline-none focus:border-accent-violet/40 focus:bg-bg-elevated transition-all"
              />
            </div>

            {error && (
              <div className="mb-4 bg-accent-rose/10 border border-accent-rose/20 text-accent-rose text-sm px-4 py-3 rounded-xl flex items-start gap-2">
                <span>⚠</span><span>{error}</span>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-accent-cyan to-blue-500 hover:brightness-110 text-bg-base font-bold py-4 rounded-xl transition-all text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent-cyan/20 active:scale-[0.99]"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-bg-base/30 border-t-bg-base rounded-full spin" />Starting analysis...</>
              ) : (
                <><Zap size={16} />Analyze Paper<ArrowRight size={14} className="ml-1" /></>
              )}
            </button>
          </div>

          {/* What you get */}
          <div className="mt-5 grid grid-cols-4 gap-2">
            {[
              { icon: "📋", label: "Summary" },
              { icon: "🧠", label: "Mind Map" },
              { icon: "∑", label: "Math" },
              { icon: "🃏", label: "Cards" },
            ].map((f) => (
              <div key={f.label} className="bg-bg-surface/50 border border-white/5 rounded-xl p-3 text-center">
                <div className="text-lg mb-1">{f.icon}</div>
                <div className="text-xs text-[#64748B]">{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Steps */}
      <section className="relative z-10 pb-12 px-4">
        <div className="max-w-xl mx-auto">
          <p className="text-center text-xs text-[#334155] uppercase tracking-widest font-mono mb-5">How it works</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { emoji: "📄", title: "Add Paper", desc: "Text, PDF, or URL" },
              { emoji: "⚡", title: "AI Analyzes", desc: "~15–30 seconds" },
              { emoji: "✨", title: "Understand", desc: "Visual breakdown" },
            ].map((step, i) => (
              <div key={i} className="bg-bg-surface border border-white/5 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-2">{step.emoji}</div>
                <div className="text-sm font-semibold mb-1">{step.title}</div>
                <div className="text-xs text-[#64748B]">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}