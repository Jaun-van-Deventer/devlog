import type { Document } from "mongodb";

export function serializeOwnedDocument<T extends { _id?: unknown; ownerId: string }>(document: T) {
  const { _id, ownerId: _ownerId, ...rest } = document;
  return rest as Omit<Omit<T, "_id">, "ownerId">;
}

export function ownedFilter<T extends Document>(ownerId: string, filter: T = {} as T) {
  return { ...filter, ownerId };
}
