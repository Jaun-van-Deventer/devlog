import type { Request, Response } from "express";
import { HttpError } from "../lib/httpError.js";
import { issueService } from "../services/issue.service.js";
import type { CreateIssueInput, IssueQuery, UpdateIssueInput } from "../types/issue.js";
import { getOwnerId } from "../middleware/requireClerkAuth.js";

export const issueController = {
  async list(req: Request, res: Response) {
    const issues = await issueService.list(getOwnerId(req), (req.parsedQuery ?? req.query) as IssueQuery);
    res.json({ success: true, data: issues });
  },

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const issue = await issueService.getById(getOwnerId(req), id);
    if (!issue) {
      throw new HttpError(404, "Issue not found");
    }
    res.json({ success: true, data: issue });
  },

  async create(req: Request, res: Response) {
    const issue = await issueService.create(getOwnerId(req), req.body as CreateIssueInput);
    res.status(201).json({ success: true, data: issue });
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const issue = await issueService.update(getOwnerId(req), id, req.body as UpdateIssueInput);
    if (!issue) throw new HttpError(404, "Issue not found");
    res.json({ success: true, data: issue });
  },

  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    const removed = await issueService.remove(getOwnerId(req), id);
    if (!removed) throw new HttpError(404, "Issue not found");
    res.json({ success: true, data: { id } });
  },
};
