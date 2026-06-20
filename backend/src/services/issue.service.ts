import { HttpError } from "../lib/httpError.js";
import { prisma } from "../lib/prisma.js";
import type { CreateIssueInput, IssueQuery, UpdateIssueInput } from "../types/issue.js";

export const issueService = {
  list(filters: IssueQuery) {
    return prisma.issue.findMany({
      where: {
        ...(filters.severity !== undefined ? { severity: filters.severity } : {}),
        ...(filters.status !== undefined ? { status: filters.status } : {}),
        ...(filters.projectId !== undefined ? { projectId: filters.projectId } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: { project: true },
    });
  },

  getById(id: number) {
    return prisma.issue.findUnique({ where: { id }, include: { project: true } });
  },

  async create(data: CreateIssueInput) {
    const project = await prisma.project.findUnique({ where: { id: data.projectId } });
    if (!project) {
      throw new HttpError(404, "Project not found");
    }

    return prisma.issue.create({ data, include: { project: true } });
  },

  async update(id: number, data: UpdateIssueInput) {
    if (data.projectId) {
      const project = await prisma.project.findUnique({ where: { id: data.projectId } });
      if (!project) {
        throw new HttpError(404, "Project not found");
      }
    }

    return prisma.issue.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.severity !== undefined ? { severity: data.severity } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.projectId !== undefined ? { projectId: data.projectId } : {}),
      },
      include: { project: true },
    });
  },

  remove(id: number) {
    return prisma.issue.delete({ where: { id } });
  },
};
