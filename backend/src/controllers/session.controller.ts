import type { Request, Response } from "express";
import { HttpError } from "../lib/httpError.js";
import { sessionService } from "../services/session.service.js";
import type { CreateSessionInput } from "../types/session.js";

export const sessionController = {
  async list(_req: Request, res: Response) {
    const sessions = await sessionService.list();
    res.json({ success: true, data: sessions });
  },

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const session = await sessionService.getById(id);
    if (!session) {
      throw new HttpError(404, "Coding session not found");
    }
    res.json({ success: true, data: session });
  },

  async create(req: Request, res: Response) {
    const session = await sessionService.create(req.body as CreateSessionInput);
    res.status(201).json({ success: true, data: session });
  },

  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    await sessionService.remove(id);
    res.json({ success: true, data: { id } });
  },
};
