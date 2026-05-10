// src/components/results/MindMapSection.tsx
"use client";
import { useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { GitBranch } from "lucide-react";
import { MindMapNode } from "@/types";

const NODE_COLORS: Record<number, string> = {
  0: "#00E5FF", // root - cyan
  1: "#7C3AED", // level 1 - violet
  2: "#10B981", // level 2 - green
};

function flattenToNodesAndEdges(
  node: MindMapNode,
  parentId: string | null = null,
  level: number = 0,
  xBase: number = 0,
  yBase: number = 0,
  siblingIndex: number = 0,
  totalSiblings: number = 1
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const color = NODE_COLORS[level] || "#94A3B8";
  const xSpacing = level === 0 ? 0 : level === 1 ? 260 : 200;
  const ySpacing = level === 0 ? 0 : level === 1 ? 160 : 80;

  const x =
    level === 0
      ? 400
      : level === 1
      ? siblingIndex * xSpacing
      : xBase + (siblingIndex - (totalSiblings - 1) / 2) * xSpacing;

  const y = level === 0 ? 0 : level === 1 ? yBase + 160 : yBase + 100;

  nodes.push({
    id: node.id,
    position: { x, y },
    data: { label: node.label },
    style: {
      background: level === 0 ? `${color}22` : `${color}11`,
      border: `1px solid ${color}44`,
      borderRadius: level === 0 ? "12px" : "8px",
      color: level === 0 ? color : level === 1 ? color : "#94A3B8",
      fontFamily: "var(--font-syne)",
      fontSize: level === 0 ? "14px" : level === 1 ? "12px" : "11px",
      fontWeight: level <= 1 ? "600" : "400",
      padding: level === 0 ? "10px 20px" : "6px 12px",
      minWidth: level === 0 ? "160px" : "100px",
      textAlign: "center",
    },
    type: "default",
  });

  if (parentId) {
    edges.push({
      id: `${parentId}-${node.id}`,
      source: parentId,
      target: node.id,
      style: { stroke: `${color}33`, strokeWidth: 1.5 },
      animated: level === 1,
    });
  }

  if (node.children) {
    node.children.forEach((child, i) => {
      const childResult = flattenToNodesAndEdges(
        child,
        node.id,
        level + 1,
        x,
        y,
        i,
        node.children!.length
      );
      nodes.push(...childResult.nodes);
      edges.push(...childResult.edges);
    });
  }

  return { nodes, edges };
}

export default function MindMapSection({ mindMap }: { mindMap: MindMapNode }) {
  const { nodes: initNodes, edges: initEdges } = useMemo(
    () => flattenToNodesAndEdges(mindMap),
    [mindMap]
  );

  const [nodes, , onNodesChange] = useNodesState(initNodes);
  const [edges, , onEdgesChange] = useEdgesState(initEdges);

  return (
    <div className="bg-bg-surface border border-white/7 rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <GitBranch size={18} className="text-accent-violet" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[#94A3B8] font-mono">
          Mind Map
        </h2>
      </div>

      <div
        className="rounded-xl overflow-hidden border border-white/5"
        style={{ height: "420px", background: "#0A0D18" }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          attributionPosition="bottom-right"
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1}
            color="rgba(255,255,255,0.04)"
          />
          <Controls
            style={{
              background: "#1A2035",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "8px",
            }}
          />
        </ReactFlow>
      </div>
      <p className="text-xs text-[#334155] text-center mt-3 font-mono">
        Drag to pan · Scroll to zoom · Click nodes to select
      </p>
    </div>
  );
}
