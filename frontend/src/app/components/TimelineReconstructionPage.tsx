import { useState, useEffect } from "react";
import {
  Clock, PersonStanding, VideoOff, Brain, Asterisk,
  ChevronDown, ChevronUp, Zap, Loader2, SendHorizonal,
  Download, AlertTriangle, CheckCircle, Eye
} from "lucide-react";

type Severity = "standard" | "warning" | "critical";
type EventType = "observed" | "predicted" | "gap";

interface TimelineEvent {
  time: string;
  title: string;
  description: string;
  severity: Severity;
  confidence: number;
  type: EventType;
  concurrent_group: number | null;
}

interface TimelineData {
  summary: string;
  events: TimelineEvent[];
  ai_predictions?: { title: string; description: string; confidence: number; basis: string }[];
  ai_insights?: { type: string; title: string; description: string }[];
}

const severityConfig: Record<Severity, { label: string; borderColor: string; textColor: string; barBg: string; barFill: string }> = {
  standard: {
    label: "STANDARD",
    borderColor: "border-blue-400",
    textColor: "text-blue-400",
    barBg: "bg-blue-950",
    barFill: "bg-blue-500",
  },
  warning: {
    label: "WARNING",
    borderColor: "border-yellow-400",
    textColor: "text-yellow-400",
    barBg: "bg-yellow-950",
    barFill: "bg-yellow-500",
  },
  critical: {
    label: "CRITICAL",
    borderColor: "border-red-400",
    textColor: "text-red-400",
    barBg: "bg-red-950",
    barFill: "bg-red-500",
  },
};

const typeIconConfig: Record<EventType, { icon: React.ElementType; iconColor: string; lineColor: string }> = {
  observed: { icon: Eye, iconColor: "text-blue-400", lineColor: "bg-blue-500" },
  gap:      { icon: VideoOff, iconColor: "text-red-400", lineColor: "bg-red-500" },
  predicted: { icon: Brain, iconColor: "text-yellow-400", lineColor: "bg-yellow-500" },
};

const SAMPLE_EVIDENCE = `Witness states the victim left the building at 10:15 PM via the East exit. 
CCTV Camera A-12 confirms this. Between 10:20 PM and 10:45 PM, all CCTV feeds in the area show a blackout with no footage recorded. 
Victim was found unresponsive in the alleyway at 11:00 PM by a passerby. 
Mobile phone last pinged a cell tower near the building at 10:18 PM. 
No defensive wounds found on hands. Blood alcohol content: 0.02%.`;

export function TimelineReconstructionPage() {
  const [evidence, setEvidence] = useState(SAMPLE_EVIDENCE);
  const [isLoading, setIsLoading] = useState(false);
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    const rawData = localStorage.getItem("rawEvidenceText");
    if (rawData) {
      setEvidence(rawData);
    }

    // Check for cached timeline data
    const storedTimeline = localStorage.getItem("timelineData");
    if (storedTimeline) {
      try {
        setTimelineData(JSON.parse(storedTimeline));
      } catch (e) {
        console.error("Error parsing stored timeline data", e);
      }
    }
  }, []);

  const handleReconstruct = async () => {
    setIsLoading(true);
    setError(null);
    setTimelineData(null);
    setExpanded(null);

    try {
      // Use the unified endpoint to populate everything if possible
      const res = await fetch("http://127.0.0.1:5000/analyze-full", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ evidence }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Analysis failed");
      } else {
        // Store all parts
        if (data.timeline) {
          setTimelineData(data.timeline);
          localStorage.setItem("timelineData", JSON.stringify(data.timeline));
        }
        
        // Populate other parts for other pages
        if (data.report) localStorage.setItem("caseReportData", JSON.stringify(data.report));
        if (data.autopsy) localStorage.setItem("autopsyData", JSON.stringify(data.autopsy));
        if (data.risk) localStorage.setItem("riskData", JSON.stringify(data.risk));
        if (data.anomalies) localStorage.setItem("anomalyData", JSON.stringify(data.anomalies));
        if (data.patterns) localStorage.setItem("patternData", JSON.stringify(data.patterns));
        if (data.insights) localStorage.setItem("insightsData", JSON.stringify(data.insights));
        if (data.heatmap) localStorage.setItem("heatmapData", JSON.stringify(data.heatmap));
        if (data.correlation) localStorage.setItem("correlationData", JSON.stringify(data.correlation));
      }
    } catch (err) {
      setError("Could not connect to the backend. Make sure Python server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const counts = timelineData
    ? {
        critical: timelineData.events.filter((e) => e.severity === "critical").length,
        warning: timelineData.events.filter((e) => e.severity === "warning").length,
        standard: timelineData.events.filter((e) => e.severity === "standard").length,
      }
    : null;

  // Group concurrent events for bracket rendering
  const getConcurrentGroups = (events: TimelineEvent[]) => {
    const groups: Record<number, number[]> = {};
    events.forEach((e, i) => {
      if (e.concurrent_group !== null && e.concurrent_group !== undefined) {
        if (!groups[e.concurrent_group]) groups[e.concurrent_group] = [];
        groups[e.concurrent_group].push(i);
      }
    });
    return groups;
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-red-500" />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">Timeline Reconstruction</h1>
              <p className="text-sm text-gray-400">AI-powered forensic event sequencing · Case INV-2026-4782</p>
            </div>
          </div>
          {timelineData && (
            <button className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-gray-700 hover:bg-white/10 text-gray-300 rounded-lg transition-colors text-sm">
              <Download className="w-4 h-4" /> Export
            </button>
          )}
        </div>

        {/* Evidence Input */}
        <div className="bg-black/40 border border-gray-700 rounded-xl p-5 space-y-3">
          <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" /> Paste Evidence / Witness Report
          </label>
          <textarea
            rows={5}
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="Paste witness statements, CCTV logs, autopsy notes, GPS data…"
            className="w-full bg-black/60 border border-gray-700 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-red-500/60 transition-colors"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600">
              The AI will extract timestamps, detect gaps, and predict hidden events.
            </p>
            <button
              onClick={handleReconstruct}
              disabled={isLoading || !evidence.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-red-500/20"
            >
              {isLoading ? (
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Reconstructing...</span>
                  </div>
                  <span className="text-[10px] opacity-70 mt-1 font-normal animate-pulse">Large datasets may take 60s+</span>
                </div>
              ) : (
                <><SendHorizonal className="w-4 h-4" /> Reconstruct Timeline</>
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 text-red-400 text-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" /> {error}
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="w-14 h-14 rounded-full bg-gray-800 flex-shrink-0" />
                <div className="flex-1 h-20 bg-gray-800/60 rounded-2xl" />
              </div>
            ))}
          </div>
        )}

        {/* Timeline */}
        {timelineData && (
          <>
            {/* AI Summary */}
            <div className="bg-gradient-to-r from-[#0d1117] to-[#040f26] border border-blue-900/50 rounded-xl p-5 flex items-start gap-3">
              <Brain className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-blue-400 mb-1">AI Forensic Summary</p>
                <p className="text-sm text-gray-300 leading-relaxed">{timelineData.summary}</p>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 text-xs text-gray-400 px-2">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Observed</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" /> AI Predicted</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> Critical / Gap</span>
            </div>

            {/* Events */}
            <div className="relative">
              {/* Central dashed line */}
              <div className="absolute left-[27px] top-0 bottom-0 w-0.5 border-l-2 border-dashed border-gray-700 pointer-events-none" />

              <div className="space-y-5 relative">
                {timelineData.events.map((event, idx) => {
                  const isExpanded = expanded === idx;
                  const cfg = severityConfig[event.severity] ?? severityConfig.standard;
                  const iconCfg = typeIconConfig[event.type] ?? typeIconConfig.observed;
                  const Icon = iconCfg.icon;
                  const isLast = idx === timelineData.events.length - 1;

                  return (
                    <div key={idx} className="relative flex gap-6 items-start">
                      {/* Icon */}
                      <div className="relative z-10 flex-shrink-0 mt-1">
                        <div className={`w-14 h-14 rounded-full border-2 ${cfg.borderColor} bg-gray-950 flex items-center justify-center shadow-lg`}>
                          <Icon className={`w-6 h-6 ${iconCfg.iconColor}`} />
                        </div>
                        {/* Colored stem */}
                        {!isLast && (
                          <div
                            className={`absolute left-1/2 -translate-x-1/2 top-14 w-0.5 ${iconCfg.lineColor}`}
                            style={{ height: "28px" }}
                          />
                        )}
                      </div>

                      {/* Card */}
                      <div
                        className="flex-1 bg-[#1a1a2e]/80 border border-gray-700/60 rounded-2xl overflow-hidden cursor-pointer hover:border-gray-500 transition-all"
                        onClick={() => setExpanded(isExpanded ? null : idx)}
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              {/* Badges */}
                              <div className="flex items-center gap-2 mb-2">
                                {event.type === "predicted" && (
                                  <span className="inline-flex items-center gap-1 text-[10px] text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-2 py-0.5">
                                    <Zap className="w-3 h-3" /> AI Predicted
                                  </span>
                                )}
                                {event.type === "gap" && (
                                  <span className="inline-flex items-center gap-1 text-[10px] text-red-400 bg-red-500/10 border border-red-500/30 rounded-full px-2 py-0.5">
                                    <AlertTriangle className="w-3 h-3" /> Suspicious Gap
                                  </span>
                                )}
                                {event.type === "observed" && (
                                  <span className="inline-flex items-center gap-1 text-[10px] text-green-400 bg-green-500/10 border border-green-500/30 rounded-full px-2 py-0.5">
                                    <CheckCircle className="w-3 h-3" /> Observed
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-400 text-sm font-medium mb-1">{event.time}</p>
                              <h3 className="text-white text-lg font-bold leading-tight">{event.title}</h3>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className={`text-xs font-bold border ${cfg.borderColor} ${cfg.textColor} px-3 py-1.5 rounded-full`}>
                                {cfg.label}
                              </span>
                              {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                            </div>
                          </div>

                          {!isExpanded && (
                            <p className="text-xs text-gray-600 mt-2 text-right">Click to expand</p>
                          )}
                        </div>

                        {/* Expanded */}
                        {isExpanded && (
                          <div className="px-4 pb-4 space-y-3 border-t border-gray-700/40 pt-3">
                            <p className="text-sm text-gray-300 leading-relaxed">{event.description}</p>
                            <div className={`${cfg.barBg} rounded-lg px-3 py-2`}>
                              <span className={`text-xs font-bold ${cfg.textColor}`}>
                                CONFIDENCE: {event.confidence}%
                              </span>
                              <div className="mt-1.5 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${cfg.barFill} transition-all duration-700`}
                                  style={{ width: `${event.confidence}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Predictions */}
            {timelineData.ai_predictions && timelineData.ai_predictions.length > 0 && (
              <div className="bg-gradient-to-r from-[#0d1117] to-[#1a0f26] border border-purple-900/50 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-bold text-purple-400">AI Predictions</h3>
                </div>
                {timelineData.ai_predictions.map((pred, i) => (
                  <div key={i} className="bg-black/30 border border-purple-800/30 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-semibold text-white">{pred.title}</h4>
                      <span className="text-xs font-bold text-purple-400 border border-purple-500/40 rounded-full px-2 py-0.5">{pred.confidence}%</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed mb-2">{pred.description}</p>
                    <p className="text-[10px] text-gray-500 italic">Basis: {pred.basis}</p>
                  </div>
                ))}
              </div>
            )}

            {/* AI Insights */}
            {timelineData.ai_insights && timelineData.ai_insights.length > 0 && (
              <div className="bg-gradient-to-r from-[#0d1117] to-[#0f1a12] border border-emerald-900/50 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-emerald-400">AI Investigative Insights</h3>
                </div>
                {timelineData.ai_insights.map((insight, i) => {
                  const colors = {
                    critical: { border: "border-red-500/30", bg: "bg-red-500/10", text: "text-red-400" },
                    warning: { border: "border-yellow-500/30", bg: "bg-yellow-500/10", text: "text-yellow-400" },
                    info: { border: "border-blue-500/30", bg: "bg-blue-500/10", text: "text-blue-400" },
                  }[insight.type] || { border: "border-gray-700", bg: "bg-gray-800", text: "text-gray-400" };
                  return (
                    <div key={i} className={`${colors.bg} border ${colors.border} rounded-lg p-4`}>
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className={`w-4 h-4 ${colors.text}`} />
                        <h4 className={`text-sm font-semibold ${colors.text}`}>{insight.title}</h4>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">{insight.description}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Footer summary */}
            <div className="bg-black/40 border border-gray-800 rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span><strong className="text-white">{timelineData.events.length}</strong> total events</span>
                <span><strong className="text-red-400">{counts?.critical}</strong> critical</span>
                <span><strong className="text-yellow-400">{counts?.warning}</strong> warning</span>
                <span><strong className="text-blue-400">{counts?.standard}</strong> standard</span>
              </div>
              <div className="text-xs text-gray-600">
                Reconstructed by Qwen 2.5 · Forensic AI Engine
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
