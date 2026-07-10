import { Collection, Db, MongoClient, ServerApiVersion } from "mongodb";
import type { Document } from "mongodb";
import { env } from "./env.js";

type MongoGlobal = {
  mongoClient?: MongoClient;
  mongoDb?: Db;
};

const globalForMongo = globalThis as unknown as MongoGlobal;

let mongoClient: MongoClient | undefined;
let mongoDb: Db | undefined;

export async function connectToDatabase() {
  if (mongoClient && mongoDb) {
    return mongoDb;
  }

  mongoClient = new MongoClient(env.MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await mongoClient.connect();
  mongoDb = mongoClient.db(env.MONGODB_DB_NAME);

  globalForMongo.mongoClient = mongoClient;
  globalForMongo.mongoDb = mongoDb;

  await ensureIndexes();
  return mongoDb;
}

export async function getDb() {
  return connectToDatabase();
}

export async function getCollection<T extends Document>(name: string): Promise<Collection<T>> {
  const database = await getDb();
  return database.collection<T>(name);
}

export async function getNextId(sequenceName: string) {
  const counters = await getCollection<{ _id: string; value: number }>("counters");
  const result = await counters.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { value: 1 } },
    { upsert: true, returnDocument: "after" },
  );

  if (!result) {
    return 1;
  }

  return result.value ?? 1;
}

export function serializeDocument<T extends { _id?: unknown }>(document: T) {
  const { _id, ...rest } = document;
  return rest as Omit<T, "_id">;
}

async function ensureIndexes() {
  if (!mongoDb) {
    return;
  }

  const projects = mongoDb.collection("projects");
  const issues = mongoDb.collection("issues");
  const sessions = mongoDb.collection("sessions");
  const counters = mongoDb.collection("counters");

  await Promise.all([
    projects.createIndex({ id: 1 }, { unique: true }),
    projects.createIndex({ createdAt: -1 }),
    issues.createIndex({ id: 1 }, { unique: true }),
    issues.createIndex({ projectId: 1 }),
    issues.createIndex({ status: 1 }),
    issues.createIndex({ severity: 1 }),
    issues.createIndex({ createdAt: -1 }),
    sessions.createIndex({ id: 1 }, { unique: true }),
    sessions.createIndex({ projectId: 1 }),
    sessions.createIndex({ date: -1 }),
    counters.createIndex({ _id: 1 }, { unique: true }),
  ]);
}
