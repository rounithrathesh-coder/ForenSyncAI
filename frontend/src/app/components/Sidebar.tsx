import {
  LayoutDashboard,
  Upload,
  Brain,
  Clock,
  Shield,
  FileText
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Upload, label: "Evidence Upload", id: "evidence-upload" },
  { icon: Brain, label: "AI Analysis", id: "ai-analysis" },
  { icon: Clock, label: "Timeline Reconstruction", id: "timeline" },
  { icon: Shield, label: "Risk Assessment", id: "risk" },
  { icon: FileText, label: "Case Reports", id: "reports" }
];

interface SidebarProps {
  activePage: string;
  onNavigate: (pageId: string) => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <div className="w-64 h-full bg-black/40 backdrop-blur-xl border-r border-blue-500/20 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-red-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wider">FORENSYNC</h1>
            <p className="text-xs text-blue-400">Forensic Intelligence</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
              activePage === item.id
                ? "bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/50 text-white shadow-lg shadow-red-500/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <span className="text-sm text-left leading-tight">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
