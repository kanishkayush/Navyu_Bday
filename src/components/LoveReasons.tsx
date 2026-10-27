import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { displayReasons } from "../content/birthdayContent";

export function LoveReasons({
  found,
  onDiscover,
}: {
  found: ReadonlySet<number>;
  onDiscover: (index: number) => void;
}) {
  const reasons = displayReasons();
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState<number | null>(null);
  const written = reasons.filter(Boolean).length;
  const complete = found.size === reasons.length && reasons.length > 0;

  return (
    <div>
      <p className="counter" role="status">
        {found.size} / {reasons.length} discovered.
      </p>
      {current !== null ? (
        <motion.div
          key={current}
          className="reason-card"
          role="status"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="kicker">Reason {current + 1}</p>
          <p>{reasons[current] || "This star does not have its reason yet."}</p>
        </motion.div>
      ) : (
        <p className="hint">Choose a star. Each one keeps a single reason.</p>
      )}
      {complete ? (
        <p className="celebrate" role="status">
          {written === reasons.length ? "You found every reason." : `You found all ${reasons.length} stars.`}
        </p>
      ) : null}
      <div className="reason-field">
        <ul className="reason-grid">
          {reasons.map((reason, index) => {
            const open = found.has(index);
            const spot = starPosition(index, reasons.length);
            return (
              <li key={index}>
                <button
                  type="button"
                  className={open ? "star is-found" : "star"}
                  style={{ ["--x" as string]: spot.left, ["--y" as string]: spot.top }}
                  aria-pressed={open}
                  aria-label={
                    open
                      ? `Reason ${index + 1}, discovered. ${reason || "Not written yet."}`
                      : `Reason ${index + 1}, sealed`
                  }
                  onClick={() => {
                    setCurrent(index);
                    onDiscover(index);
                  }}
                >
                  <span className="star-dot" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function starPosition(index: number, total: number) {
  const innerCount = Math.ceil(total / 2);
  const inner = index < innerCount;
  const count = inner ? innerCount : total - innerCount;
  const local = inner ? index : index - innerCount;
  const turn = (local / count) * Math.PI * 2 - Math.PI / 2 + (inner ? 0.22 : 0);
  const rx = inner ? 26 : 38;
  const ry = inner ? 30 : 36;
  return {
    left: `${50 + Math.cos(turn) * rx}%`,
    top: `${50 + Math.sin(turn) * ry}%`,
  };
}
