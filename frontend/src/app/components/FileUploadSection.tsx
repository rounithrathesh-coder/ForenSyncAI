import { FileText, Camera, Database, Image, Mic, Upload } from "lucide-react";

const uploadTypes = [
  { icon: FileText, label: "Autopsy Reports", color: "red" },
  { icon: Camera, label: "CCTV Footage", color: "purple" },
  { icon: Database, label: "Metadata CSV", color: "blue" },
  { icon: Image, label: "Photo Evidence", color: "cyan" },
  { icon: Mic, label: "Audio Records", color: "orange" },
];

export function FileUploadSection() {
  return (
    <div className="bg-black/40 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6">
      <h2 className="text-lg text-white font-semibold mb-6">Evidence Upload</h2>

      <div className="grid grid-cols-3 gap-4">
        {uploadTypes.map((type) => (
          <div
            key={type.label}
            className="bg-white/5 border-2 border-dashed border-gray-600 rounded-lg p-6 hover:border-blue-500/50 hover:bg-white/10 transition-all cursor-pointer group"
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${
                  type.color === "red"
                    ? "from-red-500/20 to-red-600/20"
                    : type.color === "purple"
                    ? "from-purple-500/20 to-purple-600/20"
                    : type.color === "blue"
                    ? "from-blue-500/20 to-blue-600/20"
                    : type.color === "cyan"
                    ? "from-cyan-500/20 to-cyan-600/20"
                    : "from-orange-500/20 to-orange-600/20"
                } rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <type.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-gray-300 text-center">{type.label}</p>
              <Upload className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
