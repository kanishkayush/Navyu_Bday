import { Music, Pause } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { birthdayContent } from "../content/birthdayContent";

type PlayState = "idle" | "playing" | "paused" | "ended" | "error";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioGraph = useRef<{
    context: AudioContext;
    analyser: AnalyserNode;
    source: MediaElementAudioSourceNode;
  } | null>(null);
  const rafRef = useRef(0);
  const [playState, setPlayState] = useState<PlayState>("idle");
  const [note, setNote] = useState("");
  const [visualReady, setVisualReady] = useState(false);
  const src = birthdayContent.audio.musicSrc;
  const label = birthdayContent.audio.musicLabel?.trim() || "Music";
  const playing = playState === "playing";

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      // Keep the shared graph alive only for this player instance; close on unmount.
      if (audioGraph.current) {
        void audioGraph.current.context.close().catch(() => undefined);
        audioGraph.current = null;
      }
    };
  }, []);

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
      const graph = audioGraph.current;
      if (!graph || playState !== "playing" || reduce) {
        paintStatic();
        return;
      }
      graph.analyser.getByteFrequencyData(data);
      for (let i = 0; i < bars; i += 1) {
        const level = data[i] / 255;
        const h = Math.max(height * 0.12, level * height * 0.9);
        drawBar(ctx, width, height, bars, i, h, 0.45 + level * 0.55);
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    cancelAnimationFrame(rafRef.current);
    if (playState === "playing" && visualReady && !reduce) {
      rafRef.current = requestAnimationFrame(draw);
    } else {
      paintStatic();
    }

    return () => cancelAnimationFrame(rafRef.current);
  }, [playState, visualReady]);

  async function ensureAnalyser(audio: HTMLAudioElement) {
    if (audioGraph.current) {
      if (audioGraph.current.context.state === "suspended") {
        await audioGraph.current.context.resume();
      }
      return true;
    }
    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return false;
    try {
      const context = new AudioCtx();
      const analyser = context.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.78;
      const source = context.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(context.destination);
      audioGraph.current = { context, analyser, source };
      if (context.state === "suspended") await context.resume();
      setVisualReady(true);
      return true;
    } catch {
      setVisualReady(false);
      return false;
    }
  }

  async function toggle() {
    if (!src) {
      setPlayState("error");
      setNote("No song has been added yet.");
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      setPlayState("paused");
      setNote("");
      return;
    }
    try {
      await ensureAnalyser(audio);
      await audio.play();
      setPlayState("playing");
      setNote("");
    } catch {
      setPlayState("error");
      setNote("Playback did not start. Press the button again.");
    }
  }

  return (
    <div className="music">
      {src ? (
        <audio
          ref={audioRef}
          src={encodeURI(src)}
          loop
          preload="none"
          onPlay={() => setPlayState("playing")}
          onPause={() => setPlayState(audioRef.current?.ended ? "ended" : "paused")}
          onEnded={() => setPlayState("ended")}
          onError={() => {
            setPlayState("error");
            setNote("That audio file could not be played.");
          }}
        />
      ) : null}
      <div className="music-shell">
        <canvas ref={canvasRef} className="music-viz" width={120} height={28} aria-hidden="true" />
        <button
          type="button"
          className="music-btn"
          aria-pressed={playing}
          aria-label={playing ? `Pause ${label}` : `Play ${label}`}
          onClick={() => void toggle()}
        >
          {playing ? <Pause size={18} /> : <Music size={18} />}
          <span>{playing ? label : `${label} · Off`}</span>
        </button>
      </div>
      {note ? (
        <p className="music-note" role="status">
          {note}
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
