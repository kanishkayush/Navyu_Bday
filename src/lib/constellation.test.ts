import assert from "node:assert/strict";
import { test } from "node:test";
import type { Memory } from "../content/birthdayContent.ts";
import { birthdayContent } from "../content/birthdayContent.ts";
import {
  constellationComplete,
  constellationEdges,
  discoverMemory,
  layoutConstellation,
  photoIdsInOrder,
} from "./constellation.ts";
import { finaleUnlocked } from "./progress.ts";

test("maps all configured photo memories exactly once in content order", () => {
  const ids = photoIdsInOrder(birthdayContent.memories);
  assert.equal(ids.length, 23);
  assert.equal(new Set(ids).size, 23);
  assert.deepEqual(
    ids,
    birthdayContent.memories.map((memory) => memory.id),
  );
  for (const memory of birthdayContent.memories) {
    assert.ok(memory.image?.startsWith("/assets/photos/"));
  }
});

test("layout is deterministic and one star per photo id", () => {
  const ids = photoIdsInOrder(birthdayContent.memories);
  const a = layoutConstellation(ids);
  const b = layoutConstellation(ids);
  assert.equal(a.length, 23);
  assert.deepEqual(a, b);
  assert.deepEqual(
    a.map((star) => star.id),
    ids,
  );
  for (const star of a) {
    assert.ok(star.x >= 8 && star.x <= 92);
    assert.ok(star.y >= 8 && star.y <= 92);
  }
});

test("discovery is idempotent and completion requires every photo id", () => {
  const ids = ["a", "b", "c"];
  let found = new Set<string>();
  found = new Set(discoverMemory(found, "a"));
  found = new Set(discoverMemory(found, "a"));
  assert.equal(found.size, 1);
  assert.equal(constellationComplete(found, ids), false);
  found = new Set(discoverMemory(found, "b"));
  found = new Set(discoverMemory(found, "c"));
  assert.equal(found.size, 3);
  assert.equal(constellationComplete(found, ids), true);
  assert.ok(found.size <= ids.length);
});

test("edges stay within star indexes", () => {
  const edges = constellationEdges(23);
  assert.ok(edges.length > 23);
  for (const [from, to] of edges) {
    assert.ok(from >= 0 && from < 23);
    assert.ok(to >= 0 && to < 23);
  }
});

test("constellation discoveries do not unlock Chapter 23 alone", () => {
  assert.equal(finaleUnlocked(new Set(["memories"])), false);
  assert.equal(finaleUnlocked(new Set(["memories", "reasons", "letter"])), true);
});

test("omits text-only memories from the star map", () => {
  const mixed: Memory[] = [
    { id: "one", image: "/assets/photos/one.JPG", caption: "" },
    { id: "note", caption: "text only" },
    { id: "two", image: "/assets/photos/two.JPG", caption: "" },
  ];
  assert.deepEqual(photoIdsInOrder(mixed), ["one", "two"]);
});

test("song path stays the configured local file", () => {
  assert.match(birthdayContent.audio.musicSrc, /\.mp3$/);
  assert.ok(birthdayContent.audio.musicSrc.includes("Nazm Nazm"));
});
