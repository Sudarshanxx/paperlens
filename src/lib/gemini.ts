// src/lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisResult } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const ANALYSIS_PROMPT = (paperText: string, title: string) => `
You are PaperLens AI — an expert at making research papers accessible to students and junior engineers.

Analyze the following research paper and return a JSON object ONLY (no markdown, no explanation, raw JSON).

Paper Title: ${title}
Paper Content:
---
${paperText.slice(0, 28000)}
---

Return this exact JSON structure:

{
  "summary": {
    "title": "<paper title, clean>",
    "category": "<field: e.g. Machine Learning, NLP, Computer Vision, Biology, Physics>",
    "difficulty": "<one of: Beginner, Intermediate, Advanced, Expert>",
    "oneLiner": "<one punchy sentence what this paper does>",
    "problemSolved": "<2-3 sentences: what problem this paper addresses and why it matters>",
    "methodUsed": "<2-3 sentences: the core method or approach the paper proposes>"
  },
  "keyConcepts": ["<concept 1>", "<concept 2>", "<concept 3>", "...up to 10 concepts"],
  "math": {
    "hasEquations": <true or false>,
    "equations": [
      {
        "latex": "<main equation in plain text or simplified LaTeX, e.g. L = sum(y_i * log(p_i))>",
        "meaning": "<what this equation computes overall>",
        "symbols": [
          { "symbol": "<symbol>", "meaning": "<what it represents>" }
        ],
        "stepByStep": [
          "<step 1 explanation>",
          "<step 2 explanation>",
          "<step 3 explanation>"
        ],
        "humanExplanation": "<explain the math in plain English, as if to a high school student>"
      }
    ]
  },
  "mindMap": {
    "id": "root",
    "label": "<paper title short>",
    "children": [
      {
        "id": "problem",
        "label": "Problem",
        "children": [
          { "id": "p1", "label": "<specific problem aspect>" },
          { "id": "p2", "label": "<specific problem aspect>" }
        ]
      },
      {
        "id": "method",
        "label": "Method",
        "children": [
          { "id": "m1", "label": "<method component>" },
          { "id": "m2", "label": "<method component>" }
        ]
      },
      {
        "id": "results",
        "label": "Results",
        "children": [
          { "id": "r1", "label": "<key result or finding>" },
          { "id": "r2", "label": "<key result or finding>" }
        ]
      },
      {
        "id": "impact",
        "label": "Impact",
        "children": [
          { "id": "i1", "label": "<application or implication>" },
          { "id": "i2", "label": "<application or implication>" }
        ]
      }
    ]
  },
  "learningCards": [
    {
      "question": "What problem does this paper solve?",
      "answer": "<2-3 sentence answer>",
      "icon": "target"
    },
    {
      "question": "What is the main idea?",
      "answer": "<2-3 sentence answer>",
      "icon": "lightbulb"
    },
    {
      "question": "Why does the method work?",
      "answer": "<2-3 sentence answer>",
      "icon": "zap"
    },
    {
      "question": "Where can this be applied?",
      "answer": "<2-3 sentence answer>",
      "icon": "globe"
    },
    {
      "question": "What should I learn next?",
      "answer": "<2-3 sentence answer with specific topics or papers>",
      "icon": "graduation-cap"
    }
  ],
  "relatedTopics": [
    { "label": "<topic 1>", "searchQuery": "<arxiv or google search query>" },
    { "label": "<topic 2>", "searchQuery": "<arxiv or google search query>" },
    { "label": "<topic 3>", "searchQuery": "<arxiv or google search query>" },
    { "label": "<topic 4>", "searchQuery": "<arxiv or google search query>" },
    { "label": "<topic 5>", "searchQuery": "<arxiv or google search query>" }
  ]
}

Rules:
- Return ONLY valid JSON. No markdown code blocks. No preamble.
- If the paper has no equations, set hasEquations: false and equations: []
- Be accurate to the actual paper content
- Make explanations accessible to a junior engineer or student
- All strings must be properly escaped for JSON
`;

export async function analyzeWithGemini(
  paperText: string,
  title: string
): Promise<AnalysisResult> {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 8192,
    },
  });

  const prompt = ANALYSIS_PROMPT(paperText, title);
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Strip any accidental markdown fences
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  const parsed: AnalysisResult = JSON.parse(cleaned);
  return parsed;
}
