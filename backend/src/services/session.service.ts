import { HttpError } from "../lib/httpError.js";
import { getCollection, getNextId, serializeDocument } from "../lib/mongodb.js";
import type { CodingSessionDocument, ProjectDocument } from "../lib/mongoModels.js";
import type { CreateSessionInput } from "../types/session.js";

export const sessionService = {
  async list() {
    const sessions = await getCollection<CodingSessionDocument>("sessions");
    const items = await sessions.find({}).sort({ date: -1 }).toArray();
    const projects = await getCollection<ProjectDocument>("projects");

    return Promise.all(
      items.map(async (item) => ({
        ...serializeDocument(item),
        project: await projects.findOne({ id: item.projectId }),
      })),
    );
  },

  async getById(id: number) {
    const sessions = await getCollection<CodingSessionDocument>("sessions");
    const session = await sessions.findOne({ id });
    if (!session) return null;

    const projects = await getCollection<ProjectDocument>("projects");
    return {
      ...serializeDocument(session),
      project: await projects.findOne({ id: session.projectId }),
    };
  },

  async create(data: CreateSessionInput) {
    const projects = await getCollection<ProjectDocument>("projects");
    const project = await projects.findOne({ id: data.projectId });
    if (!project) {
      throw new HttpError(404, "Project not found");
    }

    const sessions = await getCollection<CodingSessionDocument>("sessions");
    const session = {
      id: await getNextId("sessions"),
      projectId: data.projectId,
      date: data.date,
      hours: data.hours,
      notes: data.notes ?? null,
    };

    await sessions.insertOne(session as CodingSessionDocument);
    return {
      ...serializeDocument(session as CodingSessionDocument),
      project: serializeDocument(project),
    };
  },

  async remove(id: number) {
    const sessions = await getCollection<CodingSessionDocument>("sessions");
    const result = await sessions.deleteOne({ id });
    return result.deletedCount > 0;
  },
};
