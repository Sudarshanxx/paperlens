# PaperLens AI 🔬

> **Understand research papers in minutes, not hours.**

PaperLens AI is an AI-powered web application that transforms complex research papers into simple, visual, and beginner-friendly explanations. Users can paste research text, upload PDFs, or provide arXiv links to instantly generate summaries, concept breakdowns, mathematical explanations, interactive mind maps, and learning cards.

Built for students, developers, researchers, and curious learners who want to quickly understand academic papers without reading every page.

---

# ✨ Features

- 📄 Upload PDFs or paste research abstracts
- 🔗 Analyze arXiv research paper links
- 🤖 AI-generated simplified explanations
- 🧠 Interactive mind maps using ReactFlow
- 📚 Key concepts and topic extraction
- 📐 Mathematical equation explanations
- 🎴 Flip-card learning system
- 🔍 Related research topic recommendations
- ⚡ Real-time async processing with polling
- 🌐 Fully responsive modern UI

---

# 🏗️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | Next.js 15, React, Tailwind CSS |
| Backend | Next.js API Routes |
| Database | PostgreSQL + Prisma ORM |
| AI Model | Grok API (xAI) |
| Visualization | ReactFlow |
| Animation | Framer Motion |
| Deployment | Vercel + Railway |

---

# 📂 Project Structure

```bash
paperlens/
│
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── paper/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   └── results/
│   │
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── grok.ts
│   │   ├── processor.ts
│   │   └── fetchPaperUrl.ts
│   │
│   └── types/
│
├── .env.example
├── next.config.ts
├── package.json
└── README.md
