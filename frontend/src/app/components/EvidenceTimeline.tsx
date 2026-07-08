import { useState, useEffect } from "react";
import { Camera, Smartphone, MapPin, Thermometer, Phone, Loader2, AlertTriangle, Info, Clock, Activity } from "lucide-react";

export function EvidenceTimeline() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedTimeline = localStorage.getItem("timelineData");
    if (storedTimeline) {
      try {
        const data = JSON.parse(storedTimeline);
        if (data && data.events) {
          setEvents(data.events);
        }
      } catch (e) {
        console.error("Error parsing stored timeline data", e);
      }
    }
  }, []);

  // Map backend "type" or "title" to Icons
  const getIcon = (type: string, title: string) => {
    const str = `${type} ${title}`.toLowerCase();
    if (str.includes("gps") || str.includes("location") || str.includes("movement")) return MapPin;
    if (str.includes("cctv") || str.includes("camera") || str.includes("video")) return Camera;
    if (str.includes("phone") || str.includes("call") || str.includes("metadata") || str.includes("device")) return Smartphone;
    if (str.includes("environmental") || str.includes("temp") || str.includes("blood")) return Thermometer;
    if (str.includes("gap") || str.includes("missing")) return AlertTriangle;
    return Activity;
  };

  // Ensure we have some default events if nothing is returned or loading
  const displayEvents = events.length > 0 ? events : [
    {
      time: "Pending Analysis",
      title: "Waiting for evidence",
      description: "Upload and analyze a file in Evidence Upload to generate timeline.",
      severity: "standard"
    }
  ];

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6 h-full min-h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg text-white font-semibold">Evidence Timeline</h2>
        {isLoading && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-red-500" />

        {/* Events */}
        <div className="space-y-6">
          {displayEvents.map((event, index) => {
            const isAlert = event.severity === "critical" || event.severity === "warning" || event.type === "gap";
            const Icon = getIcon(event.type || "", event.title || "");
            
            return (
              <div key={index} className="relative flex items-start gap-4 group">
                {/* Icon */}
                <div
                  className={`relative z-10 w-12 h-12 bg-gradient-to-br shrink-0 ${
                    isAlert ? "from-red-500 to-orange-500" : "from-blue-500 to-purple-500"
                  } rounded-full flex items-center justify-center shadow-lg ${
                    isAlert ? "shadow-red-500/50 animate-pulse" : "shadow-blue-500/30"
                  }`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 bg-white/5 border border-gray-700 rounded-lg p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">{event.time}</p>
                      <h3 className="text-sm text-white font-semibold">{event.title}</h3>
                    </div>
                    {isAlert && (
                      <span className="px-2 py-1 bg-red-500/20 border border-red-500/50 rounded text-xs text-red-400">
                        ANOMALY
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-300">{event.description}</p>
                  
                  {event.confidence && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${event.confidence}%` }} />
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono">{event.confidence}% CONFIDENCE</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
