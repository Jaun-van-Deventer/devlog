import type { Request, Response } from "express";
import { HttpError } from "../lib/httpError.js";
import { projectService } from "../services/project.service.js";
import type { CreateProjectInput, UpdateProjectInput } from "../types/project.js";

export const projectController = {
  async list(_req: Request, res: Response) {
    const projects = await projectService.list();
    res.json({ success: true, data: projects });
  },

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const project = await projectService.getById(id);
    if (!project) {
      throw new HttpError(404, "Project not found");
    }
    res.json({ success: true, data: project });
  },

  async create(req: Request, res: Response) {
    const project = await projectService.create(req.body as CreateProjectInput);
    res.status(201).json({ success: true, data: project });
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const project = await projectService.update(id, req.body as UpdateProjectInput);
    res.json({ success: true, data: project });
  },

  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    await projectService.remove(id);
    res.json({ success: true, data: { id } });
  },
};
