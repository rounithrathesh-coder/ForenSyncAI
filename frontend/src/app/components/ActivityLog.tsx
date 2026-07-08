import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export function ActivityLog() {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const evidenceText = localStorage.getItem("rawEvidenceText");
    if (!evidenceText) {
      setActivities([{ time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), user: "System", action: "Awaiting evidence upload..." }]);
      return;
    }

    const now = new Date();
    const time1 = new Date(now.getTime() - 2 * 60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const time2 = new Date(now.getTime() - 1 * 60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const time3 = new Date(now.getTime() - 30000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const time4 = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    const wordCount = evidenceText.split(/\s+/).length;

    setActivities([
      { time: time4, user: "System AI", action: `Generated forensics correlation matrix` },
      { time: time3, user: "System AI", action: `Analyzed ${wordCount} words of case evidence` },
      { time: time2, user: "Agent ronnie", action: `Initiated AI Forensic Pipeline` },
      { time: time1, user: "Agent ronnie", action: `Uploaded new evidence file` },
    ]);
  }, []);

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-gray-700 rounded-xl p-6 h-full">
      <h2 className="text-lg text-white font-semibold mb-6">Recent Investigation Activity</h2>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-start gap-3 pb-4 border-b border-gray-800 last:border-0 last:pb-0"
          >
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-500 font-mono">{activity.time}</span>
                <span className="text-xs text-blue-400">{activity.user}</span>
              </div>
              <p className="text-sm text-gray-300">{activity.action}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
