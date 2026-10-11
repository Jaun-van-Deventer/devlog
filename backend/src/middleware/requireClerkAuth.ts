import { getAuth } from "@clerk/express";
import type { Request, RequestHandler } from "express";
import { HttpError } from "../lib/httpError.js";

declare global {
  namespace Express {
    interface Request {
      ownerId?: string;
    }
  }
}

export const requireClerkAuth: RequestHandler = (req, res, next) => {
  const { isAuthenticated, userId } = getAuth(req);
  if (!isAuthenticated || !userId) {
    res.status(401).json({ success: false, message: "Authentication required" });
    return;
  }

  req.ownerId = userId;
  res.setHeader("Cache-Control", "private, no-store");
  next();
};

export function getOwnerId(req: Request) {
  if (!req.ownerId) {
    throw new HttpError(401, "Authentication required");
  }
  return req.ownerId;
}
