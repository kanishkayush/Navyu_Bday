import { useEffect, useRef, useState } from "react";
import { birthdayContent, type Memory } from "../content/birthdayContent";

function Photo({ memory }: { memory: Memory }) {
  const [failed, setFailed] = useState(false);
  if (!memory.image) return null;
  if (failed) {
    return <span className="photo-missing">This photo could not be loaded.</span>;
  }
  return (
    <img
      src={memory.image}
      alt={memory.imageAlt || memory.caption || "Photo"}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

export function MemoryGallery() {
  const { memories, journeyNote } = birthdayContent;
  const [openId, setOpenId] = useState<string | null>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const open = memories.find((memory) => memory.id === openId);
  const openCaption = open?.caption.trim() ?? "";

  useEffect(() => {
    if (open?.image) backRef.current?.focus();
  }, [open]);

  if (memories.length === 0) {
    return (
      <div className="empty-sky">
        <div className="constellation" aria-hidden="true">
          {Array.from({ length: 7 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
        <p>This corner of the universe is still waiting for its memories.</p>
      </div>
    );
  }

  if (open?.image) {
    return (
      <div className="viewer">
        <button ref={backRef} type="button" className="text-btn" onClick={() => setOpenId(null)}>
          Back to the scrapbook
        </button>
        <Photo memory={open} />
        {open.date ? <p className="memory-date">{open.date}</p> : null}
        {openCaption ? <p className="viewer-caption">{openCaption}</p> : null}
      </div>
    );
  }

  return (
    <div>
      <ul className="scrapbook">
        {memories.map((memory, index) => {
          const caption = memory.caption.trim();
          const size = index % 7 === 0 || index % 7 === 3 ? "tall" : index % 5 === 2 ? "wide" : "plain";
          if (!memory.image) {
            return (
              <li key={memory.id} className="scrap-text">
                <article className="text-memory">
                  <p>{caption || "Untitled"}</p>
                </article>
              </li>
            );
          }
          return (
            <li key={memory.id} className={`scrap-item ${size}`}>
              <button
                type="button"
                className="polaroid"
                onClick={() => setOpenId(memory.id)}
                aria-label={caption || memory.imageAlt || `Open photo ${index + 1}`}
              >
                <Photo memory={memory} />
                {caption ? <span>{caption}</span> : null}
              </button>
            </li>
          );
        })}
      </ul>
      {journeyNote ? (
        <article className="journey">
          <p>{journeyNote}</p>
        </article>
      ) : null}
    </div>
  );
}
