import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useUniverseAudio } from "../audio/UniverseAudio";
import { birthdayContent } from "../content/birthdayContent";
import { cinematicContent } from "../content/cinematicContent";

type Mode = "photo" | "overlay" | "end";

export function MemoryTrailer({
  onClose,
  reduceMotion,
}: {
  onClose: () => void;
  reduceMotion: boolean;
}) {
  const photos = useMemo(
    () => birthdayContent.memories.filter((memory) => Boolean(memory.image)),
    [],
  );
  const { slideMs, overlayMs, endCard, overlays } = cinematicContent.trailer;
  const audio = useUniverseAudio();
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<Mode>("photo");
  const [playing, setPlaying] = useState(!reduceMotion);
  const [failed, setFailed] = useState(false);
  const touchX = useRef<number | null>(null);
  const overlay = overlays.find((item) => item.afterIndex === index);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        onClose();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setMode((current) => {
          if (current === "end") return current;
          return "photo";
        });
        setIndex((value) => Math.min(photos.length - 1, value + 1));
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setMode("photo");
        setIndex((value) => Math.max(0, value - 1));
      }
      if (event.key === " ") {
        event.preventDefault();
        setPlaying((value) => !value);
      }
    };
    document.addEventListener("keydown", onKey, true);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = previous;
    };
  }, [onClose, photos.length]);

  useEffect(() => {
    setFailed(false);
  }, [index, mode]);

  useEffect(() => {
    if (!playing || reduceMotion || mode === "end") return;
    const wait = mode === "overlay" ? overlayMs : slideMs;
    const timer = window.setTimeout(() => {
      if (mode === "photo" && overlay?.text.trim()) {
        setMode("overlay");
        return;
      }
      if (index >= photos.length - 1) {
        setMode("end");
        setPlaying(false);
        return;
      }
      setIndex((value) => value + 1);
      setMode("photo");
    }, wait);
    return () => window.clearTimeout(timer);
  }, [playing, reduceMotion, mode, index, photos.length, slideMs, overlayMs, overlay]);

  function step(delta: number) {
    if (photos.length === 0) return;
    if (mode === "end" && delta < 0) {
      setMode("photo");
      setIndex(photos.length - 1);
      return;
    }
    const next = index + delta;
    if (next < 0) return;
    if (next >= photos.length) {
      setMode("end");
      setPlaying(false);
      return;
    }
    setIndex(next);
    setMode("photo");
  }

  function replay() {
    setIndex(0);
    setMode("photo");
    setPlaying(!reduceMotion);
    void audio.play();
  }

  const memory = photos[index];
  const caption = memory?.caption.trim() ?? "";
  const progress = photos.length === 0 ? 0 : mode === "end" ? photos.length : index + 1;

  return (
    <div
      className="trailer"
      role="dialog"
      aria-modal="true"
      aria-label="Our Story trailer"
      onTouchStart={(event) => {
        touchX.current = event.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const start = touchX.current;
        const end = event.changedTouches[0]?.clientX;
        touchX.current = null;
        if (start == null || end == null) return;
        const delta = end - start;
        if (Math.abs(delta) < 48) return;
        step(delta < 0 ? 1 : -1);
      }}
    >
      <div className="trailer-frame">
        {mode === "end" ? (
          <p className="trailer-end">{endCard}</p>
        ) : mode === "overlay" && overlay?.text.trim() ? (
          <p className="cinema-line">{overlay.text}</p>
        ) : memory?.image ? (
          failed ? (
            <p className="memory-fallback">This photo could not be loaded.</p>
          ) : (
            <img
              key={memory.id}
              className={reduceMotion ? "trailer-photo is-still" : `trailer-photo ken-${index % 4}`}
              src={memory.image}
              alt={memory.imageAlt || caption || `Memory ${index + 1}`}
              onError={() => setFailed(true)}
            />
          )
        ) : null}

        {mode === "photo" && caption ? <p className="trailer-caption">{caption}</p> : null}
        {mode !== "end" ? (
          <p className="trailer-count">
            Memory {String(progress).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
          </p>
        ) : null}
      </div>

      <div className="trailer-controls">
        <button type="button" className="icon-btn" aria-label="Previous memory" onClick={() => step(-1)}>
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          className="icon-btn"
          aria-label={playing ? "Pause trailer" : "Play trailer"}
          onClick={() => setPlaying((value) => !value)}
        >
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button type="button" className="icon-btn" aria-label="Next memory" onClick={() => step(1)}>
          <ChevronRight size={18} />
        </button>
        <button type="button" className="icon-btn" aria-label="Replay trailer" onClick={replay}>
          <RotateCcw size={18} />
        </button>
        <button type="button" className="icon-btn" aria-label="Exit movie" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      <div className="trailer-progress" aria-hidden="true">
        <span style={{ width: `${photos.length ? (progress / photos.length) * 100 : 0}%` }} />
      </div>
    </div>
  );
}
