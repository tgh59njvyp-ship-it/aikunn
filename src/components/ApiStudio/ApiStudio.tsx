import React, { useState } from "react";
import {
  Zap,
  Plus,
  Trash2,
  Send,
  Code,
  Check,
  Sparkles,
  Play,
  Clock,
  Layers,
  FileJson,
  Globe
} from "lucide-react";
import { ApiProject, ApiRoute, HttpMethod } from "../../types";

interface ApiStudioProps {
  apiProject: ApiProject;
  setApiProject: React.Dispatch<React.SetStateAction<ApiProject>>;
  onOpenAiModal: () => void;
}

export const ApiStudio: React.FC<ApiStudioProps> = ({
  apiProject,
  setApiProject,
  onOpenAiModal,
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(
    apiProject.routes[0]?.id || ""
  );
  const [requestBodyInput, setRequestBodyInput] = useState<string>('{\n  "name": "新規テストデータ"\n}');
  const [apiResponse, setApiResponse] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"designer" | "tester">("designer");

  const selectedRoute = apiProject.routes.find((r) => r.id === selectedRouteId) || apiProject.routes[0];

  const handleUpdateRoute = (updated: Partial<ApiRoute>) => {
    if (!selectedRoute) return;
    setApiProject((prev) => ({
      ...prev,
      routes: prev.routes.map((r) => (r.id === selectedRoute.id ? { ...r, ...updated } : r)),
    }));
  };

  const handleAddRoute = () => {
    const newId = `route-${Date.now().toString(36)}`;
    const newRoute: ApiRoute = {
      id: newId,
      method: "GET",
      path: `/api/v1/resource_${apiProject.routes.length + 1}`,
      summary: "新規APIエンドポイント",
      status: 200,
      responseHeaders: { "Content-Type": "application/json" },
      responseBody: {
        message: "Successful response from WebDev Studio API",
        timestamp: new Date().toISOString(),
      },
    };

    setApiProject((prev) => ({ ...prev, routes: [...prev.routes, newRoute] }));
    setSelectedRouteId(newId);
  };

  const handleDeleteRoute = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (apiProject.routes.length <= 1) return;
    const remaining = apiProject.routes.filter((r) => r.id !== id);
    setApiProject((prev) => ({ ...prev, routes: remaining }));
    if (selectedRouteId === id) {
      setSelectedRouteId(remaining[0]?.id || "");
    }
  };

  // Test live API call against the server sandbox endpoint
  const executeApiCall = async () => {
    if (!selectedRoute) return;
    setIsLoading(true);
    setApiResponse(null);

    try {
      let parsedRequest;
      try {
        parsedRequest = JSON.parse(requestBodyInput);
      } catch {
        parsedRequest = { rawInput: requestBodyInput };
      }

      const res = await fetch("/api/sandbox/execute-mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          route: selectedRoute,
          requestData: parsedRequest,
        }),
      });

      const data = await res.json();
      setApiResponse(data);
    } catch (err: any) {
      setApiResponse({ error: err.message || "Failed to execute request" });
    } finally {
      setIsLoading(false);
    }
  };

  const getMethodBadgeClass = (method: HttpMethod) => {
    switch (method) {
      case "GET":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "POST":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "PUT":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "DELETE":
        return "bg-rose-500/20 text-rose-300 border-rose-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  const [mobileTab, setMobileTab] = useState<"list" | "detail">("detail");

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] bg-slate-950 overflow-hidden">
      {/* Mobile Sub-Navigation Bar (visible only on mobile) */}
      <div className="flex md:hidden bg-slate-900 border-b border-slate-800 p-1.5 shrink-0 justify-around">
        <button
          onClick={() => setMobileTab("list")}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            mobileTab === "list" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>API一覧</span>
        </button>
        <button
          onClick={() => setMobileTab("detail")}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            mobileTab === "detail" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>設計・テスト</span>
        </button>
      </div>

      {/* Left Column: API Endpoints List */}
      <div
        className={`w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900 flex flex-col shrink-0 ${
          mobileTab === "list" ? "flex flex-1" : "hidden md:flex"
        }`}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-sm text-white">REST API 評価</span>
          </div>
          <button
            onClick={onOpenAiModal}
            className="text-xs flex items-center space-x-1 text-purple-400 hover:text-purple-300 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20"
          >
            <Sparkles className="w-3 h-3" />
            <span>AIで生成</span>
          </button>
        </div>

        {/* Route List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {apiProject.routes.map((route) => {
            const isSelected = route.id === selectedRouteId;
            return (
              <div
                key={route.id}
                onClick={() => {
                  setSelectedRouteId(route.id);
                  if (window.innerWidth < 768) setMobileTab("detail");
                }}
                className={`group flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? "bg-amber-500/10 border-amber-500 text-white shadow-sm"
                    : "bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <span className={`px-1.5 py-0.5 font-mono text-[10px] font-bold rounded border ${getMethodBadgeClass(route.method)}`}>
                    {route.method}
                  </span>
                  <div className="truncate font-mono text-[11px] text-slate-200">{route.path}</div>
                </div>

                <button
                  onClick={(e) => handleDeleteRoute(route.id, e)}
                  className="opacity-80 md:opacity-0 group-hover:opacity-100 p-1 text-rose-400 hover:bg-rose-500/20 rounded"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Add Endpoint Button */}
        <div className="p-3 border-t border-slate-800 bg-slate-900">
          <button
            onClick={handleAddRoute}
            className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>新規エンドポイント作成</span>
          </button>
        </div>
      </div>

      {/* Main Column: Designer / Tester Split View */}
      <div
        className={`flex-1 flex flex-col bg-slate-950 overflow-hidden ${
          mobileTab === "detail" ? "flex" : "hidden md:flex"
        }`}
      >
        {/* Mode Switcher Header */}
        <div className="h-12 border-b border-slate-800 bg-slate-900/60 px-3 sm:px-4 flex items-center justify-between shrink-0 gap-2">
          <div className="flex items-center space-x-1 sm:space-x-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setActiveTab("designer")}
              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center space-x-1 transition ${
                activeTab === "designer" ? "bg-amber-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>設計</span>
            </button>
            <button
              onClick={() => setActiveTab("tester")}
              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center space-x-1 transition ${
                activeTab === "tester" ? "bg-amber-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>テスト実行</span>
            </button>
          </div>

          {selectedRoute && (
            <div className="flex items-center space-x-1.5 font-mono text-[11px] sm:text-xs truncate">
              <span className={`px-1.5 py-0.5 font-bold rounded border ${getMethodBadgeClass(selectedRoute.method)}`}>
                {selectedRoute.method}
              </span>
              <span className="text-slate-300 truncate">{selectedRoute.path}</span>
            </div>
          )}
        </div>

        {/* Content Pane */}
        {selectedRoute && (
          <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
            {activeTab === "designer" ? (
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Method & Path Header */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
                  <h3 className="text-sm font-semibold text-slate-200">基本ルーティング設定</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">HTTP Method</label>
                      <select
                        value={selectedRoute.method}
                        onChange={(e) => handleUpdateRoute({ method: e.target.value as HttpMethod })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                        <option value="PATCH">PATCH</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-xs text-slate-400 mb-1">エンドポイントパス (URL Path)</label>
                      <input
                        type="text"
                        value={selectedRoute.path}
                        onChange={(e) => handleUpdateRoute({ path: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">概要・ドキュメントメモ</label>
                    <input
                      type="text"
                      value={selectedRoute.summary}
                      onChange={(e) => handleUpdateRoute({ summary: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* HTTP Status & Response Body Editor */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-200">レスポンス定義 (Response Body)</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-400">Status Code:</span>
                      <select
                        value={selectedRoute.status}
                        onChange={(e) => handleUpdateRoute({ status: Number(e.target.value) })}
                        className="bg-slate-950 border border-slate-700 rounded p-1 text-xs font-mono text-emerald-400"
                      >
                        <option value={200}>200 OK</option>
                        <option value={201}>201 Created</option>
                        <option value={400}>400 Bad Request</option>
                        <option value={404}>404 Not Found</option>
                        <option value={500}>500 Internal Error</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">モックJSONレスポンスデータ</label>
                    <textarea
                      rows={10}
                      value={JSON.stringify(selectedRoute.responseBody, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          handleUpdateRoute({ responseBody: parsed });
                        } catch {
                          // Allow typing freeform until valid JSON
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-emerald-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Tester Tab */
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 font-mono text-xs font-bold rounded border ${getMethodBadgeClass(selectedRoute.method)}`}>
                      {selectedRoute.method}
                    </span>
                    <input
                      type="text"
                      readOnly
                      value={`http://localhost:3000${selectedRoute.path}`}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-mono text-slate-300"
                    />
                    <button
                      onClick={executeApiCall}
                      disabled={isLoading}
                      className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5 shadow transition disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>{isLoading ? "実行中..." : "リクエスト送信"}</span>
                    </button>
                  </div>

                  {/* Optional Payload Body Input for POST/PUT */}
                  {(selectedRoute.method === "POST" || selectedRoute.method === "PUT") && (
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">リクエストペイロード (JSON Body)</label>
                      <textarea
                        rows={4}
                        value={requestBodyInput}
                        onChange={(e) => setRequestBodyInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 font-mono text-xs text-indigo-300 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  )}
                </div>

                {/* API Response Output Viewer */}
                {apiResponse && (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center space-x-3 text-xs">
                        <span className="font-semibold text-slate-300">HTTP Response</span>
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-mono rounded font-bold">
                          Status {apiResponse._sandboxMeta?.statusCode || selectedRoute.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-slate-400 font-mono">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{apiResponse._sandboxMeta?.latencyMs || 15} ms</span>
                      </div>
                    </div>

                    <pre className="p-4 bg-slate-950 rounded-lg font-mono text-xs text-emerald-300 overflow-x-auto border border-slate-800">
                      {JSON.stringify(apiResponse, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
