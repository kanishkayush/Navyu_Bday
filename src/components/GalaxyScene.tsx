import { useEffect, useRef, useState } from "react";
import { birthdayContent, worldCopy } from "../content/birthdayContent";
import { cinematicContent } from "../content/cinematicContent";
import { discoveredWorlds, finaleUnlocked, WORLD_ORDER, type PlanetId } from "../lib/progress";

const LAYOUT: Record<PlanetId, { x: string; y: string; delay: string }> = {
  memories: { x: "22%", y: "34%", delay: "0s" },
  reasons: { x: "78%", y: "30%", delay: "-1.6s" },
  letter: { x: "28%", y: "76%", delay: "-2.4s" },
  chapter: { x: "74%", y: "72%", delay: "-0.7s" },
};

const QUIET_STAR = "Some stars are only here because someone looked for them.";

export function GalaxyScene({
  opened,
  lockedAway,
  onOpen,
  onOpenTrailer,
}: {
  opened: ReadonlySet<PlanetId>;
  lockedAway: boolean;
  onOpen: (id: PlanetId) => void;
  onOpenTrailer: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const [secretOpen, setSecretOpen] = useState(false);
  const unlocked = finaleUnlocked(opened);
  const found = discoveredWorlds(opened);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (lockedAway) el.setAttribute("inert", "");
    else el.removeAttribute("inert");
  }, [lockedAway]);

  return (
    <section ref={ref} className="screen galaxy" aria-label="The universe" aria-hidden={lockedAway}>
      <header className="topbar">
        <h1 className="galaxy-title">A Universe Called {birthdayContent.nickname}</h1>
        <p className="progress" role="status">
          {found} of {WORLD_ORDER.length} worlds discovered.
        </p>
        <p className="rule">{unlocked ? "Chapter 23 is open." : "Chapter 23 opens after the other three worlds are visited."}</p>
      </header>
      <div className="orbit">
        <svg className="orbit-ring" viewBox="0 0 100 100" aria-hidden="true">
          <ellipse cx="50" cy="50" rx="34" ry="27" />
          <ellipse cx="50" cy="50" rx="22" ry="16" />
        </svg>
        <div className="sun" aria-hidden="true">
          <p className="sun-name">Navyu</p>
        </div>
        {WORLD_ORDER.map((id) => {
          const locked = id === "chapter" && !unlocked;
          const discovered = opened.has(id);
          const spot = LAYOUT[id];
          return (
            <button
              key={id}
              type="button"
              className="planet-btn"
              style={{ left: spot.x, top: spot.y }}
              onClick={() => onOpen(id)}
            >
              <span className={locked ? "planet-float is-locked" : "planet-float"} style={{ animationDelay: spot.delay }}>
                <span className={`planet-art ${id}`}>
                  <span className="sphere" />
                  {id === "chapter" ? <span className="ring" /> : null}
                </span>
              </span>
              <span className="planet-name">{worldCopy[id].name}</span>
              <span className="planet-desc">{worldCopy[id].description}</span>
              {locked ? <span className="seal">Sealed</span> : null}
              {!locked && discovered ? <span className="seal">Discovered</span> : null}
              {id === "chapter" && unlocked && !discovered ? <span className="seal">Open</span> : null}
            </button>
          );
        })}
      </div>
      <div className="galaxy-actions">
        <button type="button" className="enter story-btn" onClick={onOpenTrailer}>
          {cinematicContent.trailer.galleryButton}
        </button>
      </div>
      <div className="secret">
        <button
          type="button"
          className="secret-btn"
          aria-expanded={secretOpen}
          aria-label="Quiet stars"
          onClick={() => setSecretOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
        {secretOpen ? (
          <p className="secret-note" role="status">
            {birthdayContent.secretMessage.trim() || QUIET_STAR}
          </p>
        ) : null}
      </div>
    </section>
  );
}
