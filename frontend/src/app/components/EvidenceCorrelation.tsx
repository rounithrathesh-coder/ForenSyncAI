import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

interface Node {
  id: string;
  label: string;
  color: string;
  x?: number;
  y?: number;
}

interface Connection {
  from: string;
  to: string;
  strength: "critical" | "high" | "medium";
}

export function EvidenceCorrelation() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedCorrelation = localStorage.getItem("correlationData");
    if (storedCorrelation) {
      try {
        const data = JSON.parse(storedCorrelation);
        if (data) {
          const radius = 120;
          const centerX = 200;
          const centerY = 150;
          const newNodes = (data.nodes || []).map((node: Node, i: number, arr: any[]) => {
            const angle = (i / arr.length) * 2 * Math.PI;
            return {
              ...node,
              x: centerX + radius * Math.cos(angle),
              y: centerY + radius * Math.sin(angle)
            };
          });
          setNodes(newNodes);
          setConnections(data.connections || []);
        }
      } catch (e) {
        console.error("Error parsing stored correlation data", e);
      }
    }
  }, []);

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg text-white font-semibold">Evidence Correlation Network</h2>
        {isLoading && <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />}
      </div>

      <div className="relative h-96 bg-gradient-to-br from-black/50 to-purple-900/10 rounded-lg border border-purple-500/20 overflow-hidden">
        {nodes.length === 0 && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            Awaiting evidence analysis...
          </div>
        )}
        
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
          {/* Connections */}
          {connections.map((conn, i) => {
            const fromNode = nodes.find((n) => n.id === conn.from);
            const toNode = nodes.find((n) => n.id === conn.to);
            if (!fromNode || !toNode || fromNode.x === undefined || toNode.x === undefined) return null;

            return (
              <motion.line
                key={i}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={
                  conn.strength === "critical"
                    ? "#ef4444"
                    : conn.strength === "high"
                    ? "#3b82f6"
                    : "#6b7280"
                }
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: i * 0.1 }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node, i) => {
            if (node.x === undefined || node.y === undefined) return null;
            return (
              <motion.g
                key={node.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1, type: "spring" }}
                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="30"
                  fill={`url(#grad-${node.color})`}
                  className="cursor-pointer hover:stroke-white stroke-transparent stroke-2 transition-all"
                />
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fill="white"
                  fontSize="10"
                  className="pointer-events-none"
                >
                  {node.label}
                </text>
              </motion.g>
            );
          })}

          <defs>
            <radialGradient id="grad-red" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#991b1b" />
            </radialGradient>
            <radialGradient id="grad-blue" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </radialGradient>
            <radialGradient id="grad-purple" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#581c87" />
            </radialGradient>
            <radialGradient id="grad-cyan" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#164e63" />
            </radialGradient>
            <radialGradient id="grad-orange" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#9a3412" />
            </radialGradient>
            <radialGradient id="grad-yellow" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#854d0e" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div className="mt-4 flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-gray-400">Critical Link</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span className="text-gray-400">High Correlation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-500 rounded-full" />
          <span className="text-gray-400">Medium</span>
        </div>
      </div>
    </div>
  );
}
