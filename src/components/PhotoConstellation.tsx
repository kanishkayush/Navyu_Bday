import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { birthdayContent, type Memory } from "../content/birthdayContent";
import {
  constellationComplete,
  constellationEdges,
  layoutConstellation,
  photoIdsInOrder,
} from "../lib/constellation";

export function PhotoConstellation({
  discovered,
  onDiscover,
}: {
  discovered: ReadonlySet<string>;
  onDiscover: (id: string) => void;
}) {
  const memories = birthdayContent.memories.filter((memory) => Boolean(memory.image));
  const ids = photoIdsInOrder(birthdayContent.memories);
  const stars = layoutConstellation(ids);
  const edges = constellationEdges(stars.length);
  const [openId, setOpenId] = useState<string | null>(null);
  const starRefs = useRef(new Map<string, HTMLButtonElement>());
  const reduce =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const complete = constellationComplete(discovered, ids);
  const openIndex = openId ? ids.indexOf(openId) : -1;
  const open = openIndex >= 0 ? memories[openIndex] : undefined;

  function openMemory(id: string) {
    setOpenId(id);
    onDiscover(id);
  }

  function closeViewer() {
    const returnId = openId;
    setOpenId(null);
    queueMicrotask(() => {
      if (returnId) starRefs.current.get(returnId)?.focus();
    });
  }

  function step(delta: number) {
    if (openIndex < 0 || ids.length === 0) return;
    const next = ids[(openIndex + delta + ids.length) % ids.length];
    openMemory(next);
  }

  if (memories.length === 0) {
    return (
      <div className="empty-sky">
        <p>This corner of the universe is still waiting for its memories.</p>
      </div>
    );
  }

  return (
    <div className="constellation-root">
      <p className="counter" role="status">
        {discovered.size} of {ids.length} memories discovered.
      </p>

      <div className={complete ? "constellation-stage is-complete" : "constellation-stage"}>
        <svg className="constellation-svg" viewBox="0 0 100 100" role="img" aria-label="Photo constellation">
          {edges.map(([from, to]) => {
            const a = stars[from];
            const b = stars[to];
            const lit = discovered.has(a.id) && discovered.has(b.id);
            return (
              <line
                key={`${a.id}-${b.id}`}
                className={lit ? "constellation-line is-lit" : "constellation-line"}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
              />
            );
          })}
        </svg>

        {stars.map((star, index) => {
          const found = discovered.has(star.id);
          const active = openId === star.id;
          return (
            <button
              key={star.id}
              type="button"
              ref={(node) => {
                if (node) starRefs.current.set(star.id, node);
                else starRefs.current.delete(star.id);
              }}
              className={["constellation-star", found ? "is-found" : "", active ? "is-active" : "", reduce ? "is-still" : ""]
                .filter(Boolean)
                .join(" ")}
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                ["--star-size" as string]: `${star.size}rem`,
                animationDelay: `${(index % 7) * 0.18}s`,
              }}
              aria-label={`Open memory ${index + 1}`}
              aria-pressed={found}
              onClick={() => openMemory(star.id)}
            >
              <span className="constellation-dot" />
            </button>
          );
        })}

        {complete ? (
          <p className="celebrate constellation-done" role="status">
            You found every star in this little galaxy.
          </p>
        ) : null}
      </div>

      {birthdayContent.journeyNote ? (
        <article className="journey">
          <p>{birthdayContent.journeyNote}</p>
        </article>
      ) : null}

      {open ? (
        <MemoryDetail
          key={open.id}
          memory={open}
          index={openIndex}
          total={ids.length}
          onClose={closeViewer}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
        />
      ) : null}
    </div>
  );
}

function MemoryDetail({
  memory,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  memory: Memory;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [failed, setFailed] = useState(false);
  const caption = memory.caption.trim();

  useEffect(() => {
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        onClose();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onPrev();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        onNext();
      }
    };

    document.addEventListener("keydown", onKey, true);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey, true);
    };
  }, [onClose, onNext, onPrev]);

  return (
    <div className="memory-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className="memory-panel">
        <div className="memory-toolbar">
          <p id={titleId} className="kicker">
            Memory {index + 1} of {total}
          </p>
          <button ref={closeRef} type="button" className="icon-btn" aria-label="Close memory" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        {failed || !memory.image ? (
          <div className="memory-fallback" role="img" aria-label="Photo could not be loaded">
            This photo could not be loaded.
          </div>
        ) : (
          <img
            className="memory-photo"
            src={memory.image}
            alt={memory.imageAlt || caption || `Memory ${index + 1}`}
            loading="eager"
            decoding="async"
            onError={() => setFailed(true)}
          />
        )}
        {memory.date ? <p className="memory-date">{memory.date}</p> : null}
        {caption ? <p className="viewer-caption">{caption}</p> : null}
        <div className="memory-nav">
          <button type="button" className="text-btn" onClick={onPrev}>
            <ChevronLeft size={16} /> Previous
          </button>
          <button type="button" className="text-btn" onClick={onNext}>
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
