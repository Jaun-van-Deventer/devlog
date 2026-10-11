import type { Request, Response } from "express";
import { HttpError } from "../lib/httpError.js";
import { projectService } from "../services/project.service.js";
import { getOwnerId } from "../middleware/requireClerkAuth.js";
import type { CreateProjectInput, UpdateProjectInput } from "../types/project.js";

export const projectController = {
  async list(req: Request, res: Response) {
    const projects = await projectService.list(getOwnerId(req));
    res.json({ success: true, data: projects });
  },

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const project = await projectService.getById(getOwnerId(req), id);
    if (!project) {
      throw new HttpError(404, "Project not found");
    }
    res.json({ success: true, data: project });
  },

  async create(req: Request, res: Response) {
    const project = await projectService.create(getOwnerId(req), req.body as CreateProjectInput);
    res.status(201).json({ success: true, data: project });
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const project = await projectService.update(getOwnerId(req), id, req.body as UpdateProjectInput);
    if (!project) throw new HttpError(404, "Project not found");
    res.json({ success: true, data: project });
  },

  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    const removed = await projectService.remove(getOwnerId(req), id);
    if (!removed) throw new HttpError(404, "Project not found");
    res.json({ success: true, data: { id } });
  },
};
