import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { HttpError } from "../lib/httpError.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (error instanceof HttpError) {
    res.status(error.statusCode).json({ success: false, message: error.message });
    return;
  }

  console.error(error);
  res.status(500).json({ success: false, message: "Internal server error" });
};
