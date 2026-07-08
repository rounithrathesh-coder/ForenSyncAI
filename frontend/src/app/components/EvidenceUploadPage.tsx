import { useState, useRef } from "react";
import {
  Upload, FileText, Camera, Database, Image as ImageIcon, Mic, Video, File, CheckCircle, Clock, AlertCircle, X, Plus, Shield, User, Calendar, Tag, Eye, Loader2, Copy
} from "lucide-react";

const evidenceCategories = [
  { id: "autopsy", icon: FileText, label: "Autopsy Reports", color: "red", accept: ".pdf,.doc,.docx" },
  { id: "cctv", icon: Camera, label: "CCTV Footage", color: "purple", accept: "video/*" },
  { id: "metadata", icon: Database, label: "Metadata/CSV", color: "blue", accept: ".csv,.xlsx,.json" },
  { id: "photos", icon: ImageIcon, label: "Photo Evidence", color: "cyan", accept: "image/*" },
  { id: "audio", icon: Mic, label: "Audio Records", color: "orange", accept: "audio/*" },
  { id: "documents", icon: File, label: "Documents", color: "yellow", accept: ".pdf,.doc,.docx,.txt" },
];

const recentUploads = [
  { name: "autopsy_report_v3.pdf", category: "Autopsy Reports", size: "2.4 MB", status: "verified", time: "2 min ago", uploadedBy: "Dr. Chen", date: "May 9, 2026" },
  { name: "parking_cam_23_47.mp4", category: "CCTV Footage", size: "156 MB", status: "processing", time: "5 min ago", uploadedBy: "Agent Martinez", date: "May 9, 2026" },
  { name: "phone_metadata.csv", category: "Metadata", size: "847 KB", status: "verified", time: "12 min ago", uploadedBy: "Tech Smith", date: "May 9, 2026" },
  { name: "crime_scene_01.jpg", category: "Photo Evidence", size: "3.2 MB", status: "verified", time: "18 min ago", uploadedBy: "Officer Lee", date: "May 8, 2026" },
];

// We keep this as initial state
const initialUploadedFiles = [
  { id: 1, name: "autopsy_report_v3.pdf", category: "autopsy", categoryLabel: "Autopsy Reports", size: "2.4 MB", status: "verified", uploadedBy: "Dr. Chen", date: "May 9, 2026", evidenceId: "EV-2026-047" },
  { id: 2, name: "autopsy_report_v2.pdf", category: "autopsy", categoryLabel: "Autopsy Reports", size: "2.1 MB", status: "verified", uploadedBy: "Dr. Chen", date: "May 8, 2026", evidenceId: "EV-2026-042" },
  { id: 3, name: "toxicology_results.pdf", category: "autopsy", categoryLabel: "Autopsy Reports", size: "1.8 MB", status: "verified", uploadedBy: "Lab Tech Wilson", date: "May 7, 2026", evidenceId: "EV-2026-038" },
  { id: 4, name: "preliminary_exam.pdf", category: "autopsy", categoryLabel: "Autopsy Reports", size: "3.2 MB", status: "verified", uploadedBy: "Dr. Chen", date: "May 6, 2026", evidenceId: "EV-2026-031" },
  { id: 5, name: "parking_cam_23_47.mp4", category: "cctv", categoryLabel: "CCTV Footage", size: "156 MB", status: "processing", uploadedBy: "Agent Martinez", date: "May 9, 2026", evidenceId: "EV-2026-048" },
  { id: 6, name: "entrance_cam_21_30.mp4", category: "cctv", categoryLabel: "CCTV Footage", size: "243 MB", status: "verified", uploadedBy: "Agent Martinez", date: "May 8, 2026", evidenceId: "EV-2026-044" },
  { id: 7, name: "street_cam_22_15.mp4", category: "cctv", categoryLabel: "CCTV Footage", size: "198 MB", status: "verified", uploadedBy: "Tech Davis", date: "May 8, 2026", evidenceId: "EV-2026-041" },
  { id: 8, name: "elevator_cam_23_00.mp4", category: "cctv", categoryLabel: "CCTV Footage", size: "87 MB", status: "verified", uploadedBy: "Agent Martinez", date: "May 7, 2026", evidenceId: "EV-2026-037" },
  { id: 9, name: "phone_metadata.csv", category: "metadata", categoryLabel: "Metadata", size: "847 KB", status: "verified", uploadedBy: "Tech Smith", date: "May 9, 2026", evidenceId: "EV-2026-046" },
  { id: 10, name: "gps_location_data.json", category: "metadata", categoryLabel: "Metadata", size: "234 KB", status: "verified", uploadedBy: "Tech Smith", date: "May 8, 2026", evidenceId: "EV-2026-040" },
  { id: 11, name: "crime_scene_01.jpg", category: "photos", categoryLabel: "Photo Evidence", size: "3.2 MB", status: "verified", uploadedBy: "Officer Lee", date: "May 8, 2026", evidenceId: "EV-2026-043" },
  { id: 12, name: "crime_scene_02.jpg", category: "photos", categoryLabel: "Photo Evidence", size: "2.9 MB", status: "verified", uploadedBy: "Officer Lee", date: "May 8, 2026", evidenceId: "EV-2026-045" },
  { id: 13, name: "evidence_marker_A.jpg", category: "photos", categoryLabel: "Photo Evidence", size: "4.1 MB", status: "verified", uploadedBy: "Officer Lee", date: "May 7, 2026", evidenceId: "EV-2026-039" },
  { id: 14, name: "witness_video_001.mp4", category: "photos", categoryLabel: "Photo Evidence", size: "67 MB", status: "verified", uploadedBy: "Agent Rodriguez", date: "May 7, 2026", evidenceId: "EV-2026-036" },
  { id: 15, name: "911_call_recording.wav", category: "audio", categoryLabel: "Audio Recordings", size: "5.4 MB", status: "verified", uploadedBy: "Dispatch", date: "May 6, 2026", evidenceId: "EV-2026-032" },
  { id: 16, name: "witness_statement_audio.mp3", category: "audio", categoryLabel: "Audio Recordings", size: "12.3 MB", status: "verified", uploadedBy: "Agent Rodriguez", date: "May 7, 2026", evidenceId: "EV-2026-035" },
  { id: 17, name: "interview_suspect_01.wav", category: "audio", categoryLabel: "Audio Recordings", size: "23.7 MB", status: "verified", uploadedBy: "Agent Rodriguez", date: "May 8, 2026", evidenceId: "EV-2026-049" },
];

export function EvidenceUploadPage({ onNavigate }: { onNavigate?: (pageId: string) => void }) {
  const [filesState, setFilesState] = useState(initialUploadedFiles);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);

  const filteredFiles = selectedCategory
    ? filesState.filter(file => file.category === selectedCategory)
    : [];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === "application/pdf") {
      await processPdf(file);
    } else {
      alert("Only PDF extraction is supported currently.");
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const processPdf = async (file: File) => {
    setIsExtracting(true);
    setExtractError(null);
    setExtractedText(null);
    setUploadedFileName(file.name);

    // Mock adding file to our state so it shows up in the UI
    const newFile = {
      id: Date.now(),
      name: file.name,
      category: "documents", // Defaulting to documents for PDF uploads
      categoryLabel: "Documents",
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      status: "verified",
      uploadedBy: "Current User",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      evidenceId: `EV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`
    };
    
    setFilesState(prev => [newFile, ...prev]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/extract-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to extract PDF");
      }

      setExtractedText(data.text);
      localStorage.setItem("rawEvidenceText", data.text);
    } catch (err: any) {
      setExtractError(err.message);
    } finally {
      setIsExtracting(false);
    }
  };



  const handleGenerateReport = async () => {
    if (!extractedText) return;
    setIsGenerating(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/analyze-full", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ evidence: extractedText }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Backend returned an error");
      }
      
      // Store all extracted data in localStorage for different components to consume
      localStorage.setItem("fullAnalysisData", JSON.stringify(data));
      
      // Specifically map keys for existing components that expect certain structures
      if (data.report) localStorage.setItem("caseReportData", JSON.stringify(data.report));
      if (data.autopsy) localStorage.setItem("autopsyData", JSON.stringify(data.autopsy));
      if (data.timeline) localStorage.setItem("timelineData", JSON.stringify(data.timeline));
      if (data.risk) localStorage.setItem("riskData", JSON.stringify(data.risk));
      if (data.anomalies) localStorage.setItem("anomalyData", JSON.stringify(data.anomalies));
      if (data.patterns) localStorage.setItem("patternData", JSON.stringify(data.patterns));
      if (data.insights) localStorage.setItem("insightsData", JSON.stringify(data.insights));
      if (data.heatmap) localStorage.setItem("heatmapData", JSON.stringify(data.heatmap));
      if (data.correlation) localStorage.setItem("correlationData", JSON.stringify(data.correlation));
      
      // Navigate to the case reports page
      if (onNavigate) {
        onNavigate("reports");
      } else {
        alert("Full forensic analysis complete! All dashboard panels have been populated.");
      }
    } catch (error: any) {
      console.error(error);
      alert(`Analysis Failed: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Evidence Upload</h1>
            <p className="text-gray-400">Upload and manage forensic evidence for case INV-2026-4782</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-sm text-green-400">247 Files Uploaded</p>
            </div>
            <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-400">15.8 GB Total</p>
            </div>
          </div>
        </div>

        {/* Evidence Categories */}
        <div className="grid grid-cols-3 gap-4">
          {evidenceCategories.map((category) => {
            const fileCount = filesState.filter(f => f.category === category.id).length;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                className={`bg-black/40 backdrop-blur-xl border rounded-xl p-6 hover:scale-105 transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "border-2 border-red-500/50 shadow-lg shadow-red-500/20"
                    : "border-gray-700 hover:border-blue-500/50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${
                      category.color === "red"
                        ? "from-red-500/20 to-red-600/20"
                        : category.color === "purple"
                        ? "from-purple-500/20 to-purple-600/20"
                        : category.color === "blue"
                        ? "from-blue-500/20 to-blue-600/20"
                        : category.color === "cyan"
                        ? "from-cyan-500/20 to-cyan-600/20"
                        : category.color === "orange"
                        ? "from-orange-500/20 to-orange-600/20"
                        : "from-yellow-500/20 to-yellow-600/20"
                    } rounded-lg flex items-center justify-center`}
                  >
                    <category.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-white font-semibold mb-1">{category.label}</h3>
                    <p className="text-xs text-gray-400">{fileCount} files</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Filtered Files View */}
        {selectedCategory && (
          <div className="bg-black/40 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl text-white font-semibold">
                  {evidenceCategories.find(c => c.id === selectedCategory)?.label}
                </h2>
                <p className="text-sm text-gray-400">{filteredFiles.length} files found</p>
              </div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="bg-white/5 border border-gray-700 rounded-lg p-4 hover:bg-white/10 hover:border-blue-500/50 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    {/* File Icon */}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      {file.category === "autopsy" && <FileText className="w-6 h-6 text-red-400" />}
                      {file.category === "cctv" && <Video className="w-6 h-6 text-purple-400" />}
                      {file.category === "metadata" && <Database className="w-6 h-6 text-blue-400" />}
                      {file.category === "photos" && <ImageIcon className="w-6 h-6 text-cyan-400" />}
                      {file.category === "audio" && <Mic className="w-6 h-6 text-orange-400" />}
                      {file.category === "documents" && <File className="w-6 h-6 text-yellow-400" />}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold truncate">{file.name}</h3>
                          <p className="text-sm text-gray-400">{file.evidenceId}</p>
                        </div>
                        {file.status === "verified" ? (
                          <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-xs text-green-400 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/50 rounded-full text-xs text-orange-400 flex items-center gap-1 animate-pulse">
                            <Clock className="w-3 h-3" />
                            Processing
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">File Size</p>
                          <p className="text-gray-300">{file.size}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Uploaded By</p>
                          <p className="text-gray-300">{file.uploadedBy}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Upload Date</p>
                          <p className="text-gray-300">{file.date}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Upload Area */}
        <div className="grid grid-cols-3 gap-6">
          {/* Upload Zone */}
          <div className="col-span-2 space-y-6">
            {/* Hidden File Input */}
            <input 
              type="file" 
              accept=".pdf" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
            />

            {/* Drag & Drop Area */}
            <div
              className={`bg-black/40 backdrop-blur-xl border-2 border-dashed rounded-xl p-12 transition-all duration-300 cursor-pointer ${
                dragActive
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-600 hover:border-blue-500/50"
              }`}
              onDragEnter={() => setDragActive(true)}
              onDragLeave={() => setDragActive(false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                const file = e.dataTransfer.files?.[0];
                if (file && file.type === "application/pdf") {
                  processPdf(file);
                } else {
                  alert("Please drop a valid PDF file.");
                }
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                  <Upload className="w-10 h-10 text-blue-400" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl text-white font-semibold mb-2">
                    Drop PDF evidence file here
                  </h3>
                  <p className="text-gray-400 mb-4">or click to browse from your device</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all">
                    Select PDF File
                  </button>
                </div>
              </div>
            </div>

            {/* Extracted Text Result Area */}
            {(isExtracting || extractedText || extractError) && (
              <div className="bg-black/40 border border-blue-500/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
                    <FileText className="w-5 h-5" /> PDF Extraction Result
                  </h3>
                  {uploadedFileName && (
                    <span className="text-xs px-3 py-1 bg-white/5 border border-gray-700 rounded-full text-gray-300">
                      {uploadedFileName}
                    </span>
                  )}
                </div>
                
                {isExtracting && (
                  <div className="flex items-center justify-center py-8 text-gray-400 gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                    Extracting text from PDF...
                  </div>
                )}
                
                {extractError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {extractError}
                  </div>
                )}
                
                {extractedText && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-green-400 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Text extracted successfully
                      </p>
                      <button 
                        onClick={() => navigator.clipboard.writeText(extractedText)}
                        className="flex items-center gap-2 text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 text-gray-300 rounded transition-colors"
                      >
                        <Copy className="w-3 h-3" /> Copy Text
                      </button>
                    </div>
                    <textarea
                      readOnly
                      className="w-full h-32 bg-black/60 border border-gray-700 rounded-lg p-4 text-xs text-gray-300 focus:outline-none resize-none font-mono"
                      value={extractedText}
                    />
                    
                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-700/50 mt-4">
                      <button
                        onClick={handleGenerateReport}
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                      >
                        {isGenerating ? (
                          <div className="flex flex-col items-center">
                            <div className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Generating Case Report...</span>
                            </div>
                            <span className="text-[10px] opacity-70 mt-1 font-normal animate-pulse">This may take 1-2 minutes due to AI model processing</span>
                          </div>
                        ) : (
                          <><FileText className="w-4 h-4" /> Auto-Generate Case Report</>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}



            {/* Evidence Metadata Form */}
            <div className="bg-black/40 backdrop-blur-xl border border-gray-700 rounded-xl p-6">
              <h2 className="text-lg text-white font-semibold mb-6">Evidence Metadata</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    <Tag className="w-4 h-4 inline mr-2" />
                    Evidence ID
                  </label>
                  <input
                    type="text"
                    placeholder="EV-2026-001"
                    className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Collection Date
                  </label>
                  <input
                    type="date"
                    className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    <File className="w-4 h-4 inline mr-2" />
                    Classification of Files
                  </label>
                  <select className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
                    <option value="">Select file type...</option>
                    <option value="autopsy">Autopsy Reports</option>
                    <option value="cctv">CCTV Footage</option>
                    <option value="photo-video">Photo and Video Evidence</option>
                    <option value="audio">Audio Recordings</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Collected By
                  </label>
                  <input
                    type="text"
                    placeholder="Officer name"
                    className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    <Shield className="w-4 h-4 inline mr-2" />
                    Classification Level
                  </label>
                  <select className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
                    <option>Confidential</option>
                    <option>Secret</option>
                    <option>Top Secret</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Description</label>
                  <textarea
                    placeholder="Detailed description of evidence..."
                    rows={3}
                    className="w-full bg-white/5 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-lg transition-all">
                  Upload Evidence
                </button>
                <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-gray-700 rounded-lg transition-all">
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Chain of Custody & Recent Uploads */}
          <div className="space-y-6">
            {/* Chain of Custody */}
            <div className="bg-black/40 backdrop-blur-xl border border-orange-500/30 rounded-xl p-6">
              <h2 className="text-lg text-white font-semibold mb-6">Chain of Custody</h2>

              <div className="space-y-4">
                {[
                  { time: "14:23", action: "Evidence collected", user: "Officer Martinez" },
                  { time: "14:45", action: "Transferred to lab", user: "Tech Chen" },
                  { time: "15:20", action: "Digital scan complete", user: "System" },
                  { time: "Now", action: "Awaiting upload", user: "Agent Rodriguez" },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">{step.action}</p>
                      <p className="text-xs text-gray-400">{step.user} • {step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Uploads */}
            <div className="bg-black/40 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6">
              <h2 className="text-lg text-white font-semibold mb-6">Recent Uploads</h2>

              <div className="space-y-3">
                {recentUploads.map((upload, i) => (
                  <div key={i} className="bg-white/5 border border-gray-700 rounded-lg p-3 hover:bg-white/10 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium truncate">{upload.name}</p>
                        <p className="text-xs text-gray-400">{upload.category}</p>
                      </div>
                      {upload.status === "verified" ? (
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : (
                        <Clock className="w-5 h-5 text-orange-400 flex-shrink-0 animate-pulse" />
                      )}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{upload.size}</span>
                      <span>{upload.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
