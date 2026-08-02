import React, { useState } from "react";
import { Header } from "./components/Header";
import { WebBuilder } from "./components/WebBuilder/WebBuilder";
import { SlideStudio } from "./components/SlideStudio/SlideStudio";
import { ApiStudio } from "./components/ApiStudio/ApiStudio";
import { DatabaseStudio } from "./components/DatabaseStudio/DatabaseStudio";
import { ServerSandbox } from "./components/ServerSandbox/ServerSandbox";
import { AiCopilotModal } from "./components/AiCopilot/AiCopilotModal";
import { ExportModal } from "./components/ExportModal";

import {
  StudioModule,
  WebProject,
  SlideDeck,
  ApiProject,
  DbProject,
  ServerConfig,
  ServerLog,
} from "./types";

import {
  defaultWebProject,
  defaultSlideDeck,
  defaultApiProject,
  defaultDbProject,
  defaultServerConfig,
  defaultServerLogs,
} from "./data/defaultTemplates";

export default function App() {
  const [activeModule, setActiveModule] = useState<StudioModule>("web");

  // Studio Module States
  const [webProject, setWebProject] = useState<WebProject>(defaultWebProject);
  const [slideDeck, setSlideDeck] = useState<SlideDeck>(defaultSlideDeck);
  const [apiProject, setApiProject] = useState<ApiProject>(defaultApiProject);
  const [dbProject, setDbProject] = useState<DbProject>(defaultDbProject);

  // Server Sandbox States
  const [serverConfig, setServerConfig] = useState<ServerConfig>(defaultServerConfig);
  const [serverLogs, setServerLogs] = useState<ServerLog[]>(defaultServerLogs);

  // Modals
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Header Navigation */}
      <Header
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        isServerRunning={serverConfig.isRunning}
      />

      {/* Main Studio Workspace Module view */}
      <main className="flex-1 relative overflow-hidden">
        {activeModule === "web" && (
          <WebBuilder
            project={webProject}
            setProject={setWebProject}
            onOpenAiModal={() => setIsAiModalOpen(true)}
          />
        )}

        {activeModule === "slide" && (
          <SlideStudio
            slideDeck={slideDeck}
            setSlideDeck={setSlideDeck}
            onOpenAiModal={() => setIsAiModalOpen(true)}
          />
        )}

        {activeModule === "api" && (
          <ApiStudio
            apiProject={apiProject}
            setApiProject={setApiProject}
            onOpenAiModal={() => setIsAiModalOpen(true)}
          />
        )}

        {activeModule === "database" && (
          <DatabaseStudio
            dbProject={dbProject}
            setDbProject={setDbProject}
            onOpenAiModal={() => setIsAiModalOpen(true)}
          />
        )}

        {activeModule === "server" && (
          <ServerSandbox
            serverConfig={serverConfig}
            setServerConfig={setServerConfig}
            serverLogs={serverLogs}
            setServerLogs={setServerLogs}
          />
        )}
      </main>

      {/* AI Copilot Generator Modal */}
      <AiCopilotModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        activeModule={activeModule}
        setWebProject={setWebProject}
        setSlideDeck={setSlideDeck}
        setApiProject={setApiProject}
        setDbProject={setDbProject}
      />

      {/* Export / Download Project Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        webProject={webProject}
        slideDeck={slideDeck}
        apiProject={apiProject}
        dbProject={dbProject}
      />
    </div>
  );
}
