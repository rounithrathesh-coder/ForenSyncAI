import { useState, useEffect } from "react";
import { Brain, Download, Sparkles, Activity, Search, Target, Loader2 } from "lucide-react";
import { AutopsyAnalysisTab } from "./AIAnalysis/AutopsyAnalysisTab";
import { AnomalyDetectionTab } from "./AIAnalysis/AnomalyDetectionTab";
import { PatternRecognitionTab } from "./AIAnalysis/PatternRecognitionTab";

const tabs = [
  { id: "autopsy", label: "Autopsy Analysis", icon: Brain },
  { id: "anomaly", label: "Anomaly Detection", icon: Search },
  { id: "pattern", label: "Pattern Recognition", icon: Target },
];

export function AIAnalysisPage() {
  const [activeTab, setActiveTab] = useState("autopsy");
  const [isGenerating, setIsGenerating] = useState(false);
  const [autopsyData, setAutopsyData] = useState<any>(null);
  const [anomalyData, setAnomalyData] = useState<any>(null);
  const [patternData, setPatternData] = useState<any>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedAutopsy = localStorage.getItem("autopsyData");
    const storedAnomaly = localStorage.getItem("anomalyData");
    const storedPattern = localStorage.getItem("patternData");
    
    if (storedAutopsy) setAutopsyData(JSON.parse(storedAutopsy));
    if (storedAnomaly) setAnomalyData(JSON.parse(storedAnomaly));
    if (storedPattern) setPatternData(JSON.parse(storedPattern));
  }, []);

  const handleGenerate = async () => {
    const evidenceText = localStorage.getItem("rawEvidenceText");
    if (!evidenceText) {
      alert("No evidence found. Please upload a PDF in the Evidence Upload tab first.");
      return;
    }

    setIsGenerating(true);
    try {
      // Always call the full analysis to keep everything in sync and save tokens overall
      const response = await fetch(`http://127.0.0.1:5000/analyze-full`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ evidence: evidenceText }),
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Analysis failed");

      // Store all parts
      if (data.autopsy) {
        setAutopsyData(data.autopsy);
        localStorage.setItem("autopsyData", JSON.stringify(data.autopsy));
      }
      if (data.anomalies) {
        setAnomalyData(data.anomalies);
        localStorage.setItem("anomalyData", JSON.stringify(data.anomalies));
      }
      if (data.patterns) {
        setPatternData(data.patterns);
        localStorage.setItem("patternData", JSON.stringify(data.patterns));
      }
      
      // Store other parts for other pages
      if (data.report) localStorage.setItem("caseReportData", JSON.stringify(data.report));
      if (data.timeline) localStorage.setItem("timelineData", JSON.stringify(data.timeline));
      if (data.risk) localStorage.setItem("riskData", JSON.stringify(data.risk));
      if (data.insights) localStorage.setItem("insightsData", JSON.stringify(data.insights));
      if (data.heatmap) localStorage.setItem("heatmapData", JSON.stringify(data.heatmap));
      if (data.correlation) localStorage.setItem("correlationData", JSON.stringify(data.correlation));

    } catch (error: any) {
      console.error("Failed to fetch AI analysis:", error);
      alert("Analysis failed: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-red-500" />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">AI Analysis</h1>
              <p className="text-sm text-gray-400">AI-powered forensic insights and analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-transparent border border-gray-600 hover:border-gray-400 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Export Analysis</span>
            </button>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white rounded-lg transition-colors shadow-lg shadow-red-500/20 disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span className="text-sm font-medium">{isGenerating ? "Analyzing Evidence..." : "Generate New Analysis"}</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-red-500 text-red-500 bg-red-500/10 rounded-t-lg"
                  : "border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5 rounded-t-lg"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "autopsy" && <AutopsyAnalysisTab data={autopsyData} />}
          {activeTab === "anomaly" && <AnomalyDetectionTab data={anomalyData} />}
          {activeTab === "pattern" && <PatternRecognitionTab data={patternData} />}
        </div>
      </div>
    </div>
  );
}
