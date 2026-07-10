import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  MONGODB_DB_NAME: z.string().default("devlog"),
  PORT: z.coerce.number().int().positive().default(5000),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export const env = envSchema.parse(process.env);

if (process.env.NODE_ENV === "production" && !process.env.CORS_ORIGIN) {
  console.warn("WARNING: CORS_ORIGIN not set. Using default value. Set CORS_ORIGIN environment variable in production.");
}
