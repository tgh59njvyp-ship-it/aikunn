import React from "react";
import {
  Globe,
  Presentation,
  Zap,
  Database,
  Server,
  Sparkles,
  Download,
  Terminal,
  Activity,
  Code2
} from "lucide-react";
import { StudioModule } from "../types";

interface HeaderProps {
  activeModule: StudioModule;
  setActiveModule: (module: StudioModule) => void;
  onOpenAiModal: () => void;
  onOpenExportModal: () => void;
  isServerRunning: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeModule,
  setActiveModule,
  onOpenAiModal,
  onOpenExportModal,
  isServerRunning,
}) => {
  const navItems: { id: StudioModule; label: string; icon: React.ReactNode; countKey?: string }[] = [
    { id: "web", label: "Webサイト", icon: <Globe className="w-4 h-4" /> },
    { id: "slide", label: "スライド", icon: <Presentation className="w-4 h-4" /> },
    { id: "api", label: "API", icon: <Zap className="w-4 h-4" /> },
    { id: "database", label: "DB", icon: <Database className="w-4 h-4" /> },
    { id: "server", label: "サーバー", icon: <Server className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-lg shrink-0">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Logo Brand */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-sm sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  WebDev Studio
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  All-In-One
                </span>
              </div>
            </div>
          </div>

          {/* Module Navigation Tabs - Horizontal Scrollable on Mobile */}
          <nav className="flex items-center space-x-1 overflow-x-auto py-1 no-scrollbar shrink min-w-0">
            {navItems.map((item) => {
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveModule(item.id)}
                  className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                  }`}
                >
                  {item.icon}
                  <span className="text-[11px] sm:text-xs">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            {/* Live Server Status Pill */}
            <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs">
              <span className={`w-2 h-2 rounded-full ${isServerRunning ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
              <span className="text-slate-300 text-[11px] font-mono">
                {isServerRunning ? "Server :3000 Active" : "Server Stopped"}
              </span>
            </div>

            {/* AI Generator Button */}
            <button
              id="btn-ai-copilot"
              onClick={onOpenAiModal}
              className="flex items-center space-x-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-sm transition-all whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
              <span className="text-[11px] sm:text-xs">AI生成</span>
            </button>

            {/* Export Button */}
            <button
              id="btn-export-project"
              onClick={onOpenExportModal}
              className="flex items-center space-x-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline text-[11px] sm:text-xs">出力</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
