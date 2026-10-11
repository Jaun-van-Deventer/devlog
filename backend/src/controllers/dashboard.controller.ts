import type { Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service.js";
import { getOwnerId } from "../middleware/requireClerkAuth.js";

export const dashboardController = {
  async summary(req: Request, res: Response) {
    const summary = await dashboardService.summary(getOwnerId(req));
    res.json({ success: true, data: summary });
  },
};
