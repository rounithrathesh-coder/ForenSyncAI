import React from "react";
import { RefreshCw, Download, FileText, Crosshair, ClipboardList, MapPin } from "lucide-react";

interface Props {
  data: any;
}

export function PatternRecognitionTab({ data }: Props) {
  // Use dynamic data if available, fallback to mock data matching the UI
  const woundPattern = data?.wound_pattern || {
    title: "Sharp Force Trauma Archetype Match",
    confidence: 86,
    details: [
      "Theory traumas (DCS-090)",
      "Points stress (SSE-088)",
      "Points of measure Carrus (SSE-0907)"
    ]
  };

  const defaultCases = ["CASE-0043", "CASE-0912", "CASE-0013", "CASE-0914", "CASE-0912", "CASE-0915", "CASE-0013", "CASE-0931"];
  const historicalCases = data?.historical_cases || defaultCases;

  const behavioralMO = data?.behavioral_mo || [
    { title: "Premeditation Markers - High Priority", severity: "HIGH", confidence: 91 },
    { title: "Target Selection Profile (consistent with public homicide)", severity: "HIGH", confidence: 84 },
    { title: "Evidence Disposal Pattern - Medium", severity: "MEDIUM", confidence: 71 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-gray-300">
      
      {/* LEFT COLUMN */}
      <div className="space-y-6">
        
        {/* Wound Pattern MO Analysis */}
        <div className="bg-[#0b0c10] border border-gray-800 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white font-semibold">Wound Pattern Modus Operandi Analysis</h2>
            <div className="flex gap-2">
              <button className="text-xs text-gray-400 flex items-center gap-1 hover:text-white transition"><RefreshCw className="w-3 h-3"/> Re-run analysis</button>
              <button className="text-xs border border-red-900/50 text-red-400 bg-red-500/10 px-3 py-1 rounded flex items-center gap-1 hover:bg-red-500/20 transition"><Download className="w-3 h-3"/> Export</button>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Anatomical Image Placeholder */}
            <div className="w-40 h-56 relative shrink-0">
              <svg viewBox="0 0 200 300" className="w-full h-full opacity-60">
                <path d="M100,20 C120,20 140,40 140,60 C140,80 120,90 100,90 C80,90 60,80 60,60 C60,40 80,20 100,20 Z" fill="#2a3040" />
                <path d="M100,90 C140,90 160,110 170,140 L180,250 C180,260 170,260 160,250 L140,160 L130,290 C130,310 110,310 100,310 C90,310 70,310 70,290 L60,160 L40,250 C30,260 20,260 20,250 L30,140 C40,110 60,90 100,90 Z" fill="#2a3040" />
              </svg>
              {/* Lines & Markers */}
              <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
              <div className="absolute top-1/2 left-2/3 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
              
              <div className="absolute top-1/4 -left-6 text-[8px] text-gray-400">Digital calibers</div>
              <div className="absolute top-1/4 -right-8 text-[8px] text-gray-400 text-right">Points of measure<br/>on injury sites</div>
              
              {/* Line connectors (visual only) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line x1="20" y1="90" x2="60" y2="100" stroke="#4b5563" strokeWidth="0.5" />
                <line x1="180" y1="90" x2="140" y2="100" stroke="#4b5563" strokeWidth="0.5" />
              </svg>
            </div>

            <div className="flex-1">
              <h3 className="text-white font-bold mb-1 leading-tight">{woundPattern.title} - {woundPattern.confidence}% Confidence</h3>
              <p className="text-xs text-gray-500 mb-3">Source Evidence:</p>
              <ul className="text-[10px] text-gray-400 space-y-1 list-disc ml-4 mb-4">
                {woundPattern.details.map((detail: string, i: number) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
              <p className="text-xs text-orange-500/80 leading-snug">
                Comparison to archival weapon profiles to archival weapon profiles bound aten injury sites.
              </p>
            </div>
          </div>
        </div>

        {/* Historical Case Correlation Feed */}
        <div className="bg-[#0b0c10] border border-gray-800 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white font-semibold">Historical Case Correlation Feed</h2>
            <div className="flex gap-2">
              <button className="text-xs text-gray-400 flex items-center gap-1 hover:text-white transition"><RefreshCw className="w-3 h-3"/> Re-run analysis</button>
              <button className="text-xs border border-red-900/50 text-red-400 bg-red-500/10 px-3 py-1 rounded flex items-center gap-1 hover:bg-red-500/20 transition"><Download className="w-3 h-3"/> Export</button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-4">Archival Case IDs with matching pattern Markers</p>

          <div className="grid grid-cols-4 gap-3">
            {historicalCases.map((id: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-mono text-gray-300">
                <div className="w-2 h-2 rounded-full bg-red-500/80 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                {id}
              </div>
            ))}
          </div>
        </div>

        {/* Temporal Clustering & Suspect Timelines */}
        <div className="bg-[#0b0c10] border border-gray-800 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white font-semibold">Temporal Clustering & Suspect Timelines</h2>
            <div className="flex gap-2">
              <button className="text-xs text-gray-400 flex items-center gap-1 hover:text-white transition"><RefreshCw className="w-3 h-3"/> Re-run analysis</button>
              <button className="text-xs border border-red-900/50 text-red-400 bg-red-500/10 px-3 py-1 rounded flex items-center gap-1 hover:bg-red-500/20 transition"><Download className="w-3 h-3"/> Export</button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[10px] text-gray-400 justify-center mb-4">
            <div className="flex items-center gap-1"><div className="w-4 h-2 bg-red-500/80"/> Suspect Phone Activity</div>
            <div className="flex items-center gap-1"><div className="w-4 h-2 bg-gray-600"/> Vehicle GPS Pings</div>
          </div>

          {/* Graph Placeholder */}
          <div className="h-40 w-full relative border-l border-b border-gray-800">
            {/* Y axis labels */}
            <div className="absolute -left-6 top-0 text-[8px] text-gray-600">400</div>
            <div className="absolute -left-6 top-1/4 text-[8px] text-gray-600">250</div>
            <div className="absolute -left-6 top-2/4 text-[8px] text-gray-600">100</div>
            <div className="absolute -left-6 bottom-0 text-[8px] text-gray-600">0</div>
            
            {/* X axis labels */}
            <div className="absolute -bottom-4 left-0 text-[8px] text-gray-600">Day 1</div>
            <div className="absolute -bottom-4 right-0 text-[8px] text-gray-600">Day 7</div>

            {/* Simulated Data graph */}
            <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="w-full h-full opacity-80">
              <path d="M0,100 L0,80 L20,90 L40,30 L60,80 L80,20 L100,70 L120,40 L140,80 L160,50 L180,100 L200,100 L220,90 L240,100 L260,100 L280,100 L300,100 L320,90 L340,60 L360,20 L380,80 L400,100 Z" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="1.5" />
              <path d="M0,100 L10,70 L30,95 L50,60 L70,40 L90,85 L110,60 L130,90 L150,50 L170,100 L190,100 L210,100 L230,100 L250,100 L270,100 L290,100 L310,100 L330,80 L350,40 L370,10 L390,90 L400,100 Z" fill="none" stroke="#9ca3af" strokeWidth="1.5" />
            </svg>

            {/* Highlight Box */}
            <div className="absolute top-0 bottom-0 left-[45%] w-[15%] bg-red-500/10 border-l border-r border-red-500/30 flex items-center justify-center">
              <div className="absolute -top-6 bg-red-900/80 text-white text-[8px] px-2 py-0.5 rounded whitespace-nowrap border border-red-500/50">
                Significant repeated pings and gaps
              </div>
            </div>
          </div>
        </div>

      </div>


      {/* RIGHT COLUMN */}
      <div className="space-y-6">
        
        {/* Behavioral MO & Victimology */}
        <div className="bg-[#0b0c10] border border-gray-800 rounded-2xl p-5 h-fit">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white font-semibold">Behavioral MO & Victimology</h2>
            <div className="flex gap-2">
              <button className="text-xs text-gray-400 flex items-center gap-1 hover:text-white transition"><RefreshCw className="w-3 h-3"/> Re-run analysis</button>
              <button className="text-xs border border-red-900/50 text-red-400 bg-red-500/10 px-3 py-1 rounded flex items-center gap-1 hover:bg-red-500/20 transition"><Download className="w-3 h-3"/> Export</button>
            </div>
          </div>

          <div className="space-y-3">
            {behavioralMO.map((mo: any, idx: number) => {
              const isHigh = mo.severity === "HIGH";
              const colorClass = isHigh ? "text-red-500" : "text-orange-500";
              const bgClass = isHigh ? "bg-red-500/5 border-red-900/30" : "bg-orange-500/5 border-orange-900/30";

              return (
                <div key={idx} className={`border rounded-xl p-4 flex gap-4 items-center ${bgClass}`}>
                  <span className="text-gray-500 font-mono text-sm w-4">{idx + 1}</span>
                  <div className={`p-2 rounded bg-black/40 border border-white/5 ${colorClass}`}>
                    {isHigh ? <FileText className="w-4 h-4" /> : <ClipboardList className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-200">{mo.title}</h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">Meter confidence ({mo.confidence}% confidence)</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-bold ${colorClass}`}>{mo.severity} <span className="ml-2 text-white">{mo.confidence}%</span></div>
                    <div className="w-full bg-black/50 h-0.5 mt-1 rounded-full overflow-hidden">
                      <div className={`h-full ${isHigh ? 'bg-red-500' : 'bg-orange-500'}`} style={{ width: `${mo.confidence}%` }} />
                    </div>
                    <div className="text-[8px] text-gray-500 mt-1">Risk Significance</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Geospatial Pattern Map */}
        <div className="bg-[#0b0c10] border border-gray-800 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white font-semibold">Geospatial Pattern Map & Clusters</h2>
            <div className="flex gap-2">
              <button className="text-xs text-gray-400 flex items-center gap-1 hover:text-white transition"><RefreshCw className="w-3 h-3"/> Re-run analysis</button>
              <button className="text-xs border border-red-900/50 text-red-400 bg-red-500/10 px-3 py-1 rounded flex items-center gap-1 hover:bg-red-500/20 transition"><Download className="w-3 h-3"/> Export</button>
            </div>
          </div>

          <div className="flex justify-end gap-2 mb-4">
            <span className="text-xs text-gray-500 self-center">Sort by to by:</span>
            <select className="bg-transparent border border-gray-700 text-xs rounded px-2 py-1 outline-none text-gray-300">
              <option>Date Range</option>
            </select>
            <select className="bg-transparent border border-gray-700 text-xs rounded px-2 py-1 outline-none text-gray-300">
              <option>Pattern Type</option>
            </select>
          </div>

          {/* Map Placeholder Graphic */}
          <div className="h-80 w-full relative rounded-xl border border-gray-800 overflow-hidden bg-[#1a1c23]">
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            {/* Mock Map Lines */}
            <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full opacity-20">
              <path d="M50,0 L100,300 M150,0 L120,300 M250,0 L300,300 M350,0 L380,300" stroke="#fff" strokeWidth="1" />
              <path d="M0,50 L400,80 M0,150 L400,120 M0,250 L400,280" stroke="#fff" strokeWidth="1" />
              {/* Coastline */}
              <path d="M0,0 Q100,100 0,300" fill="#0f172a" />
            </svg>

            {/* Heat Clusters */}
            <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-orange-500/30 rounded-full blur-2xl" />
            <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-red-500/40 rounded-full blur-xl" />
            <div className="absolute bottom-1/4 left-1/4 w-16 h-16 bg-orange-500/30 rounded-full blur-xl" />

            {/* Pins */}
            <MapPin className="absolute top-[30%] right-[30%] w-5 h-5 text-blue-500 fill-blue-900 drop-shadow-[0_0_5px_rgba(59,130,246,1)]" />
            <MapPin className="absolute top-[40%] right-[35%] w-5 h-5 text-red-500 fill-red-900 drop-shadow-[0_0_5px_rgba(239,68,68,1)]" />
            <MapPin className="absolute bottom-[30%] left-[30%] w-5 h-5 text-orange-500 fill-orange-900 drop-shadow-[0_0_5px_rgba(249,115,22,1)]" />

            {/* Pattern Settings Popover */}
            <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-gray-700 rounded-lg p-3 w-40">
              <h4 className="text-xs text-white font-medium mb-2">Patterns</h4>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-3 bg-red-500/20 rounded-full relative"><div className="w-4 h-4 bg-red-500 rounded-full absolute -top-0.5 right-0 border-2 border-black" /></div>
              </div>
              <div className="text-[10px] text-gray-400 border border-gray-700 px-2 py-1 rounded w-full flex justify-between">
                Date Range
              </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md border border-gray-700 rounded-lg p-3 space-y-1.5">
              <div className="flex items-center gap-2 text-[10px] text-gray-300"><div className="w-2 h-2 rounded-full bg-orange-500" /> Evidence</div>
              <div className="flex items-center gap-2 text-[10px] text-gray-300"><div className="w-2 h-2 rounded-full bg-green-500" /> Suspect Sightings</div>
              <div className="flex items-center gap-2 text-[10px] text-gray-300"><div className="w-2 h-2 rounded-full bg-blue-500" /> Victim Locations</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
