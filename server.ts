import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { securityHeaders, apiRateLimiter, errorHandler } from "./src/server/middleware/security";
import apiRouter from "./src/server/routes/api";
import { loadTokens, loadPresale, startSimulationLoop } from "./src/server/db/store";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Initialize persistent storage files & simulation streams
  console.log("[Database] Initializing persistent storage...");
  loadTokens();
  loadPresale();
  startSimulationLoop();
  console.log("[Database] Seeded databases and activated miners background simulator.");

  // 2. Apply security headers (Helmet)
  app.use(securityHeaders);

  // 3. Add robust CORS headers manually for all routes
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    } else {
      res.setHeader("Access-Control-Allow-Origin", "*");
    }
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // 4. Request Body Parsers
  app.use(express.json());

  // 5. Apply global API rate limits to prevent brute-forcing/abuses
  app.use("/api", apiRateLimiter);

  // 6. Mount API routers
  app.use("/api", apiRouter);

  // 7. Mount Vite middleware for dev HMR or static file server in production
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
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

  // 8. Central Error Handler
  app.use(errorHandler);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SOLAXY Server] Running successfully on http://0.0.0.0:${PORT} [Mode: ${isProd ? "production" : "development"}]`);
  });
}

startServer().catch(err => {
  console.error("[CRITICAL] Failed to start SOLAXY Server:", err);
  process.exit(1);
});
