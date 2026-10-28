import assert from "node:assert/strict";
import { test } from "node:test";
import { birthdayContent } from "./birthdayContent.ts";
import { cinematicContent } from "./cinematicContent.ts";
import { BIRTHDAY_UNLOCK_MS } from "../lib/unlock.ts";
import { finaleUnlocked } from "../lib/progress.ts";

test("cinematic opening lines and title are configured", () => {
  assert.equal(cinematicContent.opening.lines.length, 3);
  assert.match(cinematicContent.opening.title, /Navyu/);
  assert.equal(cinematicContent.opening.chapter, "Chapter 23");
  assert.ok(cinematicContent.opening.scene.readyAtMs > cinematicContent.opening.scene.titleAtMs);
  assert.ok(cinematicContent.opening.scene.titleAtMs > cinematicContent.opening.scene.linesStartMs);
});

test("audio asset path remains a single local mp3 source", () => {
  assert.equal(birthdayContent.audio.musicSrc.includes("Nazm Nazm"), true);
  assert.match(birthdayContent.audio.musicSrc, /\.mp3$/);
});

test("trailer uses existing photo order and does not invent captions", () => {
  const photos = birthdayContent.memories.filter((memory) => memory.image);
  assert.equal(photos.length, 23);
  assert.equal(cinematicContent.trailer.overlays.length, 0);
  assert.ok(cinematicContent.trailer.endCard.length > 0);
});

test("finale wish is present and countdown unlock is unchanged", () => {
  assert.match(cinematicContent.finale.wish, /wish/);
  assert.equal(BIRTHDAY_UNLOCK_MS, Date.parse("2026-10-27T18:30:00.000Z"));
  assert.equal(finaleUnlocked(new Set(["memories", "reasons", "letter"])), true);
  assert.equal(finaleUnlocked(new Set(["memories"])), false);
});

test("song path remains the local Nazm Nazm file", () => {
  assert.ok(birthdayContent.audio.musicSrc.includes("Nazm Nazm"));
});
