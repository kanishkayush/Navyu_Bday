import assert from "node:assert/strict";
import { test } from "node:test";
import { BIRTHDAY_UNLOCK_MS, readPreviewNow, remainingUntil } from "./unlock.ts";

test("unlock instant is midnight IST on 28 October 2026", () => {
  // 00:00 Asia/Kolkata = 18:30 UTC previous day
  assert.equal(BIRTHDAY_UNLOCK_MS, Date.parse("2026-10-27T18:30:00.000Z"));
  const asUtc = new Date(BIRTHDAY_UNLOCK_MS).toISOString();
  assert.equal(asUtc, "2026-10-27T18:30:00.000Z");
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(BIRTHDAY_UNLOCK_MS));
  const get = (type: string) => parts.find((part) => part.type === type)?.value;
  assert.equal(`${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`, "2026-10-28 00:00:00");
});

test("stays locked before the deadline and never goes negative", () => {
  const before = remainingUntil(BIRTHDAY_UNLOCK_MS, BIRTHDAY_UNLOCK_MS - 1000);
  assert.equal(before.unlocked, false);
  assert.equal(before.totalMs, 1000);
  assert.equal(before.seconds, 1);
  assert.ok(before.days >= 0 && before.hours >= 0 && before.minutes >= 0 && before.seconds >= 0);
});

test("unlocks at and after the deadline", () => {
  assert.equal(remainingUntil(BIRTHDAY_UNLOCK_MS, BIRTHDAY_UNLOCK_MS).unlocked, true);
  assert.equal(remainingUntil(BIRTHDAY_UNLOCK_MS, BIRTHDAY_UNLOCK_MS).totalMs, 0);
  assert.equal(remainingUntil(BIRTHDAY_UNLOCK_MS, BIRTHDAY_UNLOCK_MS + 3_600_000).unlocked, true);
  assert.equal(remainingUntil(BIRTHDAY_UNLOCK_MS, BIRTHDAY_UNLOCK_MS + 3_600_000).days, 0);
});

test("same absolute unlock whether visitor is in IST or US Pacific", () => {
  // Both represent the same UTC instant: midnight IST.
  const fromIstLabel = Date.parse("2026-10-28T00:00:00+05:30");
  const fromPacificLabel = Date.parse("2026-10-27T11:30:00-07:00");
  assert.equal(fromIstLabel, BIRTHDAY_UNLOCK_MS);
  assert.equal(fromPacificLabel, BIRTHDAY_UNLOCK_MS);
  assert.equal(remainingUntil(BIRTHDAY_UNLOCK_MS, fromIstLabel).unlocked, true);
  assert.equal(remainingUntil(BIRTHDAY_UNLOCK_MS, fromPacificLabel - 1).unlocked, false);
});

test("preview query pins locked and unlocked clocks", () => {
  assert.equal(readPreviewNow("?preview=unlocked"), BIRTHDAY_UNLOCK_MS);
  assert.ok((readPreviewNow("?preview=locked") as number) < BIRTHDAY_UNLOCK_MS);
  assert.equal(readPreviewNow("?now=2026-10-27T18:30:00.000Z"), BIRTHDAY_UNLOCK_MS);
  assert.equal(readPreviewNow(""), null);
});

test("splits a multi-day remainder correctly", () => {
  // 2 days, 3 hours, 4 minutes, 5 seconds before unlock
  const now = BIRTHDAY_UNLOCK_MS - ((((2 * 24 + 3) * 60 + 4) * 60 + 5) * 1000);
  const rem = remainingUntil(BIRTHDAY_UNLOCK_MS, now);
  assert.deepEqual(
    { days: rem.days, hours: rem.hours, minutes: rem.minutes, seconds: rem.seconds, unlocked: rem.unlocked },
    { days: 2, hours: 3, minutes: 4, seconds: 5, unlocked: false },
  );
});
