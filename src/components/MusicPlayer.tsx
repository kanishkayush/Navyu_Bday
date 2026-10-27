import { Music, Pause } from "lucide-react";
import { useRef, useState } from "react";
import { birthdayContent } from "../content/birthdayContent";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [note, setNote] = useState("");
  const src = birthdayContent.audio.musicSrc;
  const label = birthdayContent.audio.musicLabel?.trim() || "Music";

  async function toggle() {
    if (!src) {
      setPlaying(false);
      setNote("No song has been added yet.");
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      setPlaying(false);
      setNote("");
      return;
    }
    try {
      await audio.play();
      setPlaying(true);
      setNote("");
    } catch {
      setPlaying(false);
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
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
          onError={() => {
            setPlaying(false);
            setNote("That audio file could not be played.");
          }}
        />
      ) : null}
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
      {note ? (
        <p className="music-note" role="status">
          {note}
        </p>
      ) : null}
    </div>
  );
}
