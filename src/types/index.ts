// src/types/index.ts

export interface MathEquation {
  latex: string;
  meaning: string;
  symbols: { symbol: string; meaning: string }[];
  stepByStep: string[];
  humanExplanation: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
}

export interface LearningCard {
  question: string;
  answer: string;
  icon: string;
}

export interface AnalysisResult {
  summary: {
    title: string;
    category: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    oneLiner: string;
    problemSolved: string;
    methodUsed: string;
  };
  keyConcepts: string[];
  math: {
    hasEquations: boolean;
    equations: MathEquation[];
  };
  mindMap: MindMapNode;
  learningCards: LearningCard[];
  relatedTopics: { label: string; searchQuery: string }[];
}

export interface PaperWithJob {
  id: string;
  title: string;
  inputType: string;
  sourceUrl?: string | null;
  fileName?: string | null;
  createdAt: string;
  job?: {
    id: string;
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    step?: string | null;
    error?: string | null;
    result?: AnalysisResult | null;
  } | null;
}
