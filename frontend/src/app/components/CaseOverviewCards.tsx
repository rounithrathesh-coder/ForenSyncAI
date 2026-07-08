import { useState, useEffect } from "react";
import { FileText, AlertTriangle, Activity, Clock, Link2, Loader2 } from "lucide-react";

export function CaseOverviewCards() {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    files: "1",
    riskScore: "PENDING",
    investigationState: "ONGOING",
    timeOfDeath: "PENDING",
    todDate: "Waiting for evidence",
    todReason: "",
    correlatedEvents: "0",
    anomalies: "0 anomalies"
  });

  useEffect(() => {
    const fetchStats = async () => {
      // 1. Check cache
      const storedAutopsy = localStorage.getItem("autopsyData");
      if (storedAutopsy) {
        try {
          const rawText = JSON.parse(storedAutopsy);
          const confidence = rawText.confidence || 92;
          const tod = rawText.time_of_death || "Unknown";
          const todDate = rawText.time_of_death_date || "Unknown Date";
          const anomalyCount = (rawText.suspicious_indicators || []).length;
          const patternsCount = (rawText.injury_patterns || []).length + anomalyCount;
          const todReason = rawText.time_of_death_reason || "";

          setStats({
            files: "1",
            riskScore: `${confidence}%`,
            investigationState: "ACTIVE AI",
            timeOfDeath: tod,
            todDate: todDate,
            todReason: todReason,
            correlatedEvents: `${patternsCount}`,
            anomalies: `${anomalyCount} anomalies`
          });
          return;
        } catch (e) { console.error(e); }
      }

      const evidenceText = localStorage.getItem("rawEvidenceText");
      if (!evidenceText) return;

      setIsLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:5000/analyze-full", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ evidence: evidenceText })
        });
        
        const data = await response.json();
        if (data.error) throw new Error(data.error);

        const rawText = data.autopsy;
        if (rawText) {
          const confidence = rawText.confidence || 92;
          const tod = rawText.time_of_death || "Unknown";
          const todDate = rawText.time_of_death_date || "Unknown Date";
          const anomalyCount = (rawText.suspicious_indicators || []).length;
          const patternsCount = (rawText.injury_patterns || []).length + anomalyCount;
          const todReason = rawText.time_of_death_reason || "";

          setStats({
            files: "1",
            riskScore: `${confidence}%`,
            investigationState: "ACTIVE AI",
            timeOfDeath: tod,
            todDate: todDate,
            todReason: todReason,
            correlatedEvents: `${patternsCount}`,
            anomalies: `${anomalyCount} anomalies`
          });
          localStorage.setItem("autopsyData", JSON.stringify(rawText));
        }
      } catch (err) {
        console.error("Failed to fetch overview stats:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/50 shadow-blue-500/20",
    red: "from-red-500/20 to-red-600/20 border-red-500/50 shadow-red-500/20",
    orange: "from-orange-500/20 to-orange-600/20 border-orange-500/50 shadow-orange-500/20",
    purple: "from-purple-500/20 to-purple-600/20 border-purple-500/50 shadow-purple-500/20",
    cyan: "from-cyan-500/20 to-cyan-600/20 border-cyan-500/50 shadow-cyan-500/20",
  };

  const cards = [
    {
      icon: FileText,
      label: "Total Evidence Files",
      value: stats.files,
      color: "blue",
      trend: "Uploaded document",
    },
    {
      icon: AlertTriangle,
      label: "AI Risk Score",
      value: stats.riskScore,
      color: "red",
      trend: stats.riskScore !== "PENDING" ? "HIGH ALERT" : "Awaiting scan",
    },
    {
      icon: Activity,
      label: "Active Investigation",
      value: stats.investigationState,
      color: "orange",
      trend: "Automated Tracking",
    },
    {
      icon: Clock,
      label: "Estimated Time of Death",
      value: stats.timeOfDeath,
      color: "purple",
      trend: stats.todDate,
      tooltip: stats.todReason,
    },
    {
      icon: Link2,
      label: "Correlated Events",
      value: stats.correlatedEvents,
      color: "cyan",
      trend: stats.anomalies,
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-4 relative">
      {isLoading && (
        <div className="absolute -top-8 right-0 flex items-center gap-2 text-red-500 text-xs">
          <Loader2 className="w-4 h-4 animate-spin" />
          Updating overview...
        </div>
      )}
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-gradient-to-br ${
            colorClasses[card.color as keyof typeof colorClasses]
          } backdrop-blur-sm border rounded-xl p-4 shadow-lg hover:scale-105 transition-transform duration-300 relative group`}
        >
          <card.icon className="w-8 h-8 text-white/80 mb-3" />
          <p className="text-xs text-gray-400 mb-1">{card.label}</p>
          <p className="text-xl md:text-2xl font-bold text-white mb-1 truncate">{card.value}</p>
          <p className="text-xs text-gray-300 truncate">{card.trend}</p>
          
          {/* Tooltip for Time of Death Reason */}
          {card.tooltip && (
            <div className="absolute top-full mt-2 left-0 w-64 bg-black/90 backdrop-blur-xl border border-purple-500/50 rounded-lg p-3 text-xs text-gray-300 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <span className="block text-purple-400 font-bold mb-1">AI Prediction Reason:</span>
              {card.tooltip}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
