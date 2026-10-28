import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useUniverseAudio } from "../audio/UniverseAudio";
import { cinematicContent } from "../content/cinematicContent";

type Phase = "journey" | "ready" | "leaving";

type Star = {
  x: number;
  y: number;
  z: number;
  pz: number;
  shade: number;
};

export function CinematicOpening({
  onEnter,
  reduceMotion,
}: {
  onEnter: () => void;
  reduceMotion: boolean;
}) {
  const { lines, title, chapter, enterLabel, scene } = cinematicContent.opening;
  const audio = useUniverseAudio();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef<Phase>(reduceMotion ? "ready" : "journey");
  const elapsedRef = useRef(0);
  const showTitleRef = useRef(reduceMotion);
  const [phase, setPhase] = useState<Phase>(reduceMotion ? "ready" : "journey");
  const [lineIndex, setLineIndex] = useState(reduceMotion ? lines.length - 1 : -1);
  const [showTitle, setShowTitle] = useState(reduceMotion);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    showTitleRef.current = showTitle;
  }, [showTitle]);

  useEffect(() => {
    if (reduceMotion || phase !== "journey") return;
    const started = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const ms = now - started;
      elapsedRef.current = ms;
      if (ms >= scene.linesStartMs) {
        const lineSlot = Math.floor((ms - scene.linesStartMs) / scene.lineHoldMs);
        setLineIndex(Math.min(lines.length - 1, Math.max(0, lineSlot)));
      }
      if (ms >= scene.titleAtMs) setShowTitle(true);
      if (ms >= scene.readyAtMs) {
        setPhase("ready");
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, reduceMotion, lines.length, scene]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;
    let raf = 0;
    const stars: Star[] = [];
    const count = reduceMotion ? 60 : 160;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      canvas.width = Math.max(1, canvas.clientWidth * dpr);
      canvas.height = Math.max(1, canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    for (let i = 0; i < count; i += 1) {
      stars.push({
        x: Math.random() * canvas.clientWidth - canvas.clientWidth / 2,
        y: Math.random() * canvas.clientHeight - canvas.clientHeight / 2,
        z: Math.random() * canvas.clientWidth,
        pz: 0,
        shade: 0.35 + Math.random() * 0.65,
      });
    }
    for (const star of stars) star.pz = star.z;

    const draw = (now: number) => {
      if (!running) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const cx = width / 2;
      const cy = height / 2;
      const t = now * 0.001;
      const elapsed = elapsedRef.current;
      const speed = reduceMotion
        ? 0.55
        : phaseRef.current === "leaving"
          ? 18
          : 1.1 + Math.min(9, elapsed / 1000);

      ctx.fillStyle = "rgba(5, 4, 15, 0.38)";
      ctx.fillRect(0, 0, width, height);

      const nebula = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(width, height) * 0.55);
      nebula.addColorStop(0, `rgba(150, 110, 220, ${0.08 + Math.sin(t * 0.4) * 0.03})`);
      nebula.addColorStop(0.45, `rgba(120, 60, 140, ${0.07 + Math.cos(t * 0.3) * 0.02})`);
      nebula.addColorStop(1, "rgba(5, 4, 15, 0)");
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, width, height);

      const corePulse = 0.1 + Math.sin(t * 0.7) * 0.03 + Math.min(0.28, elapsed / 38000);
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 190);
      core.addColorStop(0, `rgba(255, 230, 250, ${corePulse})`);
      core.addColorStop(0.35, `rgba(196, 181, 253, ${corePulse * 0.55})`);
      core.addColorStop(1, "rgba(5, 4, 15, 0)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, 190, 0, Math.PI * 2);
      ctx.fill();

      for (const star of stars) {
        star.pz = star.z;
        star.z -= speed;
        if (star.z < 1) {
          star.z = width;
          star.x = Math.random() * width - cx;
          star.y = Math.random() * height - cy;
          star.pz = star.z;
        }
        const sx = (star.x / star.z) * width + cx;
        const sy = (star.y / star.z) * height + cy;
        const px = (star.x / star.pz) * width + cx;
        const py = (star.y / star.pz) * height + cy;
        const size = (1 - star.z / width) * 2.5;
        ctx.strokeStyle = `rgba(246, 241, 234, ${star.shade * (0.3 + size * 0.25)})`;
        ctx.lineWidth = Math.max(0.35, size * 0.5);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
        ctx.fillStyle = `rgba(255, 245, 255, ${star.shade})`;
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(0.35, size), 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduceMotion && Math.floor(t * 2) % 19 === 0) {
        const sx = (Math.sin(t * 3) * 0.4 + 0.5) * width;
        const sy = (Math.cos(t * 2) * 0.2 + 0.25) * height;
        const trail = ctx.createLinearGradient(sx, sy, sx + 90, sy + 24);
        trail.addColorStop(0, "rgba(255,255,255,0.7)");
        trail.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = trail;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + 90, sy + 24);
        ctx.stroke();
      }

      if (showTitleRef.current && !reduceMotion) {
        const burst = Math.min(1, Math.max(0, (elapsed - scene.titleAtMs) / 1200));
        ctx.strokeStyle = `rgba(232, 201, 138, ${0.28 * burst})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(cx, cy, 36 + burst * 100, 0, Math.PI * 2);
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [reduceMotion, scene.titleAtMs]);

  async function enableSound() {
    await audio.play();
  }

  async function handleEnter() {
    if (!audio.playing) await audio.play();
    if (reduceMotion) {
      onEnter();
      return;
    }
    setPhase("leaving");
    window.setTimeout(onEnter, 900);
  }

  const visibleLine = lineIndex >= 0 && !showTitle ? lines[lineIndex] : null;

  return (
    <section
      className={["screen cinema", phase === "leaving" ? "is-leaving" : "", reduceMotion ? "cinema-still" : ""]
        .filter(Boolean)
        .join(" ")}
      aria-label="Cinematic opening"
    >
      <canvas ref={canvasRef} className="cinema-canvas" aria-hidden="true" />
      <div className="cinema-haze cinema-haze-live" aria-hidden="true" />

      <div className="cinema-stage">
        {visibleLine ? <p className="cinema-line">{visibleLine}</p> : null}
        {showTitle ? (
          <>
            <h1 className="cinema-title">{title}</h1>
            <p className="chapter cinema-chapter">{chapter}</p>
          </>
        ) : null}
        {phase === "ready" || phase === "leaving" ? (
          <button type="button" className="enter cinema-enter" onClick={() => void handleEnter()}>
            {enterLabel}
          </button>
        ) : (
          <button
            type="button"
            className="text-btn cinema-skip"
            onClick={() => {
              setShowTitle(true);
              setLineIndex(lines.length - 1);
              setPhase("ready");
            }}
          >
            Skip intro
          </button>
        )}
      </div>

      <div className="cinema-audio">
        {!audio.playing ? (
          <button type="button" className="music-btn" onClick={() => void enableSound()}>
            Start music
          </button>
        ) : (
          <button
            type="button"
            className="music-btn"
            aria-pressed={audio.muted}
            aria-label={audio.muted ? "Unmute music" : "Mute music"}
            onClick={audio.toggleMute}
          >
            {audio.muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            <span>{audio.muted ? "Muted" : "Sound on"}</span>
          </button>
        )}
      </div>
    </section>
  );
}
