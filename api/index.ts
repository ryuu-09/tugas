import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from dist/public in production
const staticPath = path.resolve(__dirname, "..", "dist", "public");

app.use(express.static(staticPath));

// Handle client-side routing - serve index.html for all routes
app.get("*", (_req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

export default app;
