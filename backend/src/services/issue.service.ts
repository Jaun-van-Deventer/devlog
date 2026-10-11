import { HttpError } from "../lib/httpError.js";
import { getCollection, getNextId } from "../lib/mongodb.js";
import { ownedFilter, serializeOwnedDocument } from "../lib/ownership.js";
import type { IssueDocument, ProjectDocument } from "../lib/mongoModels.js";
import type { CreateIssueInput, IssueQuery, UpdateIssueInput } from "../types/issue.js";

export const issueService = {
  async list(ownerId: string, filters: IssueQuery) {
    const query: Record<string, unknown> = {};

    if (filters.severity !== undefined) query.severity = filters.severity;
    if (filters.status !== undefined) query.status = filters.status;
    if (filters.projectId !== undefined) query.projectId = filters.projectId;

    const issues = await getCollection<IssueDocument>("issues");
    const items = await issues.find(ownedFilter(ownerId, query)).sort({ createdAt: -1 }).toArray();
    const projects = await getCollection<ProjectDocument>("projects");

    return Promise.all(
      items.map(async (item) => {
        const project = await projects.findOne(ownedFilter(ownerId, { id: item.projectId }));
        return { ...serializeOwnedDocument(item), project: project ? serializeOwnedDocument(project) : null };
      }),
    );
  },

  async getById(ownerId: string, id: number) {
    const issues = await getCollection<IssueDocument>("issues");
    const issue = await issues.findOne(ownedFilter(ownerId, { id }));
    if (!issue) return null;

    const projects = await getCollection<ProjectDocument>("projects");
    const project = await projects.findOne(ownedFilter(ownerId, { id: issue.projectId }));
    return { ...serializeOwnedDocument(issue), project: project ? serializeOwnedDocument(project) : null };
  },

  async create(ownerId: string, data: CreateIssueInput) {
    const projects = await getCollection<ProjectDocument>("projects");
    const project = await projects.findOne(ownedFilter(ownerId, { id: data.projectId }));
    if (!project) {
      throw new HttpError(404, "Project not found");
    }

    const issues = await getCollection<IssueDocument>("issues");
    const issue = {
      id: await getNextId("issues"),
      ownerId,
      title: data.title,
      description: data.description,
      severity: data.severity,
      status: data.status,
      projectId: data.projectId,
      createdAt: new Date(),
    };

    await issues.insertOne(issue as IssueDocument);
    return {
      ...serializeOwnedDocument(issue as IssueDocument),
      project: serializeOwnedDocument(project),
    };
  },

  async update(ownerId: string, id: number, data: UpdateIssueInput) {
    if (data.projectId !== undefined) {
      const projects = await getCollection<ProjectDocument>("projects");
      const project = await projects.findOne(ownedFilter(ownerId, { id: data.projectId }));
      if (!project) {
        throw new HttpError(404, "Project not found");
      }
    }

    const issues = await getCollection<IssueDocument>("issues");
    const update: Partial<IssueDocument> = {};

    if (data.title !== undefined) update.title = data.title;
    if (data.description !== undefined) update.description = data.description;
    if (data.severity !== undefined) update.severity = data.severity;
    if (data.status !== undefined) update.status = data.status;
    if (data.projectId !== undefined) update.projectId = data.projectId;

    const result = await issues.findOneAndUpdate(ownedFilter(ownerId, { id }), { $set: update }, { returnDocument: "after" });
    if (!result) return null;

    const projects = await getCollection<ProjectDocument>("projects");
    const project = await projects.findOne(ownedFilter(ownerId, { id: result.projectId }));
    return { ...serializeOwnedDocument(result), project: project ? serializeOwnedDocument(project) : null };
  },

  async remove(ownerId: string, id: number) {
    const issues = await getCollection<IssueDocument>("issues");
    const result = await issues.deleteOne(ownedFilter(ownerId, { id }));
    return result.deletedCount > 0;
  },
};
