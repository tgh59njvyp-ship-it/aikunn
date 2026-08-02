import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Gemini AI Generation API
app.post("/api/gemini/generate", async (req, res) => {
  try {
    const { prompt, type, context } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGeminiClient();

    let systemInstruction = "You are an expert full-stack Web developer, UI designer, and backend architect. Respond with high quality structured JSON or code depending on request.";
    
    if (type === "website") {
      systemInstruction = `You are a UI/UX expert website designer. Generate a JSON array of website sections based on user prompt.
Output strictly valid JSON with no markdown formatting around it (or valid raw JSON).
Schema expected:
[
  {
    "id": "section-1",
    "type": "hero" | "features" | "stats" | "pricing" | "cta" | "contact" | "footer" | "custom",
    "title": "Main Heading",
    "subtitle": "Sub heading text",
    "content": "Detailed text or description",
    "ctaText": "Button Text",
    "ctaLink": "#",
    "badge": "Optional Badge",
    "items": [
      { "title": "Item Title", "desc": "Item Description", "icon": "LucideIconName" }
    ],
    "bgStyle": "default" | "gradient" | "dark" | "muted",
    "customHtml": "Optional raw HTML if type is custom"
  }
]`;
    } else if (type === "slide") {
      systemInstruction = `You are a professional presentation slide designer. Generate a presentation slide deck based on user prompt.
Output strictly valid JSON with no markdown formatting.
Schema expected:
{
  "title": "Deck Title",
  "theme": "modern" | "dark" | "clean" | "cyber" | "editorial",
  "slides": [
    {
      "id": "slide-1",
      "layout": "title" | "bullets" | "split" | "quote" | "code" | "stats",
      "title": "Slide Title",
      "subtitle": "Subtitle or topic",
      "bullets": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
      "code": "Optional code snippet",
      "quote": "Optional quote text",
      "author": "Quote author",
      "statNumber": "10x",
      "statLabel": "Performance Increase",
      "notes": "Speaker notes for this slide"
    }
  ]
}`;
    } else if (type === "api") {
      systemInstruction = `You are a Backend API architect. Generate REST API route definitions based on user prompt.
Output strictly valid JSON with no markdown formatting.
Schema expected:
{
  "routes": [
    {
      "id": "route-1",
      "method": "GET" | "POST" | "PUT" | "DELETE",
      "path": "/api/v1/resource",
      "summary": "Brief description of endpoint",
      "status": 200,
      "responseHeaders": { "Content-Type": "application/json" },
      "responseBody": { "sample": "json body response" }
    }
  ]
}`;
    } else if (type === "database") {
      systemInstruction = `You are a Database Architect. Generate database table schemas and sample data based on user prompt.
Output strictly valid JSON with no markdown formatting.
Schema expected:
{
  "tables": [
    {
      "id": "table-1",
      "name": "users",
      "columns": [
        { "name": "id", "type": "INTEGER", "primaryKey": true, "nullable": false },
        { "name": "email", "type": "VARCHAR", "primaryKey": false, "nullable": false },
        { "name": "name", "type": "VARCHAR", "primaryKey": false, "nullable": true },
        { "name": "created_at", "type": "TIMESTAMP", "primaryKey": false, "nullable": false }
      ],
      "rows": [
        { "id": 1, "email": "user@example.com", "name": "Alice Smith", "created_at": "2026-08-01 10:00:00" }
      ]
    }
  ]
}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Prompt: ${prompt}\nContext: ${JSON.stringify(context || {})}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch {
      parsedData = { rawText: text };
    }

    res.json({ result: parsedData });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI response" });
  }
});

// Mock Backend API Sandbox Execution Endpoint
app.post("/api/sandbox/execute-mock", (req, res) => {
  const { route, requestData } = req.body;

  if (!route) {
    return res.status(400).json({ error: "Route definition required" });
  }

  const startTime = Date.now();
  
  // Simulate processing latency
  setTimeout(() => {
    const latency = Date.now() - startTime;

    res.status(route.status || 200).json({
      _sandboxMeta: {
        endpoint: `${route.method} ${route.path}`,
        statusCode: route.status || 200,
        latencyMs: latency + 12,
        timestamp: new Date().toISOString(),
        requestParams: requestData || {},
      },
      data: route.responseBody || { message: "Mock response generated successfully" },
    });
  }, 100);
});

// Start Express and Vite server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 WebDev Studio Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
