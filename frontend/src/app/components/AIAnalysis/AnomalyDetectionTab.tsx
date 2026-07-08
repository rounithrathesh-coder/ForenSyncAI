import React from "react";
import { Search, Info, AlertCircle, Building2, Car, User, Clock, Download, RefreshCw } from "lucide-react";

interface Props {
  data: any;
}

export function AnomalyDetectionTab({ data }: Props) {
  // Use dynamic data or fallback to defaults matching the mockup if no data is provided
  const biggestLoophole = data?.biggest_loophole || "Unaccounted phone inactivity during established crime window contradicts claim of constant calls during time period.";
  
  const defaultSources = [
    { name: "Witness Statement - B. Carter", status: "Ready", type: "success" },
    { name: "Alibi C. Davis GPS", status: "Analysis Complete", type: "success" },
    { name: "CDR logs - 120+ entries", status: "Anomaly Found", type: "error" },
    { name: "CCTV logs - 120+ entries", status: "Anomaly Found", type: "error" },
    { name: "Bank spikes - 3", status: "High Variant", type: "error" }
  ];
  const sourcesList = data?.data_sources || defaultSources;

  const defaultTimeline = [
    { time: "21:00", label: "Call made", type: "normal" },
    { time: "21:20", label: "CRITICAL: Phone Inactivity Gap - 45 min", type: "critical" },
    { time: "22:05", label: "Call made", type: "normal" },
    { time: "22:15", label: "Location lock", type: "normal" },
    { time: "22:30", label: "HIGH: Location Outlier C. Davis", type: "high" },
    { time: "23:00", label: "CCTV frame", type: "normal" },
    { time: "23:45", label: "Variant Call to Prepaid Number", type: "variant" },
    { time: "01:00", label: "End window", type: "normal" }
  ];
  const timeline = data?.timeline_anomalies || defaultTimeline;

  const defaultReports = [
    {
      id: "AD-001",
      title: "Timeline Contradiction - Phone Inactivity",
      sources: "Call Logs vs. Alibi",
      description: "Unaccounted phone inactivity during established crime window. Contradicts claim of constant calls during time period.",
      severity: "CRITICAL",
      significance: 94,
      icon: <Clock className="w-5 h-5 text-red-500" />
    },
    {
      id: "AD-002",
      title: "Variant Financial Transaction",
      sources: "Bank Statements",
      description: "Transfer of $15,000 to an unverified account, 6 hours post-time-of-death, from account with no history of high-value transfers.",
      severity: "HIGH",
      significance: 78,
      icon: <Building2 className="w-5 h-5 text-orange-500" />
    },
    {
      id: "AD-003",
      title: "Vehicle Path Outlier",
      sources: "Vehicle GPS vs. Location Statements",
      description: "Vehicle path deviates 1.2 km from stated alibi route and passes within 200m of key suspect's home at crucial time.",
      severity: "HIGH",
      significance: 76,
      icon: <Car className="w-5 h-5 text-orange-500" />
    },
    {
      id: "AD-004",
      title: "Contradictory Biometric Response",
      sources: "Biometric Interview Log",
      description: "Elevated pulse and breathing variance during discussion of specific call to unknown number.",
      severity: "MEDIUM",
      significance: 65,
      icon: <User className="w-5 h-5 text-yellow-500" />
    }
  ];
  
  // Try to map icons dynamically if data comes from AI
  const reports = data?.anomaly_reports?.map((r: any) => ({
    ...r,
    icon: r.severity === "CRITICAL" ? <AlertCircle className="w-5 h-5 text-red-500" /> : 
          r.severity === "HIGH" ? <Search className="w-5 h-5 text-orange-500" /> : 
          <Info className="w-5 h-5 text-yellow-500" />
  })) || defaultReports;

  // Source Type Chips
  const sourceChips = [
    "Witness statements", "Alibi timelines", "CCTV Logs", "Call Detail Records (CDR)", 
    "Financial Data", "Vehicle GPS", "Report: E00W", "Vehicle ANPR (tags)", "Biometric analytics", "Other..."
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-gray-300">
      
      {/* Left Column: Data Sources */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-[#0b0c10] border border-gray-800 rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4">Analyzed Data Sources</h2>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {sourceChips.map((chip, idx) => (
              <span key={idx} className="px-3 py-1.5 bg-white/5 border border-gray-700 rounded-full text-xs hover:bg-white/10 cursor-pointer transition">
                {chip}
              </span>
            ))}
          </div>

          <div className="space-y-3">
            {sourcesList.map((source: any, idx: number) => {
              const isError = source.status.toLowerCase().includes("anomaly") || source.status.toLowerCase().includes("high");
              const bgClass = isError ? "bg-red-500/5 border-red-900/50" : "bg-green-500/5 border-green-900/50";
              const textClass = isError ? "text-red-400" : "text-green-400";
              const Icon = isError ? FileTextError : Info;
              
              return (
                <div key={idx} className={`border rounded-xl p-4 flex justify-between items-center ${bgClass}`}>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${textClass}`} />
                    <div>
                      <p className="text-sm font-medium text-white">{source.name || source.title}</p>
                      <p className={`text-xs mt-0.5 ${textClass}`}>{source.status}</p>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Timeline & Reports */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Top: Timeline Visualization */}
        <div className="bg-[#0b0c10] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold">Timeline of Identified Data Anomalies</h2>
          <p className="text-xs text-gray-500 mb-8">Events of the crime window (21:00-01:00) timer view</p>

          <div className="relative mt-8 mb-4 px-4">
            {/* Base Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-700 -translate-y-1/2"></div>
            
            <div className="flex justify-between relative">
              {timeline.map((point: any, idx: number) => {
                const isCrit = point.label.includes("CRITICAL");
                const isHigh = point.label.includes("HIGH") || point.label.includes("Variant");
                
                let dotClass = "w-3 h-3 bg-white";
                let labelClass = "text-gray-400";
                
                if (isCrit) {
                  dotClass = "w-5 h-5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]";
                  labelClass = "text-red-400 font-bold bg-red-500/10 border border-red-500/30 px-2 py-1 rounded text-[10px]";
                } else if (isHigh) {
                  dotClass = "w-4 h-4 bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]";
                  labelClass = "text-orange-400 font-bold bg-orange-500/10 border border-orange-500/30 px-2 py-1 rounded text-[10px]";
                }

                return (
                  <div key={idx} className="flex flex-col items-center justify-center relative group z-10">
                    <div className="absolute -top-8 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <span className={labelClass}>{point.label}</span>
                    </div>
                    <div className={`${dotClass} rounded-full border-2 border-[#0b0c10] mb-2`} />
                    <span className="text-[10px] text-gray-500">{point.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom: Specific Anomaly Reports */}
        <div className="bg-[#0b0c10] border border-gray-800 rounded-2xl p-6 flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white font-semibold">Specific Anomaly Reports</h2>
            <div className="flex items-center gap-3">
              <button className="text-xs text-gray-400 flex items-center gap-1 hover:text-white transition"><RefreshCw className="w-3 h-3"/> Re-run analysis</button>
              <button className="text-xs border border-gray-700 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-white/5 transition"><Download className="w-3 h-3"/> Export</button>
            </div>
          </div>

          <div className="flex gap-4 mb-4 border-b border-gray-800 pb-4">
            <button className="px-3 py-1 bg-white/5 rounded text-xs border border-gray-700">Filters</button>
            <div className="flex-1 flex justify-end gap-2">
              <span className="text-xs text-gray-500 self-center mr-2">Sort by:</span>
              <select className="bg-transparent border border-gray-700 text-xs rounded px-2 py-1 outline-none text-gray-300">
                <option>By Significance</option>
              </select>
              <select className="bg-transparent border border-gray-700 text-xs rounded px-2 py-1 outline-none text-gray-300">
                <option>Date</option>
              </select>
              <select className="bg-transparent border border-gray-700 text-xs rounded px-2 py-1 outline-none text-gray-300">
                <option>Data Type</option>
              </select>
            </div>
          </div>

          {/* Biggest Loophole Summary */}
          {data?.biggest_loophole && (
             <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
               <h3 className="text-sm font-bold text-red-400 mb-1 flex items-center gap-2"><AlertCircle className="w-4 h-4"/> Critical Logical Loophole Detected</h3>
               <p className="text-xs text-red-200/80">{data.biggest_loophole}</p>
             </div>
          )}

          {/* Reports List */}
          <div className="space-y-3 overflow-y-auto pr-2 flex-1 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
            {reports.map((report: any, idx: number) => {
              const isCrit = report.severity === "CRITICAL";
              const isHigh = report.severity === "HIGH";
              const severityColor = isCrit ? "text-red-500" : isHigh ? "text-orange-500" : "text-yellow-500";
              const borderColor = isCrit ? "border-red-900/50 bg-red-500/5" : isHigh ? "border-orange-900/50 bg-orange-500/5" : "border-yellow-900/50 bg-yellow-500/5";

              return (
                <div key={idx} className={`border rounded-xl p-4 flex gap-4 ${borderColor}`}>
                  <div className={`p-2 rounded-lg bg-black/40 border border-white/5 h-fit ${severityColor}`}>
                    {report.icon || <AlertCircle className="w-5 h-5" />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-mono">{report.id}</span>
                        <h3 className="text-sm font-bold text-white">{report.title}</h3>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${severityColor}`}>{report.significance}%</div>
                        <div className="text-[10px] text-gray-500">Risk Significance</div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-400 mb-2">Sources: <span className="text-gray-300">{report.sources}</span></p>
                    <p className="text-sm text-gray-300 leading-relaxed">{report.description}</p>
                    
                    {/* Severity Bar */}
                    <div className="w-full bg-black/50 h-1 mt-3 rounded-full overflow-hidden">
                      <div className={`h-full ${isCrit ? 'bg-red-500' : isHigh ? 'bg-orange-500' : 'bg-yellow-500'}`} style={{ width: `${report.significance}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

function FileTextError(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <line x1="12" y1="22" x2="12.01" y2="22" />
    </svg>
  );
}

function ChevronDown(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
