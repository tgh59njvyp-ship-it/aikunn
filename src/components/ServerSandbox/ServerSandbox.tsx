import React, { useState, useEffect } from "react";
import {
  Server,
  Play,
  Square,
  Activity,
  Terminal,
  Cpu,
  HardDrive,
  Globe,
  Shield,
  Code,
  Check,
  RefreshCw,
  Layers,
  Zap
} from "lucide-react";
import { ServerConfig, ServerLog, ServerMetrics } from "../../types";

interface ServerSandboxProps {
  serverConfig: ServerConfig;
  setServerConfig: React.Dispatch<React.SetStateAction<ServerConfig>>;
  serverLogs: ServerLog[];
  setServerLogs: React.Dispatch<React.SetStateAction<ServerLog[]>>;
}

export const ServerSandbox: React.FC<ServerSandboxProps> = ({
  serverConfig,
  setServerConfig,
  serverLogs,
  setServerLogs,
}) => {
  const [activeTab, setActiveTab] = useState<"logs" | "metrics" | "config" | "code">("logs");
  const [metrics, setMetrics] = useState<ServerMetrics>({
    cpuUsage: 12,
    memoryUsage: 48,
    requestRate: 24,
    activeConnections: 6,
  });
  const [copiedCode, setCopiedCode] = useState(false);

  // Simulate real-time metrics fluctuation when server is running
  useEffect(() => {
    if (!serverConfig.isRunning) return;

    const interval = setInterval(() => {
      setMetrics({
        cpuUsage: Math.min(100, Math.max(5, Math.floor(15 + Math.random() * 20))),
        memoryUsage: Math.min(100, Math.max(30, Math.floor(45 + Math.random() * 8))),
        requestRate: Math.floor(18 + Math.random() * 30),
        activeConnections: Math.floor(4 + Math.random() * 8),
      });

      // Periodically append a simulated log if running
      if (Math.random() > 0.6) {
        const methods = ["GET", "POST", "GET", "PUT", "DELETE"] as const;
        const paths = ["/api/v1/users", "/api/v1/products", "/health", "/api/v1/orders"];
        const method = methods[Math.floor(Math.random() * methods.length)];
        const path = paths[Math.floor(Math.random() * paths.length)];
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

        const newLog: ServerLog = {
          id: `log-${Date.now()}`,
          timestamp: timeStr,
          method,
          path,
          status: Math.random() > 0.9 ? 404 : 200,
          latencyMs: Math.floor(5 + Math.random() * 30),
          ip: "127.0.0.1",
        };

        setServerLogs((prev) => [newLog, ...prev.slice(0, 49)]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [serverConfig.isRunning, setServerLogs]);

  const toggleServer = () => {
    setServerConfig((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const generateNodeServerCode = () => {
    return `import express from "express";
import cors from "cors";

const app = express();
const PORT = ${serverConfig.port};

${serverConfig.enableCors ? "app.use(cors());" : "// CORS Disabled"}
app.use(express.json());

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Generated REST Routes
app.get("/api/v1/users", (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: "山田 太郎", role: "admin" },
      { id: 2, name: "佐藤 花子", role: "developer" }
    ]
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(\`🚀 Server listening on http://0.0.0.0:\${PORT}\`);
});`;
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generateNodeServerCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-950 overflow-hidden">
      {/* Top Controller Bar */}
      <div className="h-16 border-b border-slate-800 bg-slate-900 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Server className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-white text-sm sm:text-base">WebDev Node.js Express Runtime</span>
          </div>

          <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 text-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${serverConfig.isRunning ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
            <span className="font-mono text-slate-200">
              {serverConfig.isRunning ? `ONLINE : Port ${serverConfig.port}` : "OFFLINE"}
            </span>
          </div>
        </div>

        <button
          onClick={toggleServer}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 transition shadow-lg ${
            serverConfig.isRunning
              ? "bg-rose-600 hover:bg-rose-500 text-white"
              : "bg-emerald-600 hover:bg-emerald-500 text-white"
          }`}
        >
          {serverConfig.isRunning ? <Square className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
          <span>{serverConfig.isRunning ? "サーバー停止" : "サーバー起動"}</span>
        </button>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
        {/* Left Subnav */}
        <div className="w-full sm:w-56 bg-slate-900/80 border-b sm:border-b-0 sm:border-r border-slate-800 p-3 space-y-1 shrink-0">
          {[
            { id: "logs" as const, label: "アクセスログ", icon: <Terminal className="w-4 h-4" /> },
            { id: "metrics" as const, label: "システムリソース", icon: <Activity className="w-4 h-4" /> },
            { id: "config" as const, label: "サーバー設定", icon: <Shield className="w-4 h-4" /> },
            { id: "code" as const, label: "server.js コード", icon: <Code className="w-4 h-4" /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                activeTab === item.id
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-950">
          {activeTab === "logs" ? (
            <div className="max-w-5xl mx-auto space-y-4">
              <div className="flex items-center justify-between bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs font-semibold text-slate-300">Live Access Logs Console</span>
                <button
                  onClick={() => setServerLogs([])}
                  className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>ログ消去</span>
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 min-h-[400px] shadow-2xl space-y-2">
                {serverLogs.length === 0 ? (
                  <p className="text-slate-500 italic">ログレコードはありません。</p>
                ) : (
                  serverLogs.map((log) => (
                    <div key={log.id} className="flex items-center space-x-3 hover:bg-slate-800/40 p-1 rounded transition">
                      <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        log.method === "GET" ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"
                      }`}>
                        {log.method}
                      </span>
                      <span className="text-slate-200 flex-1">{log.path}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                        log.status === 200 || log.status === 201 ? "bg-emerald-950 text-emerald-300" : "bg-rose-950 text-rose-300"
                      }`}>
                        {log.status}
                      </span>
                      <span className="text-slate-400 text-[11px]">{log.latencyMs}ms</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : activeTab === "metrics" ? (
            <div className="max-w-4xl mx-auto space-y-6">
              <h3 className="text-sm font-semibold text-slate-200">リアルタイムサーバーパフォーマンス</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-lg space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>CPU 使用率</span>
                    <Cpu className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white font-mono">
                    {serverConfig.isRunning ? `${metrics.cpuUsage}%` : "0%"}
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full transition-all duration-500"
                      style={{ width: `${serverConfig.isRunning ? metrics.cpuUsage : 0}%` }}
                    />
                  </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-lg space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>RAM メモリ</span>
                    <HardDrive className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white font-mono">
                    {serverConfig.isRunning ? `${metrics.memoryUsage}%` : "0%"}
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-500 h-full transition-all duration-500"
                      style={{ width: `${serverConfig.isRunning ? metrics.memoryUsage : 0}%` }}
                    />
                  </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-lg space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>リクエスト数 / 秒</span>
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white font-mono">
                    {serverConfig.isRunning ? metrics.requestRate : 0} req/s
                  </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-lg space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>アクティブ接続数</span>
                    <Globe className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white font-mono">
                    {serverConfig.isRunning ? metrics.activeConnections : 0} socket
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === "config" ? (
            <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl">
              <h3 className="text-sm font-semibold text-slate-200">サーバーミドルウェア＆環境設定</h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div>
                    <span className="font-semibold text-white block">CORS Cross-Origin リクエスト許可</span>
                    <span className="text-slate-400">外部ドメインからのAPIアクセスを許容</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={serverConfig.enableCors}
                    onChange={(e) => setServerConfig({ ...serverConfig, enableCors: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div>
                    <span className="font-semibold text-white block">Bearer Token 認証ミドルウェア</span>
                    <span className="text-slate-400">Authorization ヘッダー要求のシミュレーション</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={serverConfig.enableAuth}
                    onChange={(e) => setServerConfig({ ...serverConfig, enableAuth: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-xs font-mono text-slate-300">Generated Express server.js</span>
                <button
                  onClick={copyCode}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded flex items-center space-x-1"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Code className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? "コピー完了" : "コードをコピー"}</span>
                </button>
              </div>

              <pre className="p-4 bg-slate-900 rounded-xl font-mono text-xs text-indigo-300 overflow-x-auto border border-slate-800 leading-relaxed shadow-xl">
                {generateNodeServerCode()}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
