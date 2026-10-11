import cors from "cors";
import express from "express";
import { clerkMiddleware } from "@clerk/express";
import { env } from "./lib/env.js";
import { connectToDatabase } from "./lib/mongodb.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { requireClerkAuth } from "./middleware/requireClerkAuth.js";
import { dashboardRoutes } from "./routes/dashboard.routes.js";
import { issueRoutes } from "./routes/issues.routes.js";
import { projectRoutes } from "./routes/projects.routes.js";
import { sessionRoutes } from "./routes/sessions.routes.js";

const app = express();
const allowedOrigins = new Set([
  ...env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
  ...(env.NODE_ENV === "development" ? ["http://localhost:5173", "http://127.0.0.1:5173"] : []),
]);

app.use(clerkMiddleware({ secretKey: env.CLERK_SECRET_KEY }));
app.use(cors({ origin: (origin, callback) => callback(null, !origin || allowedOrigins.has(origin)) }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});

app.use("/api", requireClerkAuth);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/sessions", sessionRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  await connectToDatabase();
  app.listen(env.PORT, () => {
    console.log(`DevLog API running on port ${env.PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
