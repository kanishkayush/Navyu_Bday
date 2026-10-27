import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { birthdayContent } from "../content/birthdayContent";

export function LoveLetter() {
  const { greeting, paragraphs, signature } = birthdayContent.letter;
  const voice = birthdayContent.audio.voiceSrc;
  const [open, setOpen] = useState(false);
  const [voiceError, setVoiceError] = useState(false);
  const reduce = useReducedMotion();
  const body = paragraphs.map((paragraph) => paragraph.trim()).filter(Boolean).join("\n\n");
  const hasLetter = Boolean(greeting.trim() || body || signature.trim());

  if (!open) {
    return (
      <div className="letter-sealed">
        <button type="button" className="envelope" onClick={() => setOpen(true)}>
          <span className="flap" aria-hidden="true" />
          <span className="pocket" aria-hidden="true" />
          <span className="envelope-label">Open the letter</span>
        </button>
      </div>
    );
  }

  if (!hasLetter) {
    return <p className="empty-copy">The letter has not been placed here yet.</p>;
  }

  return (
    <motion.article
      className="paper"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      {voice ? (
        <div className="voice">
          {voiceError ? (
            <p role="status">The voice note could not be played.</p>
          ) : (
            <audio controls preload="none" src={voice} onError={() => setVoiceError(true)}>
              Voice note
            </audio>
          )}
        </div>
      ) : null}
      <TypedBody greeting={greeting.trim()} body={body} signature={signature.trim()} />
    </motion.article>
  );
}

function TypedBody({ greeting, body, signature }: { greeting: string; body: string; signature: string }) {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(reduce || body.length === 0 ? body.length : 0);
  const timer = useRef<number | null>(null);
  const done = count >= body.length;

  useEffect(() => {
    if (reduce || body.length === 0) return;
    let index = 0;
    timer.current = window.setInterval(() => {
      index = Math.min(body.length, index + 3);
      setCount(index);
      if (index >= body.length && timer.current) window.clearInterval(timer.current);
    }, 16);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [body, reduce]);

  return (
    <div>
      {greeting ? <p className="greeting">{greeting}</p> : null}
      <p className="letter-body">{body.slice(0, count)}</p>
      {done && signature ? <p className="signature">{signature}</p> : null}
      {!done ? (
        <button
          type="button"
          className="text-btn"
          onClick={() => {
            if (timer.current) window.clearInterval(timer.current);
            setCount(body.length);
          }}
        >
          Show the full letter
        </button>
      ) : null}
    </div>
  );
}
