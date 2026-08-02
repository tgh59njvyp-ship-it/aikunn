import React, { useState } from "react";
import { Download, X, Globe, Presentation, Zap, Database, FileCode, Check } from "lucide-react";
import { WebProject, SlideDeck, ApiProject, DbProject } from "../types";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  webProject: WebProject;
  slideDeck: SlideDeck;
  apiProject: ApiProject;
  dbProject: DbProject;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  webProject,
  slideDeck,
  apiProject,
  dbProject,
}) => {
  const [downloadedFormat, setDownloadedFormat] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerDownload = (filename: string, content: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadedFormat(filename);
    setTimeout(() => setDownloadedFormat(null), 3000);
  };

  const handleExportWebHtml = () => {
    const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${webProject.title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 font-sans text-slate-100">
  ${webProject.sections.map(s => `<section class="py-16 px-6 text-center">
    <h2 class="text-3xl font-extrabold mb-3">${s.title}</h2>
    <p class="text-lg opacity-80 mb-6">${s.subtitle || ''}</p>
    <p class="max-w-2xl mx-auto opacity-70">${s.content || ''}</p>
  </section>`).join('\n')}
</body>
</html>`;

    triggerDownload("website.html", html, "text/html");
  };

  const handleExportSlideJson = () => {
    triggerDownload("presentation.json", JSON.stringify(slideDeck, null, 2), "application/json");
  };

  const handleExportOpenApi = () => {
    const openApi = {
      openapi: "3.0.0",
      info: { title: "WebDev Studio Generated API", version: "1.0.0" },
      paths: apiProject.routes.reduce((acc: any, r) => {
        acc[r.path] = {
          [r.method.toLowerCase()]: {
            summary: r.summary,
            responses: {
              [r.status]: {
                description: "Success",
                content: { "application/json": { example: r.responseBody } },
              },
            },
          },
        };
        return acc;
      }, {}),
    };

    triggerDownload("openapi-spec.json", JSON.stringify(openApi, null, 2), "application/json");
  };

  const handleExportSql = () => {
    const sql = dbProject.tables.map(t => {
      const cols = t.columns.map(c => `  "${c.name}" ${c.type}${c.primaryKey ? " PRIMARY KEY" : ""}`).join(",\n");
      return `CREATE TABLE "${t.name}" (\n${cols}\n);`;
    }).join("\n\n");

    triggerDownload("schema_migration.sql", sql, "text/plain");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">プロジェクトエクスポート</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <button
            onClick={handleExportWebHtml}
            className="w-full p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl flex items-center justify-between text-left text-xs transition"
          >
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-indigo-400" />
              <div>
                <span className="font-bold text-white block">Webサイト HTML バンドル</span>
                <span className="text-slate-400">Tailwind CSS 統合のindex.htmlファイル</span>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={handleExportSlideJson}
            className="w-full p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl flex items-center justify-between text-left text-xs transition"
          >
            <div className="flex items-center space-x-3">
              <Presentation className="w-5 h-5 text-purple-400" />
              <div>
                <span className="font-bold text-white block">プレゼンスライド JSON デッキ</span>
                <span className="text-slate-400">WebDev Presentation 互換データ</span>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={handleExportOpenApi}
            className="w-full p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl flex items-center justify-between text-left text-xs transition"
          >
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-amber-400" />
              <div>
                <span className="font-bold text-white block">OpenAPI v3.0 REST 仕様書</span>
                <span className="text-slate-400">Postman / Swagger 読み込み用 JSON</span>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={handleExportSql}
            className="w-full p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl flex items-center justify-between text-left text-xs transition"
          >
            <div className="flex items-center space-x-3">
              <Database className="w-5 h-5 text-cyan-400" />
              <div>
                <span className="font-bold text-white block">PostgreSQL / SQL DDL Migration</span>
                <span className="text-slate-400">テーブル定義＆サンプルレコード挿入SQL</span>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400" />
          </button>

          {downloadedFormat && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs rounded-lg flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>「{downloadedFormat}」をダウンロードしました！</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
