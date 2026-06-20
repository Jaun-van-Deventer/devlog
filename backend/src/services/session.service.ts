import { HttpError } from "../lib/httpError.js";
import { prisma } from "../lib/prisma.js";
import type { CreateSessionInput } from "../types/session.js";

export const sessionService = {
  list() {
    return prisma.codingSession.findMany({
      orderBy: { date: "desc" },
      include: { project: true },
    });
  },

  getById(id: number) {
    return prisma.codingSession.findUnique({ where: { id }, include: { project: true } });
  },

  async create(data: CreateSessionInput) {
    const project = await prisma.project.findUnique({ where: { id: data.projectId } });
    if (!project) {
      throw new HttpError(404, "Project not found");
    }

    return prisma.codingSession.create({
      data: {
        projectId: data.projectId,
        date: data.date,
        hours: data.hours,
        notes: data.notes ?? null,
      },
    });
  },

  remove(id: number) {
    return prisma.codingSession.delete({ where: { id } });
  },
};
