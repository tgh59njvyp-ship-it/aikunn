import React, { useState } from "react";
import {
  Globe,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Code,
  Edit3,
  Layers,
  Sparkles,
  Check,
  ChevronRight,
  HelpCircle
} from "lucide-react";
import { WebProject, WebSection, SectionType, BgStyle } from "../../types";

interface WebBuilderProps {
  project: WebProject;
  setProject: React.Dispatch<React.SetStateAction<WebProject>>;
  onOpenAiModal: () => void;
}

export const WebBuilder: React.FC<WebBuilderProps> = ({
  project,
  setProject,
  onOpenAiModal,
}) => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    project.sections[0]?.id || ""
  );
  const [viewportMode, setViewportMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [viewMode, setViewMode] = useState<"visual" | "code">("visual");
  const [copiedCode, setCopiedCode] = useState(false);

  const selectedSection = project.sections.find((s) => s.id === selectedSectionId) || project.sections[0];

  const handleUpdateSection = (updated: Partial<WebSection>) => {
    if (!selectedSection) return;
    setProject((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === selectedSection.id ? { ...sec, ...updated } : sec
      ),
    }));
  };

  const handleAddSection = (type: SectionType) => {
    const newId = `sec-${Date.now().toString(36)}`;
    const newSec: WebSection = {
      id: newId,
      type,
      title: type === "hero" ? "新規ヒーローセクション" : type === "features" ? "主な機能" : type === "pricing" ? "料金プラン" : "新規セクション",
      subtitle: "サブタイトルメッセージを入力してください",
      content: "ここに詳細な説明文やプロモーションコンテンツを記述します。",
      bgStyle: "default",
      items: type === "features" ? [
        { title: "特徴 1", desc: "ここに説明を記述" },
        { title: "特徴 2", desc: "ここに説明を記述" }
      ] : undefined
    };

    setProject((prev) => ({
      ...prev,
      sections: [...prev.sections, newSec],
    }));
    setSelectedSectionId(newId);
  };

  const handleDeleteSection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.sections.length <= 1) return;
    const remaining = project.sections.filter((s) => s.id !== id);
    setProject((prev) => ({ ...prev, sections: remaining }));
    if (selectedSectionId === id) {
      setSelectedSectionId(remaining[0]?.id || "");
    }
  };

  const handleMoveSection = (index: number, direction: "up" | "down", e: React.MouseEvent) => {
    e.stopPropagation();
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= project.sections.length) return;

    const newSections = [...project.sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    setProject((prev) => ({ ...prev, sections: newSections }));
  };

  // Generate full stand-alone HTML code for export/preview
  const generateFullHtml = () => {
    const renderedSections = project.sections.map((sec) => {
      let bgClass = "bg-white text-slate-900";
      if (sec.bgStyle === "gradient") bgClass = "bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white";
      else if (sec.bgStyle === "dark") bgClass = "bg-slate-900 text-white";
      else if (sec.bgStyle === "muted") bgClass = "bg-slate-100 text-slate-800";

      if (sec.type === "custom" && sec.customHtml) {
        return `<section class="py-12 ${bgClass}">${sec.customHtml}</section>`;
      }

      return `<section class="py-16 px-6 ${bgClass}">
  <div class="max-w-5xl mx-auto text-center">
    ${sec.badge ? `<span class="inline-block px-3 py-1 mb-4 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">${sec.badge}</span>` : ""}
    <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">${sec.title}</h2>
    ${sec.subtitle ? `<p class="text-lg opacity-80 mb-6 max-w-2xl mx-auto">${sec.subtitle}</p>` : ""}
    ${sec.content ? `<p class="text-base opacity-75 max-w-3xl mx-auto leading-relaxed mb-8">${sec.content}</p>` : ""}
    
    ${sec.ctaText ? `<a href="${sec.ctaLink || "#"}" class="inline-block px-6 py-3 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition shadow-lg">${sec.ctaText}</a>` : ""}
    
    ${sec.items && sec.items.length > 0 ? `
    <div class="grid grid-cols-1 md:grid-cols-${Math.min(sec.items.length, 3)} gap-6 mt-12 text-left">
      ${sec.items.map(item => `
        <div class="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <h3 class="text-lg font-bold mb-2">${item.title}</h3>
          <p class="text-sm opacity-80">${item.desc}</p>
        </div>
      `).join('')}
    </div>` : ""}
  </div>
</section>`;
    }).join('\n\n');

    return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 font-sans antialiased text-slate-100">
  ${renderedSections}
</body>
</html>`;
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(generateFullHtml());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const [mobileTab, setMobileTab] = useState<"structure" | "preview" | "properties">("preview");

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] bg-slate-950 overflow-hidden">
      {/* Mobile Sub-Navigation Bar (visible only on mobile) */}
      <div className="flex md:hidden bg-slate-900 border-b border-slate-800 p-1.5 shrink-0 justify-around">
        <button
          onClick={() => setMobileTab("structure")}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            mobileTab === "structure" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>ページ構造</span>
        </button>
        <button
          onClick={() => setMobileTab("preview")}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            mobileTab === "preview" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>プレビュー</span>
        </button>
        <button
          onClick={() => setMobileTab("properties")}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            mobileTab === "properties" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>プロパティ</span>
        </button>
      </div>

      {/* Left Column: Section Outline & Palette */}
      <div
        className={`w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900 flex flex-col shrink-0 ${
          mobileTab === "structure" ? "flex flex-1" : "hidden md:flex"
        }`}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-sm text-white">ページ構造</span>
          </div>
          <button
            onClick={onOpenAiModal}
            className="text-xs flex items-center space-x-1 text-purple-400 hover:text-purple-300 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20"
          >
            <Sparkles className="w-3 h-3" />
            <span>AIで構成</span>
          </button>
        </div>

        {/* Section List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {project.sections.map((section, idx) => {
            const isSelected = section.id === selectedSectionId;
            return (
              <div
                key={section.id}
                onClick={() => {
                  setSelectedSectionId(section.id);
                  if (window.innerWidth < 768) setMobileTab("properties");
                }}
                className={`group flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? "bg-indigo-600/20 border-indigo-500 text-white shadow-sm"
                    : "bg-slate-800/50 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <span className="text-[10px] font-mono text-slate-500 w-4">{idx + 1}</span>
                  <div className="truncate font-medium">{section.title || section.type}</div>
                </div>

                <div className="flex items-center space-x-1 opacity-80 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    disabled={idx === 0}
                    onClick={(e) => handleMoveSection(idx, "up", e)}
                    className="p-1 hover:bg-slate-700 rounded text-slate-400 disabled:opacity-30"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    disabled={idx === project.sections.length - 1}
                    onClick={(e) => handleMoveSection(idx, "down", e)}
                    className="p-1 hover:bg-slate-700 rounded text-slate-400 disabled:opacity-30"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteSection(section.id, e)}
                    className="p-1 hover:bg-rose-500/20 text-rose-400 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Section Palette */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90">
          <span className="text-[11px] font-semibold text-slate-400 block mb-2 uppercase tracking-wider">
            セクションを追加
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { type: "hero" as SectionType, label: "ヒーロー" },
              { type: "features" as SectionType, label: "機能一覧" },
              { type: "stats" as SectionType, label: "実績数値" },
              { type: "pricing" as SectionType, label: "料金プラン" },
              { type: "cta" as SectionType, label: "CTA行動換起" },
              { type: "custom" as SectionType, label: "カスタムHTML" },
            ].map((btn) => (
              <button
                key={btn.type}
                onClick={() => handleAddSection(btn.type)}
                className="flex items-center justify-center space-x-1.5 p-2 rounded bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white text-xs transition border border-slate-700/50"
              >
                <Plus className="w-3 h-3" />
                <span>{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Center Canvas Preview Area */}
      <div
        className={`flex-1 flex flex-col bg-slate-950 overflow-hidden ${
          mobileTab === "preview" ? "flex" : "hidden md:flex"
        }`}
      >
        {/* Canvas Toolbar */}
        <div className="h-12 border-b border-slate-800 bg-slate-900/60 px-3 sm:px-4 flex items-center justify-between shrink-0">
          {/* Viewport controls */}
          <div className="flex items-center space-x-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
            <button
              onClick={() => setViewportMode("desktop")}
              className={`p-1.5 rounded text-xs flex items-center space-x-1 ${
                viewportMode === "desktop" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => setViewportMode("tablet")}
              className={`p-1.5 rounded text-xs flex items-center space-x-1 ${
                viewportMode === "tablet" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              onClick={() => setViewportMode("mobile")}
              className={`p-1.5 rounded text-xs flex items-center space-x-1 ${
                viewportMode === "mobile" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>

          {/* Code vs Visual view switcher */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setViewMode("visual")}
                className={`p-1 rounded sm:p-1.5 text-xs flex items-center space-x-1 ${
                  viewMode === "visual" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="text-[11px] sm:text-xs">ビジュアル</span>
              </button>
              <button
                onClick={() => setViewMode("code")}
                className={`p-1 rounded sm:p-1.5 text-xs flex items-center space-x-1 ${
                  viewMode === "code" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span className="text-[11px] sm:text-xs">HTMLコード</span>
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Content */}
        <div className="flex-1 overflow-y-auto overflow-x-auto p-2 sm:p-6 flex justify-center bg-slate-950">
          {viewMode === "visual" ? (
            <div
              className={`transition-all duration-300 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl h-fit my-auto max-w-full ${
                viewportMode === "desktop"
                  ? "w-full max-w-5xl"
                  : viewportMode === "tablet"
                  ? "w-[768px]"
                  : "w-[375px]"
              }`}
            >
              <div className="p-2 bg-slate-800/90 border-b border-slate-700 flex items-center space-x-2 text-xs text-slate-400">
                <div className="flex space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex-1 bg-slate-900 text-slate-400 px-3 py-1 rounded-md text-[11px] font-mono truncate">
                  https://preview.webdev.studio/{project.title.toLowerCase().replace(/\s+/g, '-')}
                </div>
              </div>

              {/* Rendered Live Preview Sections */}
              <div className="divide-y divide-slate-800/50">
                {project.sections.map((sec) => {
                  const isSelected = sec.id === selectedSectionId;

                  let bgClass = "bg-slate-900 text-slate-100";
                  if (sec.bgStyle === "gradient") bgClass = "bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white";
                  else if (sec.bgStyle === "dark") bgClass = "bg-slate-950 text-white";
                  else if (sec.bgStyle === "muted") bgClass = "bg-slate-800/60 text-slate-200";

                  return (
                    <div
                      key={sec.id}
                      onClick={() => {
                        setSelectedSectionId(sec.id);
                      }}
                      className={`relative transition-all cursor-pointer ${bgClass} ${
                        isSelected ? "ring-2 ring-indigo-500 ring-inset" : "hover:opacity-95"
                      }`}
                    >
                      {/* Section label floating badge */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow z-10">
                          {sec.type} セクション (編集中)
                        </div>
                      )}

                      {sec.type === "custom" && sec.customHtml ? (
                        <div className="p-4 sm:p-8" dangerouslySetInnerHTML={{ __html: sec.customHtml }} />
                      ) : (
                        <div className="py-8 sm:py-12 px-4 sm:px-10 text-center max-w-4xl mx-auto">
                          {sec.badge && (
                            <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              {sec.badge}
                            </span>
                          )}
                          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight mb-2">
                            {sec.title}
                          </h2>
                          {sec.subtitle && (
                            <p className="text-xs sm:text-base opacity-80 mb-4 max-w-xl mx-auto">
                              {sec.subtitle}
                            </p>
                          )}
                          {sec.content && (
                            <p className="text-xs sm:text-sm opacity-70 leading-relaxed max-w-2xl mx-auto mb-6">
                              {sec.content}
                            </p>
                          )}

                          {sec.ctaText && (
                            <button className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition">
                              {sec.ctaText}
                            </button>
                          )}

                          {sec.items && sec.items.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8 text-left">
                              {sec.items.map((item, i) => (
                                <div key={i} className="p-3.5 sm:p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                                  <h3 className="font-semibold text-xs mb-1 text-indigo-300">{item.title}</h3>
                                  <p className="text-[11px] opacity-75">{item.desc}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
              <div className="p-3 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-300">Generated index.html</span>
                <button
                  onClick={copyCodeToClipboard}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded flex items-center space-x-1"
                >
                  {copiedCode ? <Check className="w-3 h-3" /> : <Code className="w-3 h-3" />}
                  <span>{copiedCode ? "コピー完了" : "コードをコピー"}</span>
                </button>
              </div>
              <pre className="p-4 overflow-x-auto font-mono text-xs text-indigo-200 leading-relaxed bg-slate-950">
                {generateFullHtml()}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Selected Section Inspector */}
      {selectedSection && (
        <div
          className={`w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-800 bg-slate-900 flex flex-col shrink-0 overflow-y-auto ${
            mobileTab === "properties" ? "flex flex-1" : "hidden md:flex"
          }`}
        >
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Edit3 className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold text-sm text-white">プロパティ編集</span>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-slate-800 text-slate-300 rounded">
              {selectedSection.type}
            </span>
          </div>

          <div className="p-4 space-y-4">
            {/* Title input */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">メインタイトル</label>
              <input
                type="text"
                value={selectedSection.title || ""}
                onChange={(e) => handleUpdateSection({ title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Subtitle input */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">サブタイトル</label>
              <input
                type="text"
                value={selectedSection.subtitle || ""}
                onChange={(e) => handleUpdateSection({ subtitle: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Badge input */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">バッジテキスト (任意)</label>
              <input
                type="text"
                value={selectedSection.badge || ""}
                onChange={(e) => handleUpdateSection({ badge: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                placeholder="例: New Feature 2026"
              />
            </div>

            {/* Main content textarea */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">本文テキスト</label>
              <textarea
                rows={3}
                value={selectedSection.content || ""}
                onChange={(e) => handleUpdateSection({ content: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Background Style selector */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">背景スタイル</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "default" as BgStyle, label: "標準 (ダーク)" },
                  { id: "gradient" as BgStyle, label: "グラデーション" },
                  { id: "dark" as BgStyle, label: "漆黒 (Darker)" },
                  { id: "muted" as BgStyle, label: "ミュート" },
                ].map((style) => (
                  <button
                    key={style.id}
                    onClick={() => handleUpdateSection({ bgStyle: style.id })}
                    className={`py-1.5 px-2 rounded text-[11px] font-medium border text-center transition ${
                      selectedSection.bgStyle === style.id
                        ? "bg-indigo-600 border-indigo-500 text-white"
                        : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Button Text & Link */}
            <div className="pt-2 border-t border-slate-800 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">CTAボタン名</label>
                <input
                  type="text"
                  value={selectedSection.ctaText || ""}
                  onChange={(e) => handleUpdateSection({ ctaText: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  placeholder="例: 今すぐ試す"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">ボタンリンク URL</label>
                <input
                  type="text"
                  value={selectedSection.ctaLink || ""}
                  onChange={(e) => handleUpdateSection({ ctaLink: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  placeholder="#"
                />
              </div>
            </div>

            {/* Custom HTML editor for custom sections */}
            {selectedSection.type === "custom" && (
              <div className="pt-2 border-t border-slate-800">
                <label className="block text-xs font-medium text-slate-300 mb-1">カスタムHTMLコード</label>
                <textarea
                  rows={6}
                  value={selectedSection.customHtml || ""}
                  onChange={(e) => handleUpdateSection({ customHtml: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 font-mono text-[11px] text-indigo-300 focus:outline-none focus:border-indigo-500"
                  placeholder="<div>カスタム要素</div>"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
