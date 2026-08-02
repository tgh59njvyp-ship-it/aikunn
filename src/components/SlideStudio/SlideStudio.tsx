import React, { useState, useEffect } from "react";
import {
  Presentation,
  Plus,
  Trash2,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layout,
  Code,
  FileText,
  Quote,
  BarChart,
  Palette,
  Play
} from "lucide-react";
import { SlideDeck, SlideItem, SlideLayout, SlideTheme } from "../../types";

interface SlideStudioProps {
  slideDeck: SlideDeck;
  setSlideDeck: React.Dispatch<React.SetStateAction<SlideDeck>>;
  onOpenAiModal: () => void;
}

export const SlideStudio: React.FC<SlideStudioProps> = ({
  slideDeck,
  setSlideDeck,
  onOpenAiModal,
}) => {
  const [selectedSlideId, setSelectedSlideId] = useState<string>(
    slideDeck.slides[0]?.id || ""
  );
  const [isPresenting, setIsPresenting] = useState<boolean>(false);
  const [presentIndex, setPresentIndex] = useState<number>(0);
  const [showNotes, setShowNotes] = useState<boolean>(false);

  const selectedSlide = slideDeck.slides.find((s) => s.id === selectedSlideId) || slideDeck.slides[0];
  const selectedIndex = slideDeck.slides.findIndex((s) => s.id === selectedSlideId);

  // Keyboard navigation for presentation mode
  useEffect(() => {
    if (!isPresenting) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Space") {
        setPresentIndex((prev) => Math.min(prev + 1, slideDeck.slides.length - 1));
      } else if (e.key === "ArrowLeft") {
        setPresentIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Escape") {
        setIsPresenting(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPresenting, slideDeck.slides.length]);

  const handleUpdateSlide = (updated: Partial<SlideItem>) => {
    if (!selectedSlide) return;
    setSlideDeck((prev) => ({
      ...prev,
      slides: prev.slides.map((s) => (s.id === selectedSlide.id ? { ...s, ...updated } : s)),
    }));
  };

  const handleAddSlide = (layout: SlideLayout) => {
    const newId = `slide-${Date.now().toString(36)}`;
    const newSlide: SlideItem = {
      id: newId,
      layout,
      title: layout === "title" ? "プレゼンテーションのタイトル" : "新しいスライド",
      subtitle: "サブタイトルメッセージを入力",
      bullets: layout === "bullets" ? ["ポイント 1", "ポイント 2", "ポイント 3"] : undefined,
      code: layout === "code" ? `// Code Example\nfunction hello() {\n  console.log("Hello WebDev Studio!");\n}` : undefined,
      quote: layout === "quote" ? "革新的なアイデアはシンプルなツールから生まれます。" : undefined,
      author: layout === "quote" ? "WebDev Creator" : undefined,
      statNumber: layout === "stats" ? "100%" : undefined,
      statLabel: layout === "stats" ? "完全クラウド統合" : undefined,
      notes: "発表用スピーカーノートをここに記録できます。",
    };

    setSlideDeck((prev) => ({ ...prev, slides: [...prev.slides, newSlide] }));
    setSelectedSlideId(newId);
  };

  const handleDeleteSlide = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (slideDeck.slides.length <= 1) return;
    const remaining = slideDeck.slides.filter((s) => s.id !== id);
    setSlideDeck((prev) => ({ ...prev, slides: remaining }));
    if (selectedSlideId === id) {
      setSelectedSlideId(remaining[0]?.id || "");
    }
  };

  const startPresentation = () => {
    setPresentIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setIsPresenting(true);
  };

  // Helper to render individual slide contents
  const renderSlideContent = (slide: SlideItem, theme: SlideTheme, isMini = false) => {
    let themeBg = "bg-slate-900 text-white border-slate-800";
    if (theme === "dark") themeBg = "bg-slate-950 text-slate-100 border-slate-900";
    if (theme === "clean") themeBg = "bg-slate-100 text-slate-900 border-slate-300";
    if (theme === "cyber") themeBg = "bg-indigo-950 text-cyan-200 border-indigo-800";
    if (theme === "editorial") themeBg = "bg-stone-900 text-amber-100 border-stone-800";

    return (
      <div className={`w-full h-full flex flex-col justify-between p-8 sm:p-12 relative overflow-hidden ${themeBg}`}>
        {/* Slide Header */}
        <div>
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-indigo-400 block mb-2">
            {slideDeck.title}
          </span>
          <h2 className={`font-extrabold tracking-tight ${isMini ? "text-sm" : "text-2xl sm:text-4xl"} mb-2`}>
            {slide.title}
          </h2>
          {slide.subtitle && (
            <p className={`opacity-75 ${isMini ? "text-[10px]" : "text-sm sm:text-lg"} mb-6`}>
              {slide.subtitle}
            </p>
          )}
        </div>

        {/* Slide Body by Layout */}
        <div className="flex-1 my-auto flex flex-col justify-center">
          {slide.layout === "bullets" && slide.bullets && (
            <ul className={`space-y-3 ${isMini ? "text-[10px]" : "text-base sm:text-xl"}`}>
              {slide.bullets.map((b, i) => (
                <li key={i} className="flex items-start space-x-3">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}

          {slide.layout === "code" && slide.code && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs sm:text-sm text-emerald-400 overflow-x-auto shadow-inner">
              <pre>{slide.code}</pre>
            </div>
          )}

          {slide.layout === "quote" && (
            <div className="border-l-4 border-indigo-500 pl-6 py-2 my-auto">
              <p className={`italic font-serif ${isMini ? "text-xs" : "text-xl sm:text-2xl"} mb-3`}>
                "{slide.quote}"
              </p>
              {slide.author && <p className="text-xs sm:text-sm text-indigo-400 font-sans">— {slide.author}</p>}
            </div>
          )}

          {slide.layout === "stats" && (
            <div className="text-center my-auto">
              <div className={`font-black text-indigo-400 ${isMini ? "text-2xl" : "text-6xl sm:text-8xl"} mb-2`}>
                {slide.statNumber}
              </div>
              <p className={`font-medium ${isMini ? "text-[10px]" : "text-lg sm:text-2xl"} opacity-80`}>
                {slide.statLabel}
              </p>
            </div>
          )}
        </div>

        {/* Slide Footer */}
        <div className="pt-4 border-t border-white/10 flex justify-between items-center text-[10px] opacity-50">
          <span>WebDev Studio Slides</span>
          <span>{slide.id}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-950 overflow-hidden">
      {/* Fullscreen Presentation Modal */}
      {isPresenting && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between">
          <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="px-3 py-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-white text-xs backdrop-blur"
            >
              {showNotes ? "ノート非表示" : "スピーカーノート"}
            </button>
            <button
              onClick={() => setIsPresenting(false)}
              className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-white backdrop-blur"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-6 relative">
            <div className="w-full max-w-6xl aspect-[16/9] shadow-2xl rounded-2xl overflow-hidden border border-slate-800">
              {renderSlideContent(slideDeck.slides[presentIndex], slideDeck.theme)}
            </div>

            {/* Speaker Notes Drawer */}
            {showNotes && (
              <div className="absolute bottom-6 left-6 bg-slate-900/90 text-slate-200 border border-slate-700 p-4 rounded-xl max-w-md text-xs backdrop-blur shadow-xl">
                <span className="font-bold text-indigo-400 block mb-1">Speaker Notes:</span>
                <p>{slideDeck.slides[presentIndex]?.notes || "ノートなし"}</p>
              </div>
            )}
          </div>

          {/* Presentation Nav Bar */}
          <div className="h-14 bg-slate-900 border-t border-slate-800 px-6 flex items-center justify-between text-white text-xs">
            <div className="flex items-center space-x-3">
              <button
                disabled={presentIndex === 0}
                onClick={() => setPresentIndex((prev) => Math.max(prev - 1, 0))}
                className="p-2 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>
                {presentIndex + 1} / {slideDeck.slides.length}
              </span>
              <button
                disabled={presentIndex === slideDeck.slides.length - 1}
                onClick={() => setPresentIndex((prev) => Math.min(prev + 1, slideDeck.slides.length - 1))}
                className="p-2 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <span className="text-slate-400 text-xs">
              キーボード: ← → または Spaceでスライド送りが可能 (Escで終了)
            </span>
          </div>
        </div>
      )}

      {/* Left Column: Slide Thumbnails List */}
      <div className="w-72 border-r border-slate-800 bg-slate-900 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Presentation className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-sm text-white">スライド一覧</span>
          </div>
          <button
            onClick={onOpenAiModal}
            className="text-xs flex items-center space-x-1 text-purple-400 hover:text-purple-300 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20"
          >
            <Sparkles className="w-3 h-3" />
            <span>AIスライド</span>
          </button>
        </div>

        {/* Thumbnails */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {slideDeck.slides.map((slide, idx) => {
            const isSelected = slide.id === selectedSlideId;
            return (
              <div
                key={slide.id}
                onClick={() => setSelectedSlideId(slide.id)}
                className={`group relative rounded-xl border p-2 cursor-pointer transition-all ${
                  isSelected
                    ? "border-purple-500 bg-purple-500/10 shadow-lg"
                    : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 text-[10px] text-slate-400">
                  <span className="font-mono">#{idx + 1}</span>
                  <span className="uppercase">{slide.layout}</span>
                  <button
                    onClick={(e) => handleDeleteSlide(slide.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-rose-400 hover:bg-rose-500/20 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <div className="aspect-[16/9] rounded-lg overflow-hidden border border-slate-800">
                  {renderSlideContent(slide, slideDeck.theme, true)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Slide Buttons */}
        <div className="p-3 border-t border-slate-800 bg-slate-900">
          <span className="text-[11px] font-semibold text-slate-400 block mb-2 uppercase">
            レイアウトを追加
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { layout: "bullets" as SlideLayout, label: "箇条書き" },
              { layout: "code" as SlideLayout, label: "コード表示" },
              { layout: "quote" as SlideLayout, label: "引用名言" },
              { layout: "stats" as SlideLayout, label: "実績数値" },
            ].map((btn) => (
              <button
                key={btn.layout}
                onClick={() => handleAddSlide(btn.layout)}
                className="flex items-center justify-center space-x-1 p-1.5 rounded bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white text-xs transition border border-slate-700/50"
              >
                <Plus className="w-3 h-3" />
                <span>{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Column: Slide Visual Editor */}
      <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
        {/* Slide Toolbar */}
        <div className="h-12 border-b border-slate-800 bg-slate-900/60 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-300">テーマ設定:</span>
            <div className="flex items-center space-x-1">
              {[
                { id: "modern" as SlideTheme, label: "Modern" },
                { id: "dark" as SlideTheme, label: "Dark" },
                { id: "clean" as SlideTheme, label: "Clean" },
                { id: "cyber" as SlideTheme, label: "Cyber" },
                { id: "editorial" as SlideTheme, label: "Editorial" },
              ].map((th) => (
                <button
                  key={th.id}
                  onClick={() => setSlideDeck((prev) => ({ ...prev, theme: th.id }))}
                  className={`px-2.5 py-1 rounded text-xs transition ${
                    slideDeck.theme === th.id
                      ? "bg-purple-600 text-white font-medium"
                      : "text-slate-400 hover:text-white bg-slate-800/80"
                  }`}
                >
                  {th.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startPresentation}
            className="flex items-center space-x-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md transition"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>スライドショー再生</span>
          </button>
        </div>

        {/* Slide Canvas Display */}
        <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center bg-slate-950">
          <div className="w-full max-w-4xl aspect-[16/9] shadow-2xl rounded-2xl overflow-hidden border border-slate-800">
            {selectedSlide && renderSlideContent(selectedSlide, slideDeck.theme)}
          </div>
        </div>
      </div>

      {/* Right Column: Slide Content Editor */}
      {selectedSlide && (
        <div className="w-80 border-l border-slate-800 bg-slate-900 flex flex-col shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <span className="font-semibold text-sm text-white">スライド編集</span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-purple-950 text-purple-300 rounded">
              {selectedSlide.layout}
            </span>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">スライドタイトル</label>
              <input
                type="text"
                value={selectedSlide.title || ""}
                onChange={(e) => handleUpdateSlide({ title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">サブタイトル</label>
              <input
                type="text"
                value={selectedSlide.subtitle || ""}
                onChange={(e) => handleUpdateSlide({ subtitle: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {selectedSlide.layout === "bullets" && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">箇条書き (1行1項目)</label>
                <textarea
                  rows={4}
                  value={selectedSlide.bullets?.join("\n") || ""}
                  onChange={(e) => handleUpdateSlide({ bullets: e.target.value.split("\n") })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-sans"
                />
              </div>
            )}

            {selectedSlide.layout === "code" && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">コードスニペット</label>
                <textarea
                  rows={6}
                  value={selectedSlide.code || ""}
                  onChange={(e) => handleUpdateSlide({ code: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-emerald-400 font-mono focus:outline-none focus:border-purple-500"
                />
              </div>
            )}

            {selectedSlide.layout === "quote" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">引用メッセージ</label>
                  <textarea
                    rows={3}
                    value={selectedSlide.quote || ""}
                    onChange={(e) => handleUpdateSlide({ quote: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">発言者 / 著者</label>
                  <input
                    type="text"
                    value={selectedSlide.author || ""}
                    onChange={(e) => handleUpdateSlide({ author: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </>
            )}

            {selectedSlide.layout === "stats" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">強調数値 (例: 99.9%)</label>
                  <input
                    type="text"
                    value={selectedSlide.statNumber || ""}
                    onChange={(e) => handleUpdateSlide({ statNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">数値のラベル説明</label>
                  <input
                    type="text"
                    value={selectedSlide.statLabel || ""}
                    onChange={(e) => handleUpdateSlide({ statLabel: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </>
            )}

            <div className="pt-3 border-t border-slate-800">
              <label className="block text-xs font-medium text-slate-300 mb-1">スピーカーノート</label>
              <textarea
                rows={3}
                value={selectedSlide.notes || ""}
                onChange={(e) => handleUpdateSlide({ notes: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
                placeholder="発表時に確認するメモ"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
