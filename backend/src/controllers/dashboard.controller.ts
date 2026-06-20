import type { Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service.js";

export const dashboardController = {
  async summary(_req: Request, res: Response) {
    const summary = await dashboardService.summary();
    res.json({ success: true, data: summary });
  },
};
