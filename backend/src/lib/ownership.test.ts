import assert from "node:assert/strict";
import test from "node:test";
import { ownedFilter, serializeOwnedDocument } from "./ownership.js";

type Row = { id: number; ownerId?: string; name: string };

function matches(row: Row, filter: Record<string, unknown>) {
  return Object.entries(filter).every(([key, value]) => row[key as keyof Row] === value);
}

const rows: Row[] = [
  { id: 7, ownerId: "user_a", name: "A project" },
  { id: 8, ownerId: "user_b", name: "B project" },
  { id: 9, name: "Legacy project without a known owner" },
];

test("owner scoped queries return only the signed-in user's records", () => {
  const userA = rows.filter((row) => matches(row, ownedFilter("user_a")));
  const userB = rows.filter((row) => matches(row, ownedFilter("user_b")));

  assert.deepEqual(userA.map(({ id }) => id), [7]);
  assert.deepEqual(userB.map(({ id }) => id), [8]);
});

test("an ID belonging to another user and ownerless legacy data are inaccessible", () => {
  const query = ownedFilter("user_a", { id: 8 });
  assert.deepEqual(rows.filter((row) => matches(row, query)), []);

  const legacyQuery = ownedFilter("user_a", { id: 9 });
  assert.deepEqual(rows.filter((row) => matches(row, legacyQuery)), []);
});

test("the authenticated owner overrides any owner value in a filter", () => {
  const query = ownedFilter("user_a", { id: 8, ownerId: "user_b" });
  assert.deepEqual(query, { id: 8, ownerId: "user_a" });
});

test("owner IDs are stripped from serialized API records", () => {
  assert.deepEqual(
    serializeOwnedDocument({ _id: "mongo-id", id: 7, ownerId: "user_a", name: "A project" }),
    { id: 7, name: "A project" },
  );
});
