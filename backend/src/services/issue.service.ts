import { HttpError } from "../lib/httpError.js";
import { getCollection, getNextId, serializeDocument } from "../lib/mongodb.js";
import type { IssueDocument, ProjectDocument } from "../lib/mongoModels.js";
import type { CreateIssueInput, IssueQuery, UpdateIssueInput } from "../types/issue.js";

export const issueService = {
  async list(filters: IssueQuery) {
    const issues = await getCollection<IssueDocument>("issues");
    const query: Record<string, unknown> = {};

    if (filters.severity !== undefined) query.severity = filters.severity;
    if (filters.status !== undefined) query.status = filters.status;
    if (filters.projectId !== undefined) query.projectId = filters.projectId;

    const items = await issues.find(query).sort({ createdAt: -1 }).toArray();
    const projects = await getCollection<ProjectDocument>("projects");

    return Promise.all(
      items.map(async (item) => ({
        ...serializeDocument(item),
        project: await projects.findOne({ id: item.projectId }),
      })),
    );
  },

  async getById(id: number) {
    const issues = await getCollection<IssueDocument>("issues");
    const issue = await issues.findOne({ id });
    if (!issue) return null;

    const projects = await getCollection<ProjectDocument>("projects");
    return {
      ...serializeDocument(issue),
      project: await projects.findOne({ id: issue.projectId }),
    };
  },

  async create(data: CreateIssueInput) {
    const projects = await getCollection<ProjectDocument>("projects");
    const project = await projects.findOne({ id: data.projectId });
    if (!project) {
      throw new HttpError(404, "Project not found");
    }

    const issues = await getCollection<IssueDocument>("issues");
    const issue = {
      id: await getNextId("issues"),
      title: data.title,
      description: data.description,
      severity: data.severity,
      status: data.status,
      projectId: data.projectId,
      createdAt: new Date(),
    };

    await issues.insertOne(issue as IssueDocument);
    return {
      ...serializeDocument(issue as IssueDocument),
      project: serializeDocument(project),
    };
  },

  async update(id: number, data: UpdateIssueInput) {
    if (data.projectId) {
      const projects = await getCollection<ProjectDocument>("projects");
      const project = await projects.findOne({ id: data.projectId });
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

    const result = await issues.findOneAndUpdate({ id }, { $set: update }, { returnDocument: "after" });
    if (!result) return null;

    const projects = await getCollection<ProjectDocument>("projects");
    return {
      ...serializeDocument(result),
      project: await projects.findOne({ id: result.projectId }),
    };
  },

  async remove(id: number) {
    const issues = await getCollection<IssueDocument>("issues");
    const result = await issues.deleteOne({ id });
    return result.deletedCount > 0;
  },
};
