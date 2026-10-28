import type { Memory } from "../content/birthdayContent";

export type StarPoint = {
  id: string;
  index: number;
  x: number;
  y: number;
  size: number;
};

/** Heart-inspired points in a 0–100 viewBox. Positions are deterministic from photo order. */
export function layoutConstellation(ids: readonly string[]): StarPoint[] {
  const total = ids.length;
  if (total === 0) return [];

  return ids.map((id, index) => {
    const t = (index / total) * Math.PI * 2 - Math.PI / 2;
    const hx = 16 * Math.sin(t) ** 3;
    const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    const x = 50 + (hx / 17) * 36;
    const y = 50 + (hy / 18) * 34;
    const size = 0.9 + ((index * 5) % 4) * 0.12;
    return { id, index, x, y, size };
  });
}

/** Ring edges plus a few chords so discoveries gradually light a web. */
export function constellationEdges(count: number): Array<[number, number]> {
  if (count < 2) return [];
  const edges: Array<[number, number]> = [];
  for (let i = 0; i < count; i += 1) {
    edges.push([i, (i + 1) % count]);
    if (count > 4 && i % 3 === 0) edges.push([i, (i + 3) % count]);
  }
  return edges;
}

export function photoIdsInOrder(memories: readonly Memory[]) {
  return memories.filter((memory) => Boolean(memory.image)).map((memory) => memory.id);
}

export function discoverMemory(found: ReadonlySet<string>, id: string) {
  if (found.has(id)) return found;
  const next = new Set(found);
  next.add(id);
  return next;
}

export function constellationComplete(found: ReadonlySet<string>, ids: readonly string[]) {
  return ids.length > 0 && ids.every((id) => found.has(id));
}
