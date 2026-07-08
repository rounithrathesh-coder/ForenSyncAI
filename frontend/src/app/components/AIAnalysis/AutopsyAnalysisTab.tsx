import { 
  FileText, CheckCircle2, Brain, Activity, Target, 
  Stethoscope, AlertTriangle, Clock, FlaskConical, 
  Thermometer, ArrowRight 
} from "lucide-react";

interface Props {
  data: any;
}

export function AutopsyAnalysisTab({ data }: Props) {
  // Use data if available, otherwise use placeholders
  const confidence = data?.confidence || 92;
  const probableCause = data?.probable_cause || "Blunt Force Trauma";
  const probableCauseConf = data?.probable_cause_confidence || "High Confidence";
  const probableCauseDesc = data?.probable_cause_desc || "The analysis indicates that the victim likely died due to severe blunt force trauma to the head resulting in fatal cranial injuries and internal hemorrhage.";
  const injuryPatterns = data?.injury_patterns || [
    "Severe cranial injury with skull fracture (left temporal region)",
    "Multiple contusions on chest and abdomen",
    "Left arm fracture (mid-shaft)",
    "Internal bleeding in liver and spleen"
  ];
  const medicalObs = data?.medical_observations || [
    "Significant blood loss",
    "No signs of defensive wounds on hands",
    "Estimated time since death supported by rigor mortis stage"
  ];
  const suspiciousInd = data?.suspicious_indicators || [
    "CCTV gap detected 3 minutes before estimated time of death",
    "Victim's last known location inconsistent with mobile metadata",
    "Possible timeline manipulation suspected"
  ];
  const timeOfDeath = data?.time_of_death || "8:30 PM - 10:00 PM";
  const timeOfDeathDate = data?.time_of_death_date || "May 26, 2026";
  const pmi = data?.postmortem_interval || "6 - 9 hours";
  const bac = data?.blood_alcohol || "0.02%";
  const bodyTemp = data?.body_temp || "28.4°C";
  const rigorMortis = data?.rigor_mortis || "Moderate";
  const livorMortis = data?.livor_mortis || "Fixed";
  const summary = data?.summary || "The victim suffered severe blunt force trauma primarily to the head, causing fatal cranial injuries and internal bleeding. Evidence suggests the incident occurred between 8:30 PM and 10:00 PM on May 26, 2026. Several inconsistencies in the timeline and missing CCTV footage indicate potential foul play.";

  // Calculate SVG circle dash offset based on confidence
  const circleOffset = 282.7 - (282.7 * (confidence / 100));

  return (
    <div className="space-y-6">
      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left Column (Span 1) */}
        <div className="col-span-1 space-y-6">
          {/* Uploaded Report Card */}
          <div className="bg-black/40 backdrop-blur-xl border border-gray-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Uploaded Report</h3>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <FileText className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-gray-200 font-medium">Autopsy_Report_INV-2026-4782.pdf</p>
                <p className="text-xs text-gray-500 mt-1">Status: Processed</p>
                <div className="flex items-center gap-1.5 mt-2 text-green-500">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Ready for AI Analysis</span>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Confidence */}
          <div className="bg-black/40 backdrop-blur-xl border border-gray-800 rounded-xl p-5 flex flex-col items-center">
            <h3 className="text-sm font-semibold text-white w-full mb-6">Analysis Confidence</h3>
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Circular Progress SVG Background */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="transparent" stroke="#1f2937" strokeWidth="8" 
                />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="transparent" stroke="#8b5cf6" strokeWidth="8" 
                  strokeDasharray="282.7" strokeDashoffset={circleOffset}
                  className="drop-shadow-[0_0_8px_rgba(139,92,246,0.8)] transition-all duration-1000"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold text-white">{confidence}%</span>
                <span className="text-[10px] text-purple-400 font-medium mt-1">High Confidence</span>
              </div>
            </div>
          </div>

          {/* AI Model Card */}
          <div className="bg-black/40 backdrop-blur-xl border border-gray-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">AI Model</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-200 font-medium">Qwen 2.5 72B</span>
              <span className="text-[10px] font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">Advanced</span>
            </div>
            <p className="text-xs text-gray-500">Specialized in medical & forensic analysis</p>
          </div>
        </div>

        {/* Middle Column (Span 2) */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          {/* Probable Cause of Death */}
          <div className="bg-black/40 backdrop-blur-xl border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-red-500" />
              <h3 className="text-sm font-semibold text-white">Probable Cause of Death</h3>
            </div>
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-bold text-red-400">{probableCause}</h4>
                <span className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/30 px-2.5 py-1 rounded-full">{probableCauseConf}</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                {probableCauseDesc}
              </p>
            </div>
          </div>

          {/* Detailed Lists Grid */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-black/40 backdrop-blur-xl border border-gray-800 rounded-xl p-5">
              <div className="space-y-6">
                
                {/* Injury Patterns */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-red-500" />
                    <h3 className="text-sm font-semibold text-white">Injury Patterns</h3>
                  </div>
                  <ul className="space-y-2 ml-6 list-disc text-sm text-gray-400 marker:text-gray-600">
                    {injuryPatterns.map((item: string, i: number) => <li key={i}>{item}</li>)}
                  </ul>
                </div>

                {/* Medical Observations */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Stethoscope className="w-4 h-4 text-purple-500" />
                    <h3 className="text-sm font-semibold text-white">Medical Observations</h3>
                  </div>
                  <ul className="space-y-2 ml-6 list-disc text-sm text-gray-400 marker:text-gray-600">
                    {medicalObs.map((item: string, i: number) => <li key={i}>{item}</li>)}
                  </ul>
                </div>

                {/* Suspicious Indicators */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <h3 className="text-sm font-semibold text-white">Suspicious Indicators</h3>
                  </div>
                  <ul className="space-y-2 ml-6 list-disc text-sm text-gray-400 marker:text-gray-600">
                    {suspiciousInd.map((item: string, i: number) => <li key={i}>{item}</li>)}
                  </ul>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Span 1) */}
        <div className="col-span-1">
          <div className="bg-black/40 backdrop-blur-xl border border-gray-800 rounded-xl p-5 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-white">Key Forensic Metrics</h3>
            </div>

            <div className="space-y-6 flex-1">
              {/* Metric 1 */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <Clock className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-200">Estimated Time of Death</p>
                      <p className="text-[10px] text-gray-500">Based on postmortem indicators</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{timeOfDeath}</p>
                      <p className="text-[10px] text-gray-400">{timeOfDeathDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <Activity className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-200">Postmortem Interval</p>
                      <p className="text-[10px] text-gray-500">Estimated time since death</p>
                    </div>
                    <p className="text-sm font-medium text-white">{pmi}</p>
                  </div>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <FlaskConical className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-200">Blood Alcohol Content</p>
                      <p className="text-[10px] text-gray-500">From toxicology analysis</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{bac}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metric 4 */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <Thermometer className="w-4 h-4 text-orange-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-200">Body Temperature</p>
                      <p className="text-[10px] text-gray-500">At the time of examination</p>
                    </div>
                    <p className="text-sm font-medium text-white">{bodyTemp}</p>
                  </div>
                </div>
              </div>

              {/* Metric 5 */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 bg-teal-500/10 rounded-lg border border-teal-500/20">
                  <Activity className="w-4 h-4 text-teal-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-200">Rigor Mortis</p>
                      <p className="text-[10px] text-gray-500">Stage at time of examination</p>
                    </div>
                    <p className="text-sm font-medium text-white">{rigorMortis}</p>
                  </div>
                </div>
              </div>

              {/* Metric 6 */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 bg-pink-500/10 rounded-lg border border-pink-500/20">
                  <Target className="w-4 h-4 text-pink-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-200">Livor Mortis</p>
                      <p className="text-[10px] text-gray-500">Observed pattern</p>
                    </div>
                    <p className="text-sm font-medium text-white">{livorMortis}</p>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 py-3 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-gray-700 rounded-lg transition-colors group">
              <FileText className="w-4 h-4 text-gray-300" />
              <span className="text-sm font-medium text-gray-200">View Full Medical Report</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Summary Section */}
      <div className="bg-gradient-to-r from-[#0d1117] to-[#040f26] border border-blue-900/50 rounded-xl p-6 relative overflow-hidden">
        {/* Decorative background network graphic simulation */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute right-10 top-1/2 -translate-y-1/2 w-48 h-48 border border-blue-500/20 rounded-full flex items-center justify-center opacity-50">
          <div className="w-32 h-32 border border-blue-400/30 rounded-full flex items-center justify-center">
            <Brain className="w-12 h-12 text-blue-400/60" />
          </div>
        </div>

        <div className="relative z-10 w-full md:w-2/3">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-blue-500/20 rounded border border-blue-500/30">
              <Brain className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">AI Forensic Summary</h3>
          </div>
          <p className="text-sm text-blue-100/70 leading-relaxed">
            {summary}
          </p>
        </div>
      </div>
    </div>
  );
}
