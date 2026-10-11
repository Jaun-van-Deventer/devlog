import { HttpError } from "../lib/httpError.js";
import { getCollection, getNextId } from "../lib/mongodb.js";
import { ownedFilter, serializeOwnedDocument } from "../lib/ownership.js";
import type { CodingSessionDocument, ProjectDocument } from "../lib/mongoModels.js";
import type { CreateSessionInput } from "../types/session.js";

export const sessionService = {
  async list(ownerId: string) {
    const sessions = await getCollection<CodingSessionDocument>("sessions");
    const items = await sessions.find(ownedFilter(ownerId)).sort({ date: -1 }).toArray();
    const projects = await getCollection<ProjectDocument>("projects");

    return Promise.all(
      items.map(async (item) => {
        const project = await projects.findOne(ownedFilter(ownerId, { id: item.projectId }));
        return { ...serializeOwnedDocument(item), project: project ? serializeOwnedDocument(project) : null };
      }),
    );
  },

  async getById(ownerId: string, id: number) {
    const sessions = await getCollection<CodingSessionDocument>("sessions");
    const session = await sessions.findOne(ownedFilter(ownerId, { id }));
    if (!session) return null;

    const projects = await getCollection<ProjectDocument>("projects");
    const project = await projects.findOne(ownedFilter(ownerId, { id: session.projectId }));
    return { ...serializeOwnedDocument(session), project: project ? serializeOwnedDocument(project) : null };
  },

  async create(ownerId: string, data: CreateSessionInput) {
    const projects = await getCollection<ProjectDocument>("projects");
    const project = await projects.findOne(ownedFilter(ownerId, { id: data.projectId }));
    if (!project) {
      throw new HttpError(404, "Project not found");
    }

    const sessions = await getCollection<CodingSessionDocument>("sessions");
    const session = {
      id: await getNextId("sessions"),
      ownerId,
      projectId: data.projectId,
      date: data.date,
      hours: data.hours,
      notes: data.notes ?? null,
    };

    await sessions.insertOne(session as CodingSessionDocument);
    return {
      ...serializeOwnedDocument(session as CodingSessionDocument),
      project: serializeOwnedDocument(project),
    };
  },

  async remove(ownerId: string, id: number) {
    const sessions = await getCollection<CodingSessionDocument>("sessions");
    const result = await sessions.deleteOne(ownedFilter(ownerId, { id }));
    return result.deletedCount > 0;
  },
};
