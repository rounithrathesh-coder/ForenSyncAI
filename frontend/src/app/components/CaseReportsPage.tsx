import { useEffect, useState } from "react";
import { Download, Loader2 } from "lucide-react";

export function CaseReportsPage() {
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      // 1. Check cache
      const storedReport = localStorage.getItem("caseReportData");
      if (storedReport) {
        try {
          const data = JSON.parse(storedReport);
          if (data) {
            setReportData(data);
            return;
          }
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
        if (data.report) {
          setReportData(data.report);
          localStorage.setItem("caseReportData", JSON.stringify(data.report));
        }
      } catch (err) {
        console.error("Failed to fetch report:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, []);

  const getP = (panel: string, key: string) => {
    return reportData?.[panel]?.[key] || "Pending";
  };

  const hasEvidence = !!localStorage.getItem("rawEvidenceText");

  return (
    <div className="flex-1 overflow-y-auto p-6 text-gray-300">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-wide">Case Report</h1>
            {isLoading && <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-transparent border border-orange-500/50 hover:bg-orange-500/10 text-orange-500 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export Report</span>
          </button>
        </div>

        {/* No evidence uploaded state */}
        {!hasEvidence && !reportData && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-orange-950/50 flex items-center justify-center mb-4">
              <Download className="w-8 h-8 text-orange-500/50" />
            </div>
            <h2 className="text-lg font-semibold text-gray-400 mb-2">No Evidence Uploaded</h2>
            <p className="text-sm text-gray-600 max-w-md">Upload evidence files in the Evidence Upload section to generate a comprehensive AI-powered case report.</p>
          </div>
        )}

        {/* Grid Layout - 5 Columns */}
        {(reportData || isLoading) && (
        <div className="grid grid-cols-5 gap-4">
          
          {/* Row 1 */}
          <Panel number={1} title="Case Information">
            <Row label="Case ID" value={getP("panel1", "case_id")} />
            <Row label="Date" value={getP("panel1", "date")} />
            <Row label="Location" value={getP("panel1", "location")} stacked />
            <Row label="Investigating Unit / Examiner" value={getP("panel1", "unit")} stacked />
          </Panel>

          <Panel number={2} title="Subject / Victim Information">
            <Row label="Name" value={getP("panel2", "name")} />
            <Row label="Estimated Age" value={getP("panel2", "age")} />
            <Row label="Gender" value={getP("panel2", "gender")} />
            <Row label="Height" value={getP("panel2", "height")} />
            <Row label="Weight" value={getP("panel2", "weight")} />
            <div className="flex items-center justify-between text-[11px] mt-2">
              <span className="text-gray-500">Identification Status</span>
              <span className="text-green-400 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500"/>{getP("panel2", "id_status")}</span>
            </div>
          </Panel>

          <Panel number={3} title="Incident Overview">
            <Row label="Discovery of Body" value={getP("panel3", "discovery")} stacked />
            <Row label="Time Authorities Notified" value={getP("panel3", "notified")} stacked />
            <div className="mt-3 text-[11px]">
              <span className="text-gray-500 block mb-1">Initial Scene Circumstances</span>
              <span className="text-gray-300 leading-relaxed">{getP("panel3", "circumstances")}</span>
            </div>
          </Panel>

          <Panel number={4} title="Scene Observations">
            <Row label="Physical Environment" value={getP("panel4", "environment")} />
            <Row label="Blood Evidence" value={getP("panel4", "blood")} />
            <Row label="Footprints / Impressions" value={getP("panel4", "footprints")} />
            <Row label="CCTV Status" value={getP("panel4", "cctv")} stacked />
            <Row label="Missing Belongings" value={getP("panel4", "missing")} />
          </Panel>

          <Panel number={5} title="Witness Information">
            <Row label="Statements" value={getP("panel5", "statements")} />
            <Row label="Sounds Heard" value={getP("panel5", "sounds")} />
            <Row label="Suspect Observations" value={getP("panel5", "suspect")} />
            <Row label="Timeline Confirmation" value={getP("panel5", "timeline")} stacked />
          </Panel>

          {/* Row 2 */}
          <Panel number={6} title="Estimated Time of Death">
            <Row label="Estimated Window" value={getP("panel6", "window")} />
            <div className="text-[11px] text-gray-500 mt-3 mb-1">Methods Used</div>
            <Row label="Body Temperature" value={getP("panel6", "body_temp")} check />
            <Row label="Witness Timeline" value={getP("panel6", "witness_timeline")} check />
            <Row label="CCTV Reconstruction" value={getP("panel6", "cctv_recon")} check />
          </Panel>

          <Panel number={7} title="External Examination">
            <Row label="Visible Injuries" value={getP("panel7", "injuries")} />
            <Row label="Clothing Condition" value={getP("panel7", "clothing")} />
            <Row label="Defensive Wounds" value={getP("panel7", "defensive")} />
            <Row label="Signs of Struggle" value={getP("panel7", "struggle")} />
          </Panel>

          <Panel number={8} title="Internal Examination">
            <Row label="Head Examination" value={getP("panel8", "head")} stacked />
            <Row label="Lung Findings" value={getP("panel8", "lungs")} />
            <Row label="Heart Findings" value={getP("panel8", "heart")} />
            <Row label="Organ Observations" value={getP("panel8", "organs")} />
          </Panel>

          <Panel number={9} title="Toxicology">
            <div className="text-[11px] mb-3">
              <span className="text-gray-500 block mb-1">Drug / Alcohol Testing Status</span>
              <span className="text-gray-300">{getP("panel9", "testing_status")}</span>
            </div>
            <div className="text-[11px]">
              <span className="text-gray-500 block mb-1">Pending Analysis</span>
              <span className="text-gray-300">{getP("panel9", "pending_analysis")}</span>
            </div>
          </Panel>

          <Panel number={10} title="Forensic Observations">
            <Row label="Physical Altercation Indicators" value={getP("panel10", "altercation")} />
            <Row label="Additional Findings" value={getP("panel10", "additional")} stacked />
            <Row label="Weapon Evidence Absence" value={getP("panel10", "weapon")} stacked />
          </Panel>

          {/* Row 3 */}
          <Panel number={11} title="Digital / AI Timeline Correlation">
            <Row label="CCTV Blackout Analysis" value={getP("panel11", "cctv_analysis")} />
            <Row label="Witness Correlation" value={getP("panel11", "witness_corr")} />
            <Row label="Hidden Activity Prediction" value={getP("panel11", "hidden_pred")} stacked />
            
            {/* Mini Timeline UI */}
            <div className="mt-4 pt-3 border-t border-gray-800/50">
              <div className="relative h-2 bg-gray-800 rounded-full flex items-center">
                {/* Dots */}
                <div className="absolute left-[10%] w-2 h-2 rounded-full bg-red-500" />
                <div className="absolute left-[30%] w-2 h-2 rounded-full bg-red-500" />
                {/* Red Line Segment */}
                <div className="absolute left-[30%] w-[40%] h-0.5 bg-red-500" />
                <div className="absolute left-[70%] w-2 h-2 rounded-full bg-red-500" />
                <div className="absolute left-[90%] w-2 h-2 rounded-full bg-green-500" />
              </div>
              <div className="flex justify-between mt-2 text-[9px] text-gray-500">
                <span>01:00 AM</span>
                <span>01:50 AM</span>
                <span className="text-red-500">Blackout Period</span>
                <span>02:20 AM</span>
                <span>03:00 AM</span>
              </div>
            </div>
          </Panel>

          <Panel number={12} title="Confidence Analysis">
            <ProgressBar label="Confidence in Time of Death" value={parseInt(getP("panel12", "conf_time"))} />
            <ProgressBar label="Confidence in Cause Analysis" value={parseInt(getP("panel12", "conf_cause"))} />
            <ProgressBar label="Confidence in Timeline Alignment" value={parseInt(getP("panel12", "conf_alignment"))} />
          </Panel>

          <Panel number={13} title="Investigative Analysis">
            <Row label="Evidence Interpretation" value={getP("panel13", "interpretation")} stacked />
            <Row label="Surveillance Review" value={getP("panel13", "surveillance")} stacked />
            <Row label="Reconstruction Findings" value={getP("panel13", "findings")} stacked />
          </Panel>

          <Panel number={14} title="Preliminary Theory">
            <Row label="Possible Sequence of Events" value={getP("panel14", "sequence")} stacked />
            <Row label="Suspected Foul Play" value={getP("panel14", "foul_play")} />
            <Row label="Motive / Interaction Speculation" value={getP("panel14", "motive")} stacked />
          </Panel>

          <Panel number={15} title="Preliminary Conclusion">
            <Row label="Cause of Death Status" value={getP("panel15", "cause_status")} />
            <Row label="Investigation Status" value={getP("panel15", "inv_status")} />
            <div className="flex items-center justify-between text-[11px] mt-2">
              <span className="text-gray-500">Foul Play Assessment</span>
              <span className="text-red-500 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500"/>{getP("panel15", "foul_assessment")}</span>
            </div>
          </Panel>

          {/* Row 4 */}
          <Panel number={16} title="Case Status">
            <StatusRow label="Active / Closed Investigation" status={getP("panel16", "status")} color="green" />
            <StatusRow label="Identification Pending" status={getP("panel16", "id_pending")} color="green" />
            <StatusRow label="Toxicology Pending" status={getP("panel16", "tox_pending")} color="orange" />
          </Panel>

          <Panel number={17} title="Investigator / Examiner Notes">
            <div className="text-[11px] mb-3">
              <span className="text-gray-500 block mb-1">Additional Comments</span>
              <span className="text-gray-300">{getP("panel17", "comments")}</span>
            </div>
            <div className="text-[11px] mb-3">
              <span className="text-gray-500 block mb-1">Limitations</span>
              <span className="text-gray-300">{getP("panel17", "limitations")}</span>
            </div>
            <div className="text-[11px]">
              <span className="text-gray-500 block mb-1">Legal / Disclaimer</span>
              <span className="text-gray-300">{getP("panel17", "legal")}</span>
            </div>
          </Panel>

          <Panel number={18} title="Evidence References">
            <LinkRow icon="video" label="CCTV Footage" count="3 clips (Partial)" />
            <LinkRow icon="file" label="Witness Statements" count="3 statements" />
            <LinkRow icon="lock" label="Physical Evidence" count="7 items collected" />
            <LinkRow icon="image" label="Scene Photographs" count="24 images" />
          </Panel>

          <Panel number={19} title="Signatures / Authorization" className="col-span-2">
            <div className="flex items-center justify-between h-full">
              <div className="space-y-6">
                <div>
                  <div className="text-[11px] text-gray-500 mb-2">Examiner Signature</div>
                  <div className="flex items-end gap-6">
                    <span className="font-['Brush_Script_MT',cursive,serif] text-2xl text-gray-300 italic">Dr. M. Hayes</span>
                    <span className="text-[10px] text-gray-600">Date: May 21, 2026</span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-gray-500 mb-2">Investigator Approval</div>
                  <div className="flex items-end gap-6">
                    <span className="font-['Brush_Script_MT',cursive,serif] text-2xl text-gray-300 italic">Agent Rodriguez</span>
                    <span className="text-[10px] text-gray-600">Date: May 21, 2026</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center pr-10">
                <div className="text-[9px] text-gray-500 mb-2">Official Seal / Stamp</div>
                {/* Mock Seal */}
                <div className="w-24 h-24 rounded-full border-2 border-gray-600 flex items-center justify-center p-1 relative opacity-60">
                  <div className="w-full h-full rounded-full border border-gray-600 flex flex-col items-center justify-center p-2 text-center relative">
                    <div className="absolute inset-0 rounded-full border border-gray-600 border-dashed m-1"></div>
                    <span className="text-[7px] tracking-widest text-gray-400 absolute top-2 font-bold">HOMICIDE UNIT 3</span>
                    <span className="text-xl">⚖️</span>
                    <span className="text-[6px] tracking-wider text-gray-400 absolute bottom-2 font-bold">FORENSIC DIVISION</span>
                  </div>
                </div>
              </div>
            </div>
          </Panel>

        </div>
        )}
      </div>
    </div>
  );
}

// Helper Components
function Panel({ number, title, children, className = "" }: { number: number, title: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-[#0d1117] border border-gray-800 rounded-xl p-4 flex flex-col ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 rounded-full bg-orange-950 flex items-center justify-center flex-shrink-0">
          <span className="text-orange-500 text-[10px] font-bold">{number}</span>
        </div>
        <h2 className="text-white text-xs font-semibold">{title}</h2>
      </div>
      <div className="flex-1 space-y-3">{children}</div>
    </div>
  );
}

function Row({ label, value, stacked = false, check = false }: { label: string, value: string, stacked?: boolean, check?: boolean }) {
  if (stacked) {
    return (
      <div className="text-[11px]">
        <span className="text-gray-500 block mb-0.5">{label}</span>
        <span className="text-gray-300">{value}</span>
      </div>
    );
  }
  return (
    <div className="flex justify-between text-[11px]">
      <span className="text-gray-500 flex items-center gap-1.5">
        {check && <span className="text-green-500">✓</span>}
        {label}
      </span>
      <span className="text-gray-300 text-right max-w-[50%]">{value}</span>
    </div>
  );
}

function ProgressBar({ label, value }: { label: string, value: number }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between text-[11px] mb-1.5">
        <span className="text-blue-400">{label}</span>
        <span className="text-gray-300">{value}%</span>
      </div>
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-orange-600 rounded-full" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function StatusRow({ label, status, color }: { label: string, status: string, color: "green" | "orange" }) {
  return (
    <div className="flex justify-between items-center text-[11px] py-1 border-b border-gray-800/50 last:border-0">
      <span className="text-gray-500">{label}</span>
      <span className="flex items-center gap-1.5 text-gray-300">
        <div className={`w-1.5 h-1.5 rounded-full ${color === "green" ? "bg-green-500" : "bg-orange-500"}`} />
        {status}
      </span>
    </div>
  );
}

function LinkRow({ icon, label, count }: { icon: string, label: string, count: string }) {
  return (
    <div className="flex items-center justify-between text-[11px] py-1 border-b border-gray-800/50 last:border-0">
      <div className="flex items-center gap-2">
        <span className="text-gray-500">
          {icon === 'video' && '📹'}
          {icon === 'file' && '📄'}
          {icon === 'lock' && '🔒'}
          {icon === 'image' && '🖼️'}
        </span>
        <span className="text-gray-400">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-gray-500">{count}</span>
        <button className="text-orange-500 hover:text-orange-400 font-medium">View</button>
      </div>
    </div>
  );
}
