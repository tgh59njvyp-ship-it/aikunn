export type StudioModule = "web" | "slide" | "api" | "database" | "server";

// Web Builder Types
export type SectionType = "hero" | "features" | "stats" | "pricing" | "cta" | "contact" | "footer" | "custom";
export type BgStyle = "default" | "gradient" | "dark" | "muted";

export interface WebItem {
  title: string;
  desc: string;
  icon?: string;
  link?: string;
}

export interface WebSection {
  id: string;
  type: SectionType;
  title: string;
  subtitle?: string;
  content?: string;
  ctaText?: string;
  ctaLink?: string;
  badge?: string;
  items?: WebItem[];
  bgStyle?: BgStyle;
  customHtml?: string;
}

export interface WebProject {
  title: string;
  description: string;
  sections: WebSection[];
}

// Slide Studio Types
export type SlideLayout = "title" | "bullets" | "split" | "quote" | "code" | "stats";
export type SlideTheme = "modern" | "dark" | "clean" | "cyber" | "editorial";

export interface SlideItem {
  id: string;
  layout: SlideLayout;
  title: string;
  subtitle?: string;
  bullets?: string[];
  code?: string;
  quote?: string;
  author?: string;
  statNumber?: string;
  statLabel?: string;
  notes?: string;
}

export interface SlideDeck {
  title: string;
  theme: SlideTheme;
  slides: SlideItem[];
}

// API Studio Types
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface ApiRoute {
  id: string;
  method: HttpMethod;
  path: string;
  summary: string;
  status: number;
  responseHeaders: Record<string, string>;
  responseBody: any;
}

export interface ApiProject {
  baseUrl: string;
  routes: ApiRoute[];
}

// Database Studio Types
export type ColumnType = "INTEGER" | "VARCHAR" | "TEXT" | "BOOLEAN" | "TIMESTAMP" | "DECIMAL";

export interface DbColumn {
  name: string;
  type: ColumnType;
  primaryKey: boolean;
  nullable: boolean;
  defaultValue?: string;
}

export interface DbTable {
  id: string;
  name: string;
  columns: DbColumn[];
  rows: Record<string, any>[];
}

export interface DbProject {
  databaseName: string;
  tables: DbTable[];
}

// Server Sandbox Types
export interface ServerConfig {
  port: number;
  isRunning: boolean;
  enableCors: boolean;
  enableAuth: boolean;
  rateLimit: number; // requests per min
  envVars: Record<string, string>;
}

export interface ServerLog {
  id: string;
  timestamp: string;
  method: HttpMethod;
  path: string;
  status: number;
  latencyMs: number;
  ip: string;
}

export interface ServerMetrics {
  cpuUsage: number;
  memoryUsage: number;
  requestRate: number;
  activeConnections: number;
}
