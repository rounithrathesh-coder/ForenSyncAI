import { useState, useEffect } from "react";
import { AlertTriangle, Info, TrendingUp, Loader2 } from "lucide-react";

export function AIInsightsPanel() {
  const [insights, setInsights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedInsights = localStorage.getItem("insightsData");
    if (storedInsights) {
      try {
        const data = JSON.parse(storedInsights);
        if (data && Array.isArray(data)) {
          setInsights(data);
          return;
        }
      } catch (e) {
        console.error("Error parsing stored insights data", e);
      }
    }
    setInsights([
      { type: "info", title: "Awaiting Data", description: "Upload evidence to generate insights." }
    ]);
  }, []);

  const getIcon = (type: string) => {
    if (type === "critical") return AlertTriangle;
    if (type === "warning") return Info;
    return TrendingUp;
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-orange-500/30 rounded-xl p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg text-white font-semibold">AI-Generated Insights</h2>
        {isLoading && <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />}
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => {
          const Icon = getIcon(insight.type);
          return (
            <div
              key={index}
              className={`flex items-start gap-3 p-4 rounded-lg border ${
                insight.type === "critical"
                  ? "bg-red-500/10 border-red-500/30"
                  : insight.type === "warning"
                  ? "bg-orange-500/10 border-orange-500/30"
                  : "bg-blue-500/10 border-blue-500/30"
              } hover:bg-white/5 transition-colors`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  insight.type === "critical"
                    ? "bg-red-500/20"
                    : insight.type === "warning"
                    ? "bg-orange-500/20"
                    : "bg-blue-500/20"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    insight.type === "critical"
                      ? "text-red-400"
                      : insight.type === "warning"
                      ? "text-orange-400"
                      : "text-blue-400"
                  }`}
                />
              </div>
              <div className="flex-1">
                <h3 className={`text-sm font-semibold mb-1 ${
                  insight.type === "critical" ? "text-red-400" : 
                  insight.type === "warning" ? "text-orange-400" : "text-blue-400"
                }`}>
                  {insight.title}
                </h3>
                <p className="text-sm text-gray-300">{insight.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
