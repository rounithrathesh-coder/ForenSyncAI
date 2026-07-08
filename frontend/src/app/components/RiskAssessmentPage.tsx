import React, { useState, useEffect } from "react";
import { AlertTriangle, MapPin, Activity, ShieldAlert, Crosshair, ChevronDown, User, Loader2 } from "lucide-react";

export function RiskAssessmentPage() {
  const [riskData, setRiskData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [evidenceText, setEvidenceText] = useState("");

  const [hoveredInjury, setHoveredInjury] = useState<any>(null);

  const fetchRisk = async (textToUse: string) => {
    setIsLoading(true);
    try {
      // Use unified endpoint
      const res = await fetch("http://127.0.0.1:5000/analyze-full", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ evidence: textToUse })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");

      if (data.risk) {
        setRiskData(data.risk);
        localStorage.setItem("riskData", JSON.stringify(data.risk));
      }
      
      // Store other parts for other pages
      if (data.report) localStorage.setItem("caseReportData", JSON.stringify(data.report));
      if (data.autopsy) localStorage.setItem("autopsyData", JSON.stringify(data.autopsy));
      if (data.timeline) localStorage.setItem("timelineData", JSON.stringify(data.timeline));
      if (data.anomalies) localStorage.setItem("anomalyData", JSON.stringify(data.anomalies));
      if (data.patterns) localStorage.setItem("patternData", JSON.stringify(data.patterns));
      if (data.insights) localStorage.setItem("insightsData", JSON.stringify(data.insights));
      if (data.heatmap) localStorage.setItem("heatmapData", JSON.stringify(data.heatmap));
      if (data.correlation) localStorage.setItem("correlationData", JSON.stringify(data.correlation));

    } catch (err) {
      console.error("Failed to fetch risk assessment data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const text = localStorage.getItem("rawEvidenceText") || "";
    setEvidenceText(text);

    // Check for cached risk data
    const storedRisk = localStorage.getItem("riskData");
    if (storedRisk) {
      try {
        setRiskData(JSON.parse(storedRisk));
      } catch (e) {
        console.error("Error parsing stored risk data", e);
        if (text) fetchRisk(text);
      }
    } else if (text) {
      fetchRisk(text);
    }
  }, []);

  const overallScore = riskData?.overall_risk_score || 0;
  const circumference = 2 * Math.PI * 80;
  const progress = (overallScore / 100) * circumference;

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-black/50 text-gray-300">
      <div className="max-w-[1800px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white tracking-wide">Risk Assessment</h1>
            <span className="text-gray-500 text-xl font-light">|</span>
            <span className="text-gray-400 text-lg">Case INV-2026-4782</span>
            {isLoading && <Loader2 className="w-5 h-5 text-red-500 animate-spin ml-2" />}
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg text-sm font-semibold hover:bg-red-500/20 transition">
              PRIORITY REVIEW
            </button>
            <button onClick={() => fetchRisk(evidenceText)} className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg text-sm flex items-center gap-2 hover:bg-white/5 transition">
              <Activity className="w-4 h-4" /> REFRESH
            </button>
            <button className="px-4 py-2 bg-white/10 border border-gray-600 text-white rounded-lg text-sm hover:bg-white/20 transition">
              EXPORT REPORT
            </button>
          </div>
        </div>

        {!evidenceText && (
          <div className="text-center py-20 text-gray-500">
            <ShieldAlert className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Upload evidence to generate a full risk assessment profile.</p>
          </div>
        )}

        {evidenceText && (
          <div className="grid grid-cols-12 gap-6">
            
            {/* Left Column: Overall Risk Level */}
            <div className="col-span-3 space-y-6">
              <div className="bg-[#12141c] border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
                <h2 className="text-white font-semibold mb-6 flex items-center gap-2">
                  Overall Case Risk Level
                </h2>
                
                <div className="flex flex-col items-center justify-center relative py-6">
                  {/* Simple SVG Arc for Gauge */}
                  <svg className="w-48 h-24" viewBox="0 0 200 100">
                    <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#222" strokeWidth="15" strokeLinecap="round" />
                    <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gradient)" strokeWidth="15" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset={251.2 - (progress / 2)} className="transition-all duration-1000" />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="50%" stopColor="#eab308" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>
                    {/* Gauge Needle */}
                    <g transform={`translate(100, 100) rotate(${overallScore * 1.8 - 90})`} className="transition-transform duration-1000 origin-bottom">
                      <polygon points="-5,0 5,0 0,-65" fill="#fff" />
                      <circle cx="0" cy="0" r="8" fill="#fff" />
                    </g>
                  </svg>
                  
                  <div className="absolute bottom-2 text-center">
                    <div className="text-red-500 font-bold tracking-widest text-sm mb-1">{overallScore > 75 ? "CRITICAL" : overallScore > 40 ? "WARNING" : "STANDARD"}</div>
                    <div className="text-4xl font-bold text-white tracking-tighter">{(overallScore / 10).toFixed(1)} <span className="text-lg text-gray-500 font-normal">/ 10</span></div>
                  </div>
                </div>
                
                <p className="text-center text-sm text-gray-500 mt-4">AI Confidence: {riskData?.confidence || 0}%</p>
              </div>

              {/* Sub-Risk Levels */}
              <div className="space-y-4">
                <div className="bg-[#1a1612] border border-orange-900/50 rounded-xl p-4 cursor-pointer hover:border-orange-500/50 transition">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-medium">Victim Profile Risk</h3>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="space-y-1 text-sm text-gray-400">
                    <p>Age: {riskData?.victim_profile?.age || "Unknown"}</p>
                    {riskData?.victim_profile?.notes?.map((n: string, i: number) => <p key={i}>{n}</p>)}
                  </div>
                  <div className="text-orange-500 text-xs font-bold mt-3 uppercase">{riskData?.victim_profile?.risk_level || "Med Risk"}</div>
                </div>

                <div className="bg-[#1c1212] border border-red-900/50 rounded-xl p-4 cursor-pointer hover:border-red-500/50 transition">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-medium">Suspect Profile Risk</h3>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="space-y-1 text-sm text-gray-400">
                    <p>Age: {riskData?.suspect_profile?.age || "Unknown"}</p>
                    {riskData?.suspect_profile?.notes?.map((n: string, i: number) => <p key={i}>{n}</p>)}
                  </div>
                  <div className="text-red-500 text-xs font-bold mt-3 uppercase">{riskData?.suspect_profile?.risk_level || "Critical Risk"}</div>
                </div>
              </div>
            </div>

            {/* Center Column: Anatomical Map */}
            <div className="col-span-5 bg-[#12141c] border border-gray-800 rounded-2xl p-6 relative flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white font-semibold">Anatomical Injury Map Viewer</h2>
                <select className="bg-black/50 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-1 focus:outline-none">
                  <option>All Legend</option>
                </select>
              </div>

              <div className="flex justify-center gap-6 text-xs text-gray-400 mb-8">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"/> Laceration</span>
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"/> Puncture Wound</span>
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-800 shadow-[0_0_8px_rgba(153,27,27,0.8)]"/> Contusion</span>
              </div>

              <div className="flex-1 relative flex items-center justify-center min-h-[400px]">
                {/* Silhouette Placeholder */}
                <div className="w-64 h-full relative opacity-60">
                  <svg viewBox="0 0 200 500" className="w-full h-full drop-shadow-2xl">
                    <path d="M100,20 C110,20 120,30 120,45 C120,60 110,70 100,70 C90,70 80,60 80,45 C80,30 90,20 100,20 Z" fill="#2a3040" />
                    <path d="M100,70 C130,70 150,80 155,100 L165,220 C165,230 155,230 150,220 L140,140 L135,240 L115,450 C115,465 105,470 100,470 C95,470 85,465 85,450 L65,240 L60,140 L50,220 C45,230 35,230 35,220 L45,100 C50,80 70,70 100,70 Z" fill="#2a3040" />
                  </svg>
                  
                  {/* Injury Markers */}
                  {riskData?.anatomical_injuries?.map((injury: any, idx: number) => (
                    <div 
                      key={idx}
                      onMouseEnter={() => setHoveredInjury(injury)}
                      onMouseLeave={() => setHoveredInjury(null)}
                      className={`absolute w-3 h-3 rounded-full animate-pulse z-10 cursor-pointer ${injury.color || 'bg-red-500 shadow-[0_0_15px_4px_rgba(239,68,68,0.6)]'}`} 
                      style={{ top: injury.top || '50%', left: injury.left || '50%' }}
                    />
                  ))}

                  {/* Popover */}
                  {hoveredInjury && (
                    <div className="absolute top-[35%] left-[70%] bg-[#1a1612] border border-orange-500/50 p-4 rounded-xl shadow-2xl w-48 z-20 pointer-events-none">
                      <h4 className="text-white font-bold text-sm mb-1">{hoveredInjury.type || "Injury"}</h4>
                      <p className="text-xs text-gray-400">Wound ID: {hoveredInjury.wound_id || "Unknown"}</p>
                      <p className="text-xs text-gray-400">Type: {hoveredInjury.type || "Unknown"}</p>
                      <p className="text-xs text-gray-400">Location: {hoveredInjury.location || "Unknown"}</p>
                      <p className="text-xs text-orange-400 mt-2 font-medium">Potential Weapon: {hoveredInjury.potential_weapon || "Unknown"}</p>
                      <p className="text-[10px] text-gray-500 mt-1">Depth Analysis: {hoveredInjury.depth || "Pending"}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-center text-red-500 font-medium text-sm mt-4">CRITICAL INJURIES (RED MARKERS)</p>
            </div>

            {/* Right Column: Analytics */}
            <div className="col-span-4 space-y-6">
              
              {/* Threat Vector Analysis */}
              <div className="bg-[#12141c] border border-gray-800 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-white font-semibold">Threat Vector Analysis</h2>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-gray-500 rounded-full"/>
                    <div className="w-1 h-1 bg-gray-500 rounded-full"/>
                    <div className="w-1 h-1 bg-gray-500 rounded-full"/>
                  </div>
                </div>
                
                <div className="grid grid-cols-[auto_1fr] gap-4">
                  <div className="flex items-center justify-center -rotate-90 text-xs text-gray-500 tracking-widest uppercase origin-center w-6 h-32 mt-12">
                    Threat Type
                  </div>
                  <div>
                    <p className="text-center text-xs text-gray-500 mb-2">Risk Severity by Category</p>
                    <div className="flex flex-col gap-3 mt-4">
                      {riskData?.threat_vectors?.map((tv: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-24 text-right text-xs text-gray-400 truncate">{tv.type}</div>
                          <div className="flex-1 h-3 bg-gray-900 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${tv.severity > 75 ? 'bg-red-500' : tv.severity > 40 ? 'bg-orange-500' : 'bg-green-500'}`} 
                              style={{ width: `${tv.severity}%` }}
                            />
                          </div>
                          <div className="w-8 text-xs font-bold text-gray-300">{tv.severity}</div>
                        </div>
                      ))}
                      {(!riskData?.threat_vectors || riskData.threat_vectors.length === 0) && (
                         <div className="text-center text-gray-500 text-xs py-4">Awaiting Threat Vector Data...</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Case Risk Profiling */}
              <div className="bg-[#12141c] border border-gray-800 rounded-2xl p-6">
                <h2 className="text-white font-semibold mb-4">Location Risk Analysis</h2>
                
                <div className="flex gap-4">
                  {/* Mini Map Placeholder */}
                  <div className="w-32 h-32 bg-gray-900 rounded-xl border border-gray-700 relative overflow-hidden shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full opacity-30">
                      <path d="M10,10 L90,10 L90,90 L10,90 Z" fill="none" stroke="#4b5563" strokeWidth="2" />
                      <path d="M10,50 L90,50 M50,10 L50,90" stroke="#4b5563" strokeWidth="1" />
                      <path d="M20,20 L80,80 M20,80 L80,20" stroke="#4b5563" strokeWidth="0.5" />
                    </svg>
                    {/* Heat zones */}
                    <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-red-500/30 rounded-full blur-md" />
                    <div className="absolute bottom-1/4 right-1/4 w-10 h-10 bg-green-500/20 rounded-full blur-md" />
                    <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                  </div>

                  <div className="flex-1 space-y-2">
                    <h3 className="text-sm font-bold text-white leading-tight">Location Risk | {riskData?.location_risk?.name || "Unknown"}</h3>
                    
                    <div className="space-y-1.5 mt-2">
                      <div>
                        <p className="text-[10px] text-gray-500">Access Control:</p>
                        <p className={`text-xs font-bold ${riskData?.location_risk?.access_risk?.includes("HIGH") ? "text-red-500" : "text-green-500"}`}>{riskData?.location_risk?.access_risk || "Pending"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500">Surveillance:</p>
                        <p className={`text-xs font-bold ${riskData?.location_risk?.surveillance_risk?.includes("HIGH") ? "text-red-500" : "text-orange-500"}`}>{riskData?.location_risk?.surveillance_risk || "Pending"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
