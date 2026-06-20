import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { AGENTS } from "./agents.js";

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(import.meta.dirname, "public");
const MIME = { ".html": "text/html", ".css": "text/css", ".js": "application/javascript" };

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

async function serveStatic(req, res) {
  const filePath = req.url === "/" ? "/index.html" : req.url;
  const full = path.join(PUBLIC_DIR, filePath);
  if (!full.startsWith(PUBLIC_DIR)) return res.writeHead(403).end();
  try {
    const data = await fs.readFile(full);
    res.writeHead(200, { "Content-Type": MIME[path.extname(full)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404).end("Not found");
  }
}

async function handleChat(req, res) {
  let body = "";
  for await (const chunk of req) body += chunk;
  const { agentId, history } = JSON.parse(body || "{}");
  const agent = AGENTS[agentId];

  if (!agent) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Unknown agent" }));
  }
  if (!anthropic) {
    res.writeHead(503, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({
        error: "ANTHROPIC_API_KEY не задан на сервере. Добавь переменную окружения и перезапусти сервер.",
      })
    );
  }

  try {
    const reply = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: agent.system,
      messages: history,
    });
    const text = reply.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ text }));
  } catch (err) {
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: String(err.message || err) }));
  }
}

const server = http.createServer((req, res) => {
  if (req.url === "/api/agents" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify(
        Object.fromEntries(Object.entries(AGENTS).map(([id, a]) => [id, { name: a.name, emoji: a.emoji, blurb: a.blurb }]))
      )
    );
  }
  if (req.url === "/api/chat" && req.method === "POST") return handleChat(req, res);
  return serveStatic(req, res);
});

server.listen(PORT, () => console.log(`AI marketing agency running on http://localhost:${PORT}`));
