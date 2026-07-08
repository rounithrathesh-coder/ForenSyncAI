import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { CaseOverviewCards } from "./components/CaseOverviewCards";
import { AIAutopsyPanel } from "./components/AIAutopsyPanel";
import { EvidenceTimeline } from "./components/EvidenceTimeline";
import { RiskScorePanel } from "./components/RiskScorePanel";
import { EvidenceCorrelation } from "./components/EvidenceCorrelation";
import { AIInsightsPanel } from "./components/AIInsightsPanel";
import { FileUploadSection } from "./components/FileUploadSection";
import { ActivityLog } from "./components/ActivityLog";
import { CaseHeatmap } from "./components/CaseHeatmap";
import { EvidenceUploadPage } from "./components/EvidenceUploadPage";
import { AIAnalysisPage } from "./components/AIAnalysisPage";
import { TimelineReconstructionPage } from "./components/TimelineReconstructionPage";
import { CaseReportsPage } from "./components/CaseReportsPage";
import { RiskAssessmentPage } from "./components/RiskAssessmentPage";
import { LoginPage } from "./components/LoginPage";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="size-full flex bg-gradient-to-br from-gray-950 via-black to-gray-900 dark">
      {/* Sidebar */}
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar />

        {/* Page Content */}
        {activePage === "dashboard" && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-[1800px] mx-auto space-y-6">
              {/* Case Overview Cards */}
              <CaseOverviewCards />

              {/* Main Grid */}
              <div className="grid grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="col-span-2 space-y-6">
                  <AIAutopsyPanel />
                  <EvidenceTimeline />
                  <EvidenceCorrelation />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <RiskScorePanel />
                  <AIInsightsPanel />
                </div>
              </div>

              {/* Bottom Section */}
              <div className="grid grid-cols-2 gap-6">
                <CaseHeatmap />
                <ActivityLog />
              </div>

              {/* File Upload */}
              <FileUploadSection />
            </div>
          </div>
        )}

        {activePage === "evidence-upload" && <EvidenceUploadPage onNavigate={setActivePage} />}
        {activePage === "ai-analysis" && <AIAnalysisPage />}
        {activePage === "timeline" && <TimelineReconstructionPage />}
        {activePage === "reports" && <CaseReportsPage />}
        {activePage === "risk" && <RiskAssessmentPage />}
      </div>
    </div>
  );
}