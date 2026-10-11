import { ObjectId } from "mongodb";

export type ProjectDocument = {
  _id: ObjectId;
  id: number;
  ownerId: string;
  name: string;
  description?: string | null;
  status: "ACTIVE" | "PAUSED" | "COMPLETED";
  createdAt: Date;
};

export type IssueDocument = {
  _id: ObjectId;
  id: number;
  ownerId: string;
  title: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  projectId: number;
  createdAt: Date;
};

export type CodingSessionDocument = {
  _id: ObjectId;
  id: number;
  ownerId: string;
  projectId: number;
  date: Date;
  hours: number;
  notes?: string | null;
};
