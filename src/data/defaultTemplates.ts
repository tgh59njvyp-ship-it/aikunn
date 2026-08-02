import { WebProject, SlideDeck, ApiProject, DbProject, ServerConfig, ServerLog } from "../types";

export const defaultWebProject: WebProject = {
  title: "CloudFlow SaaS - All-in-One Platform",
  description: "次世代のクラウド開発・統合プラットフォーム",
  sections: [
    {
      id: "sec-hero",
      type: "hero",
      title: "次世代Web開発を、すべてこの一手に。",
      subtitle: "Webサイト、スライド、バックエンドAPI、データベースをシームレスに設計・構築",
      content: "プログラミングの学習からエンタープライズ製品のプロトタイピングまで。WebDev Studioでアイデアを数分でフルスタックプロダクトへと変換しましょう。",
      ctaText: "無料で今すぐ始める",
      ctaLink: "#pricing",
      badge: "🚀 WebDev Studio 2026 Release",
      bgStyle: "gradient",
    },
    {
      id: "sec-features",
      type: "features",
      title: "開発に必要なすべての機能を1つに集約",
      subtitle: "直感的なビジュアルエディタと強力なコード生成エンジン",
      items: [
        {
          title: "ビジュアルWebビルダー",
          desc: "ドラッグ＆ドロップで美しいレスポンシブWebサイトを迅速にデザイン。",
          icon: "Globe",
        },
        {
          title: "スライドプレゼンテーション",
          desc: "インタラクティブで洗練されたプレゼン資料をブラウザ上で作成・発表。",
          icon: "Presentation",
        },
        {
          title: "REST API & モックサーバー",
          desc: "視覚的にエンドポイントを設計し、リアルタイムでHTTPリクエストをテスト。",
          icon: "Zap",
        },
        {
          title: "ビジュアルデータベース",
          desc: "テーブル設計、データ登録、SQLクエリ生成を1つのUIで完結。",
          icon: "Database",
        },
      ],
      bgStyle: "default",
    },
    {
      id: "sec-stats",
      type: "stats",
      title: "世界中の開発者が信頼するパフォーマンス",
      subtitle: "スピードと安定性を両立した次世代スタック",
      items: [
        { title: "開発スピード", desc: "10x 高速化" },
        { title: "月間アクティブユーザー", desc: "150,000+" },
        { title: "作成されたAPIエンドポイント", desc: "1,200,000+" },
        { title: "アップタイム", desc: "99.99%" },
      ],
      bgStyle: "dark",
    },
    {
      id: "sec-pricing",
      type: "pricing",
      title: "シンプルで明瞭な料金プラン",
      subtitle: "個人開発から大規模チームまで柔軟に対応",
      items: [
        {
          title: "Starter",
          desc: "¥0 / 月 - 個人開発や学習に最適（全モジュール試用可能）",
          link: "無料ではじめる",
        },
        {
          title: "Pro",
          desc: "¥2,980 / 月 - AIアシスタント無制限＆カスタムドメイン連携",
          link: "14日間無料トライアル",
        },
        {
          title: "Enterprise",
          desc: "お問い合わせ - 専任サポート・SLA99.99%保障",
          link: "営業へ問い合わせ",
        },
      ],
      bgStyle: "default",
    },
    {
      id: "sec-footer",
      type: "footer",
      title: "WebDev Studio Inc.",
      subtitle: "© 2026 WebDev Studio All-in-One Cloud Platform. All rights reserved.",
      bgStyle: "dark",
    },
  ],
};

export const defaultSlideDeck: SlideDeck = {
  title: "次世代Web開発エコシステム 2026",
  theme: "modern",
  slides: [
    {
      id: "slide-1",
      layout: "title",
      title: "All-in-One Web Development Platform",
      subtitle: "Webサイト・API・DB・スライドを統合する新たな開発環境",
      notes: "発表開始時の導入スライド。全体のテーマを明快に提示します。",
    },
    {
      id: "slide-2",
      layout: "bullets",
      title: "従来の開発プロセスの課題",
      subtitle: "複数ツールの断片化によるコンテキストスイッチの増大",
      bullets: [
        "デザインツール、コードエディタ、APIクライアント、DB管理ツールの分散",
        "チーム間での仕様共有やプロトタイプ検証の遅延",
        "環境構築にかかる膨大なセットアップコスト",
      ],
      notes: "開発現場の課題感に共感を得るフェーズです。",
    },
    {
      id: "slide-3",
      layout: "code",
      title: "自動生成されるClean Architecture",
      subtitle: "AI Copilotとシームレスに連携したAPIとDB設計",
      code: `// Express REST API Endpoint Sample
app.get('/api/v1/users', async (req, res) => {
  const users = await db.select().from(usersTable);
  res.json({ success: true, count: users.length, data: users });
});`,
      notes: "実際のコード生成能力をアピールします。",
    },
    {
      id: "slide-4",
      layout: "stats",
      title: "圧倒的な生産性向上",
      subtitle: "開発ライフサイクル全体のベンチマーク結果",
      statNumber: "85%",
      statLabel: "プロトタイプ構築時間の削減率",
      notes: "定量的な導入効果を示す実績データです。",
    },
    {
      id: "slide-5",
      layout: "quote",
      title: "まとめ＆ネクストステップ",
      subtitle: "今すぐWebDev Studioで新しい開発体験を始めましょう",
      quote: "複雑な開発スタックから解放され、純粋なアイデアの実現に集中できます。",
      author: "WebDev Studio Lead Architect",
      notes: "まとめと質疑応答への切り替えです。",
    },
  ],
};

export const defaultApiProject: ApiProject = {
  baseUrl: "/api/v1",
  routes: [
    {
      id: "route-users-get",
      method: "GET",
      path: "/api/v1/users",
      summary: "ユーザー一覧を取得",
      status: 200,
      responseHeaders: { "Content-Type": "application/json" },
      responseBody: {
        success: true,
        total: 2,
        users: [
          { id: 1, name: "山田 太郎", email: "yamada@example.com", role: "admin", createdAt: "2026-08-01" },
          { id: 2, name: "佐藤 花子", email: "sato@example.com", role: "developer", createdAt: "2026-08-01" },
        ],
      },
    },
    {
      id: "route-users-post",
      method: "POST",
      path: "/api/v1/users",
      summary: "新規ユーザーを登録",
      status: 201,
      responseHeaders: { "Content-Type": "application/json" },
      responseBody: {
        success: true,
        message: "User created successfully",
        user: { id: 3, name: "新 規ユーザー", email: "newuser@example.com", role: "user", createdAt: "2026-08-01" },
      },
    },
    {
      id: "route-products-get",
      method: "GET",
      path: "/api/v1/products",
      summary: "商品カタログの検索",
      status: 200,
      responseHeaders: { "Content-Type": "application/json" },
      responseBody: {
        success: true,
        products: [
          { id: "p-01", title: "WebDev Studio Pro Plan", price: 2980, currency: "JPY", stock: 999 },
          { id: "p-02", title: "Cloud DB Addon", price: 1500, currency: "JPY", stock: 500 },
        ],
      },
    },
  ],
};

export const defaultDbProject: DbProject = {
  databaseName: "webdev_studio_db",
  tables: [
    {
      id: "tbl-users",
      name: "users",
      columns: [
        { name: "id", type: "INTEGER", primaryKey: true, nullable: false },
        { name: "name", type: "VARCHAR", primaryKey: false, nullable: false },
        { name: "email", type: "VARCHAR", primaryKey: false, nullable: false },
        { name: "role", type: "VARCHAR", primaryKey: false, nullable: false, defaultValue: "'user'" },
        { name: "created_at", type: "TIMESTAMP", primaryKey: false, nullable: false },
      ],
      rows: [
        { id: 1, name: "山田 太郎", email: "yamada@example.com", role: "admin", created_at: "2026-08-01 09:30:00" },
        { id: 2, name: "佐藤 花子", email: "sato@example.com", role: "developer", created_at: "2026-08-01 10:15:00" },
        { id: 3, name: "鈴木 一朗", email: "suzuki@example.com", role: "user", created_at: "2026-08-01 11:00:00" },
      ],
    },
    {
      id: "tbl-projects",
      name: "projects",
      columns: [
        { name: "id", type: "VARCHAR", primaryKey: true, nullable: false },
        { name: "user_id", type: "INTEGER", primaryKey: false, nullable: false },
        { name: "title", type: "VARCHAR", primaryKey: false, nullable: false },
        { name: "status", type: "VARCHAR", primaryKey: false, nullable: false, defaultValue: "'active'" },
      ],
      rows: [
        { id: "prj-101", user_id: 1, title: "SaaS Landing Page", status: "published" },
        { id: "prj-102", user_id: 2, title: "E-Commerce REST API", status: "active" },
      ],
    },
  ],
};

export const defaultServerConfig: ServerConfig = {
  port: 3000,
  isRunning: true,
  enableCors: true,
  enableAuth: false,
  rateLimit: 120,
  envVars: {
    NODE_ENV: "development",
    PORT: "3000",
    DATABASE_URL: "postgres://admin:secret@localhost:5432/webdev_studio_db",
  },
};

export const defaultServerLogs: ServerLog[] = [
  { id: "log-1", timestamp: "10:00:12", method: "GET", path: "/api/v1/users", status: 200, latencyMs: 14, ip: "127.0.0.1" },
  { id: "log-2", timestamp: "10:01:05", method: "POST", path: "/api/v1/users", status: 201, latencyMs: 28, ip: "127.0.0.1" },
  { id: "log-3", timestamp: "10:02:40", method: "GET", path: "/api/v1/products", status: 200, latencyMs: 9, ip: "192.168.1.10" },
  { id: "log-4", timestamp: "10:03:18", method: "GET", path: "/health", status: 200, latencyMs: 2, ip: "127.0.0.1" },
];
