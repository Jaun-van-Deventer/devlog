import { prisma } from "../lib/prisma.js";
import type { CreateProjectInput, UpdateProjectInput } from "../types/project.js";

export const projectService = {
  list() {
    return prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { issues: true, codingSessions: true } },
      },
    });
  },

  getById(id: number) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        issues: { orderBy: { createdAt: "desc" } },
        codingSessions: { orderBy: { date: "desc" } },
      },
    });
  },

  create(data: CreateProjectInput) {
    return prisma.project.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        status: data.status,
      },
    });
  },

  update(id: number, data: UpdateProjectInput) {
    return prisma.project.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
      },
    });
  },

  remove(id: number) {
    return prisma.project.delete({ where: { id } });
  },
};
