import { useState, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";

interface HeatmapPoint {
  x: number;
  y: number;
  severity: "critical" | "warning" | "info";
  label: string;
}

export function CaseHeatmap() {
  const [points, setPoints] = useState<HeatmapPoint[]>([]);
  const [summary, setSummary] = useState("Geographic heat analysis");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedHeatmap = localStorage.getItem("heatmapData");
    if (storedHeatmap) {
      try {
        const data = JSON.parse(storedHeatmap);
        if (data) {
          setPoints(data.points || []);
          setSummary(data.summary || "Geospatial analysis complete");
        }
      } catch (e) {
        console.error("Error parsing stored heatmap data", e);
      }
    }
  }, []);

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-red-500/30 rounded-xl p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg text-white font-semibold">Crime Activity Heatmap</h2>
        {isLoading && <Loader2 className="w-5 h-5 text-red-500 animate-spin" />}
      </div>

      <div className="relative h-80 bg-gradient-to-br from-gray-900 to-black rounded-lg border border-gray-800 overflow-hidden">
        {/* Map placeholder with hotspots */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-sm text-gray-500 px-4">{summary}</p>
          </div>
        </div>

        {points.map((marker, i) => (
          <div key={`blur-${i}`}>
            <div
              className={`absolute w-24 h-24 rounded-full blur-2xl animate-pulse ${
                marker.severity === "critical"
                  ? "bg-red-500/30"
                  : marker.severity === "warning"
                  ? "bg-orange-500/20"
                  : "bg-blue-500/20"
              }`}
              style={{
                top: `${marker.y}%`,
                left: `${marker.x}%`,
                transform: "translate(-50%, -50%)"
              }}
            />
          </div>
        ))}

        {/* Location markers */}
        {points.map((marker, i) => (
          <div
            key={`marker-${i}`}
            className="absolute z-10"
            style={{ top: `${marker.y}%`, left: `${marker.x}%`, transform: "translate(-50%, -50%)" }}
          >
            <div
              className={`w-4 h-4 ${
                marker.severity === "critical"
                  ? "bg-red-500"
                  : marker.severity === "warning"
                  ? "bg-orange-500"
                  : "bg-blue-500"
              } rounded-full border-2 border-white shadow-lg ${
                marker.severity === "critical" ? "animate-pulse" : ""
              }`}
            />
            <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <p className="text-xs text-white bg-black/80 px-2 py-1 rounded">{marker.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-gray-400">High Activity Zone</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full" />
          <span className="text-gray-400">Medium Activity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span className="text-gray-400">Low Activity</span>
        </div>
      </div>
    </div>
  );
}
