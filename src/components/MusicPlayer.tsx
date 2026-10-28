import { Music, Pause } from "lucide-react";
import { useEffect, useRef } from "react";
import { useUniverseAudio } from "../audio/UniverseAudio";

export function MusicPlayer({ hidden = false }: { hidden?: boolean }) {
  const audio = useUniverseAudio();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bars = 18;
    const data = new Uint8Array(bars);

    const paintStatic = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < bars; i += 1) {
        const h = height * (0.18 + ((i * 3) % 5) * 0.05);
        drawBar(ctx, width, height, bars, i, h, 0.35);
      }
    };

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      const live = audio.playing && !reduce && audio.readLevels(data);
      if (!live) {
        paintStatic();
        return;
      }
      for (let i = 0; i < bars; i += 1) {
        const level = data[i] / 255;
        const h = Math.max(height * 0.12, level * height * 0.9);
        drawBar(ctx, width, height, bars, i, h, 0.45 + level * 0.55);
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    cancelAnimationFrame(rafRef.current);
    if (audio.playing && !reduce) rafRef.current = requestAnimationFrame(draw);
    else paintStatic();
    return () => cancelAnimationFrame(rafRef.current);
  }, [audio.playing, audio.readLevels]);

  if (hidden) return null;

  return (
    <div className="music">
      <div className="music-shell">
        <canvas ref={canvasRef} className="music-viz" width={120} height={28} aria-hidden="true" />
        <button
          type="button"
          className="music-btn"
          aria-pressed={audio.playing}
          aria-label={audio.playing ? `Pause ${audio.label}` : `Play ${audio.label}`}
          onClick={() => void audio.toggle()}
        >
          {audio.playing ? <Pause size={18} /> : <Music size={18} />}
          <span>
            {audio.ended ? `${audio.label} · Ended` : audio.playing ? audio.label : `${audio.label} · Off`}
          </span>
        </button>
      </div>
      {audio.note ? (
        <p className="music-note" role="status">
          {audio.note}
        </p>
      ) : null}
    </div>
  );
}

function drawBar(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  bars: number,
  index: number,
  barHeight: number,
  alpha: number,
) {
  const gap = 2;
  const barWidth = (width - gap * (bars - 1)) / bars;
  const x = index * (barWidth + gap);
  const y = height - barHeight;
  ctx.fillStyle = `rgba(243, 193, 211, ${alpha})`;
  ctx.fillRect(x, y, barWidth, barHeight);
  if (index % 3 === 0) {
    ctx.fillStyle = `rgba(196, 181, 253, ${alpha * 0.85})`;
    ctx.fillRect(x, y, barWidth, barHeight * 0.55);
  }
}
