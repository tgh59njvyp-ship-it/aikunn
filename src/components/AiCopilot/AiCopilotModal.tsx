import React, { useState } from "react";
import { Sparkles, X, Globe, Presentation, Zap, Database, ArrowRight, Loader2 } from "lucide-react";
import { StudioModule, WebProject, SlideDeck, ApiProject, DbProject } from "../../types";

interface AiCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule: StudioModule;
  setWebProject: React.Dispatch<React.SetStateAction<WebProject>>;
  setSlideDeck: React.Dispatch<React.SetStateAction<SlideDeck>>;
  setApiProject: React.Dispatch<React.SetStateAction<ApiProject>>;
  setDbProject: React.Dispatch<React.SetStateAction<DbProject>>;
}

export const AiCopilotModal: React.FC<AiCopilotModalProps> = ({
  isOpen,
  onClose,
  activeModule,
  setWebProject,
  setSlideDeck,
  setApiProject,
  setDbProject,
}) => {
  const [prompt, setPrompt] = useState<string>("");
  const [selectedType, setSelectedType] = useState<StudioModule>(activeModule);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts: Record<StudioModule, string[]> = {
    web: [
      "AI動画編集ツールのSaaSランディングページ（ヒーロー、機能一覧、料金表、CTA）",
      "カフェ＆ベーカリーのオシャレな店舗紹介Webサイト",
      "フリーランスエンジニアのモダンなポートフォリオサイト",
    ],
    slide: [
      "2026年Web開発トレンドとAI活用のプレゼンテーション（5スライド）",
      "新規スタートアッププロダクトの投資家向けピッチデッキ",
      "クラウドセキュリティ基本研修用スライド",
    ],
    api: [
      "ECサイト用のREST API（ユーザー一覧、商品カタログ、注文作成エンドポイント）",
      "タスク管理アプリ用のAPI（ToDo追加、ステータス変更、削除）",
      "AIチャットアシスタント用バックエンドAPI",
    ],
    database: [
      "オンラインスクールの受講生・講座・支払い管理データベーススキーマ",
      "SNSアプリのユーザー・投稿・いいね・コメント構造",
      "在庫管理・出荷追跡システム用のテーブル設計",
    ],
    server: [
      "Node.js Express 認証・認可サーバー構造の自動設計",
    ],
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          type: selectedType,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "生成処理に失敗しました");
      }

      const result = data.result;

      if (selectedType === "web") {
        if (Array.isArray(result)) {
          setWebProject((prev) => ({
            ...prev,
            title: prompt.slice(0, 30),
            sections: result,
          }));
        }
      } else if (selectedType === "slide") {
        if (result.slides) {
          setSlideDeck(result);
        }
      } else if (selectedType === "api") {
        if (result.routes) {
          setApiProject((prev) => ({
            ...prev,
            routes: result.routes,
          }));
        }
      } else if (selectedType === "database") {
        if (result.tables) {
          setDbProject((prev) => ({
            ...prev,
            tables: result.tables,
          }));
        }
      }

      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "AI生成エラーが発生しました");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Copilot 生成アシスタント</h2>
              <p className="text-xs text-slate-400">Gemini 3.6 Flash が一括で仕様・コードを生成します</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Target Module Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">生成対象モジュール</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "web" as StudioModule, label: "Webサイト", icon: <Globe className="w-3.5 h-3.5" /> },
                { id: "slide" as StudioModule, label: "スライド", icon: <Presentation className="w-3.5 h-3.5" /> },
                { id: "api" as StudioModule, label: "REST API", icon: <Zap className="w-3.5 h-3.5" /> },
                { id: "database" as StudioModule, label: "データベース", icon: <Database className="w-3.5 h-3.5" /> },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedType(m.id)}
                  className={`flex items-center justify-center space-x-1.5 p-2.5 rounded-lg border text-xs font-medium transition ${
                    selectedType === m.id
                      ? "bg-purple-600 border-purple-500 text-white shadow-md"
                      : "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {m.icon}
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">プロンプトを入力</label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="例: オンラインAIスクール向けのSaaSページとユーザー管理APIを構築して"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Quick Prompts Suggestions */}
          <div>
            <span className="block text-[11px] font-semibold text-slate-400 mb-2 uppercase">クイックプロンプト例</span>
            <div className="space-y-1.5">
              {quickPrompts[selectedType]?.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(qp)}
                  className="w-full text-left p-2 rounded bg-slate-800/50 hover:bg-slate-800 border border-slate-800/80 text-xs text-slate-300 hover:text-white transition flex items-center justify-between"
                >
                  <span className="truncate">{qp}</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800"
          >
            キャンセル
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center space-x-2 shadow-lg transition disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI生成中...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>1クリック生成</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
