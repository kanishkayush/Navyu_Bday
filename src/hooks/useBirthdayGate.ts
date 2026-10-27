import { useEffect, useState } from "react";
import { BIRTHDAY_UNLOCK_MS, createClock, remainingUntil, type Remaining } from "../lib/unlock";

export function useBirthdayGate(getNow: () => number = createClock()) {
  const [remaining, setRemaining] = useState<Remaining>(() => remainingUntil(BIRTHDAY_UNLOCK_MS, getNow()));

  useEffect(() => {
    const tick = () => setRemaining(remainingUntil(BIRTHDAY_UNLOCK_MS, getNow()));
    tick();
    const id = window.setInterval(tick, 1000);
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [getNow]);

  return remaining;
}
