import { useState, useEffect } from "react";
import { Search, Bell, User } from "lucide-react";

export function TopBar() {
  const [username, setUsername] = useState("Agent Rodriguez");

  useEffect(() => {
    const storedUsername = localStorage.getItem("loggedInUsername");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="h-16 bg-black/40 backdrop-blur-xl border-b border-blue-500/20 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search case files, evidence, reports..."
            className="w-full bg-white/5 border border-blue-500/30 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-6">
        {/* Active Case */}
        <div className="px-4 py-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-lg">
          <p className="text-xs text-gray-400">Active Case</p>
          <p className="text-sm text-white font-mono">INV-2026-4782</p>
        </div>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
          <div className="text-right">
            <p className="text-sm text-white capitalize">{username}</p>
            <p className="text-xs text-gray-400">Lead Investigator</p>
          </div>
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
