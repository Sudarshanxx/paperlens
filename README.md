# PaperLens AI 🔬

> **See through any research paper — instantly.**

PaperLens AI is a web application that transforms research papers into visual, beginner-friendly explanations. Paste an abstract, upload a PDF, or drop an arXiv URL — click Analyze — and get a structured explanation page with a summary card, key concept tags, math breakdowns, an interactive mind map, flip-card learning aids, and related topic links. It's designed for students, junior engineers, and researchers who want to quickly grasp a paper without reading it end-to-end.

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     Vercel (Next.js)                      │
│                                                           │
│  ┌────────────┐    ┌──────────────────────────────────┐  │
│  │  App Router│    │         API Routes               │  │
│  │  (SSR/RSC) │    │  POST /api/analyze               │  │
│  │            │    │  GET  /api/jobs/[jobId]  ←polling│  │
│  │  / (home)  │    │  GET  /api/papers                │  │
│  │  /paper/[id]│   └──────────────┬───────────────────┘  │
│  └────────────┘                   │                       │
└───────────────────────────────────┼───────────────────────┘
                                    │ Prisma ORM
                                    ▼
                    ┌───────────────────────────┐
                    │   Railway PostgreSQL       │
                    │  papers table             │
                    │  jobs table (status+result)│
                    └───────────────────────────┘
                                    │
                    ┌───────────────▼───────────┐
                    │   Google Gemini 1.5 Flash  │
                    │  (called from processor.ts)│
                    └───────────────────────────┘
```

**Layers:**
- **Frontend** — Next.js App Router, React, Tailwind CSS, ReactFlow (mind map), Framer Motion
- **API** — Next.js API Routes (no separate Express server needed; deployed as Vercel serverless functions)
- **Database** — PostgreSQL on Railway via Prisma ORM; two tables: `Paper` (input) and `Job` (status + result JSON)
- **AI** — Google Gemini 1.5 Flash via `@google/generative-ai` SDK; returns structured JSON in one shot
- **Async** — DB-polling pattern: API fires `processJob()` without awaiting, client polls `/api/jobs/[jobId]` every 2 seconds until status becomes `COMPLETED` or `FAILED`

---

## Why This Stack

| Decision | Reasoning |
|---|---|
| **Next.js App Router** | SSR + API routes in one repo = one Vercel deployment. No CORS, no separate server. `maxDuration` on API routes handles the ~20s Gemini call. |
| **Next.js API Routes over Express** | Express would require a separate Railway service + CORS config. API routes ship in the same Vercel project, simpler for a solo full-stack app. |
| **PostgreSQL + Prisma** | Typed schema, migration files, free Railway tier. The `Job` table doubles as a job queue — no Redis needed for this scale. |
| **DB Polling over WebSockets** | Simpler to deploy (no persistent connections on Vercel serverless). 2-second polling is imperceptible to users for a ~15s job. |
| **Gemini 1.5 Flash** | Free tier, 1M token context window (can handle full PDFs), fast, returns clean JSON when prompted properly. |
| **ReactFlow** | Best React mind map library — declarative nodes/edges, built-in pan/zoom, zero canvas boilerplate. |

---

## Folder Structure

```
paperlens/
├── prisma/
│   └── schema.prisma          # DB schema (Paper + Job models)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/
│   │   │   │   └── route.ts   # POST — accepts paper input, spawns job
│   │   │   ├── jobs/
│   │   │   │   └── [jobId]/
│   │   │   │       └── route.ts # GET (poll status) + POST (retry)
│   │   │   └── papers/
│   │   │       └── route.ts   # GET — list recent papers
│   │   ├── paper/
│   │   │   └── [paperId]/
│   │   │       └── page.tsx   # Processing screen + results view
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx           # Home / input screen
│   ├── components/
│   │   └── results/
│   │       ├── ResultsView.tsx     # Orchestrates all result sections
│   │       ├── SummaryCard.tsx     # Title, category, difficulty, problem, method
│   │       ├── KeyConcepts.tsx     # Concept chips/tags
│   │       ├── MathSection.tsx     # Equation, symbols, step-by-step, plain English
│   │       ├── MindMapSection.tsx  # ReactFlow interactive mind map
│   │       ├── LearningCards.tsx   # Flip cards
│   │       └── RelatedTopics.tsx   # Clickable arXiv links
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── gemini.ts          # Gemini SDK wrapper + prompt
│   │   ├── processor.ts       # Background job runner
│   │   └── fetchPaperUrl.ts   # URL/arXiv fetcher
│   └── types/
│       └── index.ts           # Shared TypeScript types
├── .env.example
├── .gitignore
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL running locally (or a Railway DB URL)
- Gemini API key (free at https://ai.google.dev)

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/paperlens.git
cd paperlens
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/paperlens"
GEMINI_API_KEY="your-gemini-api-key"
```

### 3. Set up the database

```bash
# Push schema to your DB (creates tables)
npx prisma db push

# Optional: open Prisma Studio to inspect data
npx prisma studio
```

### 4. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000

---

## .env.example Walkthrough

```env
DATABASE_URL     # PostgreSQL connection string. Prisma uses this to connect.
                 # Railway format: postgresql://USER:PASS@HOST:PORT/DB?sslmode=require

GEMINI_API_KEY   # Your Google AI Studio key. Free at https://ai.google.dev/gemini-api/docs/api-key
                 # Used in src/lib/gemini.ts
```

---

## API Endpoints

### `POST /api/analyze`
Start paper analysis. Accepts `multipart/form-data`.

**Fields:**
| Field | Type | Required |
|---|---|---|
| `title` | string | ✅ |
| `inputType` | `text` \| `pdf` \| `url` | ✅ |
| `content` | string | if inputType=text |
| `url` | string | if inputType=url |
| `file` | File (PDF) | if inputType=pdf |

**Response:**
```json
{ "paperId": "clxyz123", "jobId": "cljob456" }
```

---

### `GET /api/jobs/:jobId`
Poll job status.

**Response (processing):**
```json
{
  "id": "cljob456",
  "status": "PROCESSING",
  "step": "Explaining math",
  "error": null,
  "result": null,
  "paper": { "id": "clxyz123", "title": "Attention Is All You Need", "inputType": "text" }
}
```

**Response (completed):**
```json
{
  "id": "cljob456",
  "status": "COMPLETED",
  "step": "Done",
  "result": {
    "summary": { "title": "...", "category": "NLP", "difficulty": "Advanced", ... },
    "keyConcepts": ["Transformers", "Self-Attention", ...],
    "math": { "hasEquations": true, "equations": [...] },
    "mindMap": { "id": "root", "label": "...", "children": [...] },
    "learningCards": [...],
    "relatedTopics": [...]
  }
}
```

---

### `POST /api/jobs/:jobId`
Retry a failed job.

```json
{ "ok": true }
```

---

### `GET /api/papers`
List the 20 most recent papers with job status.

---

## The Exact AI Prompt

The prompt lives in `src/lib/gemini.ts` as `ANALYSIS_PROMPT`. Key design decisions:

1. **Role priming** — "You are PaperLens AI — an expert at making research papers accessible to students and junior engineers." This anchors the output register.

2. **Strict JSON instruction** — "Return this exact JSON structure" with the full schema inline. Followed by "Return ONLY valid JSON. No markdown code blocks. No preamble." This eliminates the `json` code fence Gemini often wraps output in.

3. **Truncation** — `paperText.slice(0, 28000)` keeps us within Gemini Flash's safe output zone while covering most papers.

4. **Temperature 0.3** — Low enough to produce consistent, parseable JSON; high enough to write natural explanations.

5. **Fallback rules** — "If the paper has no equations, set hasEquations: false and equations: []" prevents null crashes.

---

## Async Processing Flow

```
Browser                  Next.js API             PostgreSQL          Gemini
  │                          │                       │                  │
  │── POST /api/analyze ────>│                       │                  │
  │                          │── INSERT Paper ──────>│                  │
  │                          │── INSERT Job(PENDING)>│                  │
  │<── { paperId, jobId } ───│                       │                  │
  │                          │                       │                  │
  │  [fire and forget]       │── processJob() ───────────────────────> │
  │                          │   (no await)          │                  │
  │                          │── UPDATE Job(PROCESSING)>│              │
  │                          │                       │  [AI call ~15s]  │
  │── GET /api/jobs/:id ────>│── SELECT Job ────────>│                  │
  │<── { status:PROCESSING } │                       │                  │
  │   (polls every 2s)       │                       │                  │
  │── GET /api/jobs/:id ────>│                       │<── JSON result ──│
  │                          │── UPDATE Job(COMPLETED,result)>│         │
  │<── { status:COMPLETED,   │                       │                  │
  │      result: {...} }     │                       │                  │
  │                          │                       │                  │
  │  [renders ResultsView]   │                       │                  │
```

The frontend detects completion when `job.status === "COMPLETED"` in the poll response, then renders `<ResultsView>` with the stored result JSON. Polling stops.

---

## How Frontend Detects Completion

In `src/app/paper/[paperId]/page.tsx`:

```ts
const interval = setInterval(() => {
  if (job?.status === "COMPLETED" || job?.status === "FAILED") {
    clearInterval(interval); // stop polling
    return;
  }
  fetchJob(); // GET /api/jobs/:jobId
}, 2000);
```

When `status === "COMPLETED"`, the component renders `<ResultsView result={job.result} />` instead of the processing screen.

---

## Deployment (Vercel + Railway)

### Railway (PostgreSQL)
1. Create a new Railway project → Add PostgreSQL
2. Copy the `DATABASE_URL` from Variables tab
3. Run `DATABASE_URL=<url> npx prisma db push` to create tables

### Vercel
1. Push this repo to GitHub
2. Import to Vercel → Framework: Next.js
3. Set environment variables:
   - `DATABASE_URL` = Railway PostgreSQL URL
   - `GEMINI_API_KEY` = your key
4. Deploy

> **Important:** Set Railway's Networking → Public URL to allow Vercel's IPs if you see connection timeouts.

---

## Known Limitations

- **Vercel serverless timeout** — Default is 10s; the Gemini call can take 15-25s for large papers. Set `maxDuration = 60` on the analyze route (requires Vercel Pro) or use Railway for the Node API. For hobby tier, abstract-only input works fine.
- **PDF text quality** — `pdf-parse` extracts raw text, which may lose math formatting. Full LaTeX extraction would require a Python microservice with `pypdf2` or `pdfplumber`.
- **arXiv rate limits** — Fetching full paper HTML can be rate-limited. Abstract-only is used as a fallback.
- **No auth** — All papers are public in the DB. Would add Clerk/NextAuth for user-scoped history.
- **Mind map layout** — Node positions are computed algorithmically; complex papers with many children may overlap. A proper tree-layout algorithm (e.g., D3 tree) would improve this.

---

## What I'd Improve With More Time

1. **Python microservice** — FastAPI service for proper PDF text + figure extraction using `pdfplumber`, plus prompt construction. Keeps Node thin.
2. **Redis + BullMQ** — Replace DB polling with a proper job queue. Retry logic, job priorities, concurrency limits.
3. **arXiv PDF pipeline** — Fetch the actual PDF from arXiv, extract full text, not just the abstract HTML.
4. **Chat with paper** — Second tab on the results page: send follow-up questions about the paper, with the paper text in context.
5. **Export as PDF** — Generate a shareable summary card PDF using Puppeteer.
6. **Search history** — Full-text search over past analyses.
7. **Better mind map layout** — Use D3's tree layout for proper hierarchical spacing.
8. **LaTeX rendering** — Use KaTeX to render equations properly instead of plain text.
9. **Auth + personal library** — Clerk integration so users can save and revisit their analyses.
10. **Docker Compose** — One-command local setup with Postgres + app containers.
#   p a p e r l e n s  
 