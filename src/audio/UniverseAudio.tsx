import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { birthdayContent } from "../content/birthdayContent";

type UniverseAudioApi = {
  playing: boolean;
  muted: boolean;
  ended: boolean;
  src: string;
  label: string;
  note: string;
  play: () => Promise<void>;
  pause: () => void;
  toggle: () => Promise<void>;
  toggleMute: () => void;
  /** Frequency bins for the visualiser. Empty when analyser is unavailable. */
  readLevels: (target: Uint8Array) => boolean;
  audioElement: HTMLAudioElement | null;
};

const Ctx = createContext<UniverseAudioApi | null>(null);

const log =
  import.meta.env.DEV
    ? (event: string, detail?: unknown) => {
        console.debug(`[universe-audio] ${event}`, detail ?? "");
      }
    : () => undefined;

export function UniverseAudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const graphRef = useRef<{
    context: AudioContext;
    analyser: AnalyserNode;
    source: MediaElementAudioSourceNode;
  } | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [note, setNote] = useState("");
  const src = birthdayContent.audio.musicSrc;
  const label = birthdayContent.audio.musicLabel?.trim() || "Music";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = muted;
  }, [muted]);

  // Never close the AudioContext here — closing it disconnects the media element and kills sound.
  useEffect(() => {
    return () => {
      log("provider-unmount");
    };
  }, []);

  const ensureGraph = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;
    if (graphRef.current) {
      if (graphRef.current.context.state === "suspended") {
        await graphRef.current.context.resume();
        log("context-resume", graphRef.current.context.state);
      }
      return true;
    }
    const AudioCtx =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return false;
    try {
      const context = new AudioCtx();
      const analyser = context.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.78;
      // One MediaElementSource for the life of the page.
      const source = context.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(context.destination);
      graphRef.current = { context, analyser, source };
      if (context.state === "suspended") await context.resume();
      log("graph-ready", context.state);
      return true;
    } catch (error) {
      log("graph-failed", error);
      return false;
    }
  }, []);

  const play = useCallback(async () => {
    if (!src) {
      setNote("No song has been added yet.");
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    try {
      await ensureGraph();
      await audio.play();
      setPlaying(true);
      setEnded(false);
      setNote("");
      log("play");
    } catch (error) {
      setPlaying(false);
      setNote("Playback did not start. Press play again.");
      log("play-rejected", error);
    }
  }, [ensureGraph, src]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setPlaying(false);
    log("pause");
  }, []);

  const toggle = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      pause();
      return;
    }
    await play();
  }, [pause, play]);

  const toggleMute = useCallback(() => {
    setMuted((value) => !value);
  }, []);

  const readLevels = useCallback((target: Uint8Array) => {
    const graph = graphRef.current;
    if (!graph) return false;
    graph.analyser.getByteFrequencyData(target as Uint8Array<ArrayBuffer>);
    return true;
  }, []);

  const value = useMemo<UniverseAudioApi>(
    () => ({
      playing,
      muted,
      ended,
      src,
      label,
      note,
      play,
      pause,
      toggle,
      toggleMute,
      readLevels,
      audioElement: audioRef.current,
    }),
    [playing, muted, ended, src, label, note, play, pause, toggle, toggleMute, readLevels],
  );

  return (
    <Ctx.Provider value={value}>
      {src ? (
        <audio
          ref={audioRef}
          src={encodeURI(src)}
          loop
          preload="metadata"
          onPlay={() => {
            setPlaying(true);
            setEnded(false);
            log("event-play");
          }}
          onPause={() => {
            setPlaying(false);
            log("event-pause", { currentTime: audioRef.current?.currentTime });
          }}
          onEnded={() => {
            // loop=true normally prevents ended; keep handler honest if loop is ever removed.
            setPlaying(false);
            setEnded(true);
            log("event-ended");
          }}
          onError={() => {
            setPlaying(false);
            setNote("That audio file could not be played.");
            log("event-error");
          }}
        />
      ) : null}
      {children}
    </Ctx.Provider>
  );
}

export function useUniverseAudio() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useUniverseAudio must be used inside UniverseAudioProvider");
  return ctx;
}
