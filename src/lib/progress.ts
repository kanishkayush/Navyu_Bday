export const STORY_PLANETS = ["memories", "reasons", "letter"] as const;

export type PlanetId = (typeof STORY_PLANETS)[number] | "chapter";

export const WORLD_ORDER: PlanetId[] = ["memories", "reasons", "letter", "chapter"];

/** Chapter 23 opens only after the other three worlds have been opened. */
export function finaleUnlocked(opened: ReadonlySet<string>) {
  return STORY_PLANETS.every((id) => opened.has(id));
}

export function discoveredWorlds(opened: Iterable<string>) {
  return new Set(opened).size;
}
