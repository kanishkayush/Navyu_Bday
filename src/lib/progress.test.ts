import assert from "node:assert/strict";
import { test } from "node:test";
import { discoveredWorlds, finaleUnlocked } from "./progress.ts";

test("chapter stays sealed until the other three worlds are opened", () => {
  assert.equal(finaleUnlocked(new Set()), false);
  assert.equal(finaleUnlocked(new Set(["memories", "reasons"])), false);
  assert.equal(finaleUnlocked(new Set(["chapter"])), false);
  assert.equal(finaleUnlocked(new Set(["memories", "reasons", "letter"])), true);
});

test("counts a world once", () => {
  assert.equal(discoveredWorlds([]), 0);
  assert.equal(discoveredWorlds(["memories", "memories", "letter"]), 2);
});
