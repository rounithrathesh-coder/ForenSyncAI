import { useState, useEffect } from "react";
import { AlertCircle, ChevronDown, ChevronUp, Loader2 } from "lucide-react";

export function AIAutopsyPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [openCard, setOpenCard] = useState<number | null>(null);
  const [confidence, setConfidence] = useState(94.7);
  
  const [findings, setFindings] = useState([
    {
      category: "Probable Cause of Death",
      severity: "critical",
      summary: "Waiting for evidence upload...",
      details: []
    },
    {
      category: "Injury Patterns",
      severity: "high",
      summary: "Waiting for evidence upload...",
      details: []
    },
    {
      category: "Medical Observations",
      severity: "medium",
      summary: "Waiting for evidence upload...",
      details: []
    },
    {
      category: "Suspicious Indicators",
      severity: "critical",
      summary: "Waiting for evidence upload...",
      details: []
    },
  ]);

  useEffect(() => {
    const storedAutopsy = localStorage.getItem("autopsyData");
    if (storedAutopsy) {
      try {
        const rawText = JSON.parse(storedAutopsy);
        setConfidence(rawText.confidence || 92.5);
        setFindings([
          {
            category: "Probable Cause of Death",
            severity: "critical",
            summary: rawText.probable_cause_desc || "No description provided.",
            details: [`Primary Cause: ${rawText.probable_cause}`, `Confidence: ${rawText.probable_cause_confidence}`]
          },
          {
            category: "Injury Patterns",
            severity: "high",
            summary: "Detected physical traumas and wound patterns on the victim.",
            details: rawText.injury_patterns || []
          },
          {
            category: "Medical Observations",
            severity: "medium",
            summary: "Key physiological indicators observed during preliminary exam.",
            details: rawText.medical_observations || []
          },
          {
            category: "Suspicious Indicators",
            severity: "critical",
            summary: "Anomalies suggesting foul play or timeline manipulation.",
            details: rawText.suspicious_indicators || []
          }
        ]);
      } catch (e) {
        console.error("Error parsing stored autopsy data", e);
      }
    }
  }, []);

  const toggleCard = (index: number) => {
    setOpenCard(openCard === index ? null : index);
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-red-500/30 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg text-white font-semibold">AI Autopsy Analysis</h2>
            <p className="text-xs text-gray-400">AI-Generated Forensic Summary</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isLoading && <Loader2 className="w-5 h-5 text-red-500 animate-spin" />}
          <div className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full">
            <p className="text-xs text-red-400">PRIORITY REVIEW</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {findings.map((finding, index) => {
          const isOpen = openCard === index;
          return (
            <div
              key={index}
              className={`bg-gradient-to-r ${
                finding.severity === "critical"
                  ? "from-red-500/10 to-red-600/10 border-red-500/30"
                  : finding.severity === "high"
                  ? "from-orange-500/10 to-orange-600/10 border-orange-500/30"
                  : "from-yellow-500/10 to-yellow-600/10 border-yellow-500/30"
              } border rounded-lg transition-colors overflow-hidden`}
            >
              {/* Header (Clickable) */}
              <div 
                className="p-4 cursor-pointer hover:bg-white/5 flex items-start justify-between group"
                onClick={() => toggleCard(index)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        finding.severity === "critical"
                          ? "bg-red-500 animate-pulse"
                          : finding.severity === "high"
                          ? "bg-orange-500"
                          : "bg-yellow-500"
                      }`}
                    />
                    <h3 className="text-sm text-white font-semibold">{finding.category}</h3>
                  </div>
                  <p className="text-sm text-gray-300 ml-4">{finding.summary}</p>
                </div>
                <div className="mt-1 ml-4">
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-white transition-colors" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  )}
                </div>
              </div>

              {/* Dropdown Content */}
              {isOpen && finding.details.length > 0 && (
                <div className="border-t border-white/10 p-4 bg-black/20">
                  <ul className="space-y-2 ml-4 list-disc text-sm text-gray-400 marker:text-gray-600">
                    {finding.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-sm text-blue-300">
          <span className="font-semibold">AI Confidence:</span> {confidence}% | Based on extracted evidence
          files and cross-referenced medical databases
        </p>
      </div>
    </div>
  );
}
