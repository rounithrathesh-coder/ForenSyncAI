import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export function RiskScorePanel() {
  const [score, setScore] = useState(0);
  const [indicators, setIndicators] = useState<any[]>([
    { label: "Awaiting Data", level: 0, color: "yellow" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedRisk = localStorage.getItem("riskData");
    if (storedRisk) {
      try {
        const data = JSON.parse(storedRisk);
        if (data) {
          setScore(data.overall_risk_score || 0);
          setIndicators(data.indicators || []);
        }
      } catch (e) {
        console.error("Error parsing stored risk data", e);
      }
    }
  }, []);

  const circumference = 2 * Math.PI * 70;
  const progress = (score / 100) * circumference;

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-red-500/30 rounded-xl p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg text-white font-semibold">Threat Assessment</h2>
        {isLoading && <Loader2 className="w-5 h-5 text-red-500 animate-spin" />}
      </div>

      {/* Circular Gauge */}
      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full -rotate-90">
            {/* Background circle */}
            <circle
              cx="96"
              cy="96"
              r="70"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="96"
              cy="96"
              r="70"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-5xl font-bold text-white mb-1">{score}%</p>
            <p className="text-sm text-red-400 font-semibold">{score > 75 ? "HIGH RISK" : score > 40 ? "MED RISK" : "LOW RISK"}</p>
          </div>
        </div>

        {/* Risk Indicators */}
        <div className="w-full mt-8 space-y-3">
          {indicators.map((indicator, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">{indicator.label}</span>
                <span className="text-white">{indicator.level}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${
                    indicator.color === "red"
                      ? "from-red-500 to-red-600"
                      : indicator.color === "orange"
                      ? "from-orange-500 to-orange-600"
                      : "from-yellow-500 to-yellow-600"
                  }`}
                  style={{ width: `${indicator.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
