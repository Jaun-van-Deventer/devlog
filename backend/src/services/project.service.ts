import { getCollection, getNextId, serializeDocument } from "../lib/mongodb.js";
import type { CreateProjectInput, UpdateProjectInput } from "../types/project.js";
import type { ProjectDocument } from "../lib/mongoModels.js";

export const projectService = {
  async list() {
    const projects = await getCollection<ProjectDocument>("projects");
    const items = await projects.find({}).sort({ createdAt: -1 }).toArray();

    const issues = await getCollection<{ projectId: number }>("issues");
    const sessions = await getCollection<{ projectId: number }>("sessions");

    return Promise.all(
      items.map(async (item) => ({
        ...serializeDocument(item),
        _count: {
          issues: await issues.countDocuments({ projectId: item.id }),
          codingSessions: await sessions.countDocuments({ projectId: item.id }),
        },
      })),
    );
  },

  async getById(id: number) {
    const projects = await getCollection<ProjectDocument>("projects");
    const project = await projects.findOne({ id });
    if (!project) return null;

    const issues = await getCollection<{ id: number; title: string; description: string; severity: string; status: string; projectId: number; createdAt: Date }>("issues");
    const sessions = await getCollection<{ id: number; projectId: number; date: Date; hours: number; notes?: string | null }>("sessions");

    return {
      ...serializeDocument(project),
      issues: await issues.find({ projectId: id }).sort({ createdAt: -1 }).toArray(),
      codingSessions: await sessions.find({ projectId: id }).sort({ date: -1 }).toArray(),
    };
  },

  async create(data: CreateProjectInput) {
    const projects = await getCollection<ProjectDocument>("projects");
    const project = {
      id: await getNextId("projects"),
      name: data.name,
      description: data.description ?? null,
      status: data.status,
      createdAt: new Date(),
    };

    await projects.insertOne(project as ProjectDocument);
    return serializeDocument(project as ProjectDocument);
  },

  async update(id: number, data: UpdateProjectInput) {
    const projects = await getCollection<ProjectDocument>("projects");
    const update: Partial<ProjectDocument> = {};

    if (data.name !== undefined) update.name = data.name;
    if (data.description !== undefined) update.description = data.description;
    if (data.status !== undefined) update.status = data.status;

    const result = await projects.findOneAndUpdate({ id }, { $set: update }, { returnDocument: "after" });
    return result ? serializeDocument(result) : null;
  },

  async remove(id: number) {
    const projects = await getCollection<ProjectDocument>("projects");
    const result = await projects.deleteOne({ id });
    return result.deletedCount > 0;
  },
};
