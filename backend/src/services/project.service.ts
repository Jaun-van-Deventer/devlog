import { getCollection, getNextId } from "../lib/mongodb.js";
import { ownedFilter, serializeOwnedDocument } from "../lib/ownership.js";
import type { CodingSessionDocument, IssueDocument, ProjectDocument } from "../lib/mongoModels.js";
import type { CreateProjectInput, UpdateProjectInput } from "../types/project.js";

export const projectService = {
  async list(ownerId: string) {
    const projects = await getCollection<ProjectDocument>("projects");
    const items = await projects.find(ownedFilter(ownerId)).sort({ createdAt: -1 }).toArray();

    const issues = await getCollection<IssueDocument>("issues");
    const sessions = await getCollection<CodingSessionDocument>("sessions");

    return Promise.all(
      items.map(async (item) => ({
        ...serializeOwnedDocument(item),
        _count: {
          issues: await issues.countDocuments(ownedFilter(ownerId, { projectId: item.id })),
          codingSessions: await sessions.countDocuments(ownedFilter(ownerId, { projectId: item.id })),
        },
      })),
    );
  },

  async getById(ownerId: string, id: number) {
    const projects = await getCollection<ProjectDocument>("projects");
    const project = await projects.findOne(ownedFilter(ownerId, { id }));
    if (!project) return null;

    const issues = await getCollection<IssueDocument>("issues");
    const sessions = await getCollection<CodingSessionDocument>("sessions");

    return {
      ...serializeOwnedDocument(project),
      issues: (await issues.find(ownedFilter(ownerId, { projectId: id })).sort({ createdAt: -1 }).toArray()).map(serializeOwnedDocument),
      codingSessions: (await sessions.find(ownedFilter(ownerId, { projectId: id })).sort({ date: -1 }).toArray()).map(serializeOwnedDocument),
    };
  },

  async create(ownerId: string, data: CreateProjectInput) {
    const projects = await getCollection<ProjectDocument>("projects");
    const project = {
      id: await getNextId("projects"),
      ownerId,
      name: data.name,
      description: data.description ?? null,
      status: data.status,
      createdAt: new Date(),
    };

    await projects.insertOne(project as ProjectDocument);
    return serializeOwnedDocument(project as ProjectDocument);
  },

  async update(ownerId: string, id: number, data: UpdateProjectInput) {
    const projects = await getCollection<ProjectDocument>("projects");
    const update: Partial<ProjectDocument> = {};

    if (data.name !== undefined) update.name = data.name;
    if (data.description !== undefined) update.description = data.description;
    if (data.status !== undefined) update.status = data.status;

    const result = await projects.findOneAndUpdate(ownedFilter(ownerId, { id }), { $set: update }, { returnDocument: "after" });
    return result ? serializeOwnedDocument(result) : null;
  },

  async remove(ownerId: string, id: number) {
    const projects = await getCollection<ProjectDocument>("projects");
    const result = await projects.deleteOne(ownedFilter(ownerId, { id }));
    if (result.deletedCount === 0) return false;

    const issues = await getCollection<IssueDocument>("issues");
    const sessions = await getCollection<CodingSessionDocument>("sessions");
    await Promise.all([
      issues.deleteMany(ownedFilter(ownerId, { projectId: id })),
      sessions.deleteMany(ownedFilter(ownerId, { projectId: id })),
    ]);
    return true;
  },
};
