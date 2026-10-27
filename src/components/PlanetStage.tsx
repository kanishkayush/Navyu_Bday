import { worldCopy } from "../content/birthdayContent";
import { finaleUnlocked, STORY_PLANETS, type PlanetId } from "../lib/progress";
import { LoveLetter } from "./LoveLetter";
import { LoveReasons } from "./LoveReasons";
import { MemoryGallery } from "./MemoryGallery";

export function PlanetBody({
  id,
  opened,
  found,
  onDiscover,
}: {
  id: PlanetId;
  opened: ReadonlySet<PlanetId>;
  found: ReadonlySet<number>;
  onDiscover: (index: number) => void;
}) {
  if (id === "memories") return <MemoryGallery />;
  if (id === "reasons") return <LoveReasons found={found} onDiscover={onDiscover} />;
  if (id === "letter") return <LoveLetter />;
  return <LockedChapter opened={opened} />;
}

function LockedChapter({ opened }: { opened: ReadonlySet<PlanetId> }) {
  const unlocked = finaleUnlocked(opened);
  return (
    <div>
      <p className="empty-copy">
        {unlocked
          ? "Chapter 23 is ready."
          : "This world stays sealed until the other three have been opened."}
      </p>
      <ul className="seal-list">
        {STORY_PLANETS.map((id) => (
          <li key={id}>
            <span>{worldCopy[id].name}</span>
            <span>{opened.has(id) ? "Visited" : "Not yet"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
