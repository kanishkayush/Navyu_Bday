import { Lock, Unlock } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useState } from "react";
import { birthdayContent } from "../content/birthdayContent";
import type { Remaining } from "../lib/unlock";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function CountdownScreen({
  remaining,
  onEnter,
}: {
  remaining: Remaining;
  onEnter: () => void;
}) {
  const reduce = useReducedMotion() === true;
  const [nudge, setNudge] = useState("");
  const { nickname, age } = birthdayContent;
  const unlocked = remaining.unlocked;

  return (
    <section className={unlocked ? "screen countdown is-open" : "screen countdown"} aria-label="Birthday countdown">
      <div className="countdown-dust" aria-hidden="true">
        {Array.from({ length: reduce ? 0 : 12 }, (_, index) => (
          <span key={index} style={{ ["--i" as string]: index }} />
        ))}
      </div>

      <p className="chapter">{unlocked ? `Chapter ${age}` : "A Universe Called Navyu"}</p>
      <h1 className="title countdown-title">
        {unlocked ? `Happy 23rd Birthday, ${nickname}` : `Something magical is waiting, ${nickname} ✨`}
      </h1>
      <p className="quote">
        {unlocked
          ? "Your universe is open. Come in whenever you are ready."
          : "Your universe is almost ready to open."}
      </p>

      {!unlocked ? (
        <div className="countdown-grid" role="timer" aria-live="polite" aria-atomic="true">
          <TimeCell label="Days" value={remaining.days} />
          <TimeCell label="Hours" value={pad(remaining.hours)} />
          <TimeCell label="Minutes" value={pad(remaining.minutes)} />
          <TimeCell label="Seconds" value={pad(remaining.seconds)} />
        </div>
      ) : null}

      <div className={unlocked ? "lock-badge is-open" : "lock-badge"} aria-live="polite">
        {unlocked ? <Unlock size={22} aria-hidden="true" /> : <Lock size={22} aria-hidden="true" />}
        <span>{unlocked ? "Universe unlocked" : "Universe locked until midnight"}</span>
      </div>

      {!unlocked ? (
        <p className="countdown-note">
          This little universe opens at midnight on 28 October 2026, India time — made for you, {nickname}.
        </p>
      ) : null}

      {unlocked ? (
        <button type="button" className="enter" onClick={onEnter}>
          Enter My Universe ✨
        </button>
      ) : (
        <button
          type="button"
          className="enter is-locked"
          aria-disabled="true"
          onClick={() => setNudge("Not yet, Navyu… thoda sa aur wait. 💗")}
        >
          <Lock size={16} aria-hidden="true" />
          Enter My Universe ✨
        </button>
      )}

      {nudge && !unlocked ? (
        <p className="countdown-nudge" role="status">
          {nudge}
        </p>
      ) : null}
    </section>
  );
}

function TimeCell({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="time-cell">
      <span className="time-value">{value}</span>
      <span className="time-label">{label}</span>
    </div>
  );
}
