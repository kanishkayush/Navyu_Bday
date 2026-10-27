import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { worldCopy } from "./content/birthdayContent";
import { BirthdayFinale } from "./components/BirthdayFinale";
import { CountdownScreen } from "./components/CountdownScreen";
import { GalaxyScene } from "./components/GalaxyScene";
import { IntroScreen } from "./components/IntroScreen";
import { MusicPlayer } from "./components/MusicPlayer";
import { PlanetBody } from "./components/PlanetStage";
import { PlanetShell } from "./components/PlanetShell";
import { Sky } from "./components/Sky";
import { useBirthdayGate } from "./hooks/useBirthdayGate";
import { createClock } from "./lib/unlock";
import { finaleUnlocked, type PlanetId } from "./lib/progress";

export default function App() {
  const reduce = useReducedMotion() === true;
  const getNow = useMemo(() => createClock(), []);
  const remaining = useBirthdayGate(getNow);
  const [gateOpen, setGateOpen] = useState(false);
  const [screen, setScreen] = useState<"intro" | "universe">("intro");
  const [open, setOpen] = useState<PlanetId | null>(null);
  const [finale, setFinale] = useState(false);
  const [opened, setOpened] = useState<Set<PlanetId>>(() => new Set());
  const [found, setFound] = useState<Set<number>>(() => new Set());

  const fade = {
    initial: reduce ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: reduce ? undefined : { opacity: 0 },
    transition: { duration: 0.45, ease: "easeOut" as const },
  };

  function markOpened(id: PlanetId) {
    setOpened((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  function openPlanet(id: PlanetId) {
    if (id === "chapter" && finaleUnlocked(opened)) {
      markOpened("chapter");
      setOpen(null);
      setFinale(true);
      return;
    }
    if (id !== "chapter") markOpened(id);
    setOpen(id);
  }

  function discover(index: number) {
    setFound((prev) => {
      if (prev.has(index)) return prev;
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }

  let stage = (
    <GalaxyScene opened={opened} lockedAway={open !== null} onOpen={openPlanet} />
  );
  let stageKey = "galaxy";
  if (!gateOpen) {
    stage = (
      <CountdownScreen
        remaining={remaining}
        onEnter={() => {
          setGateOpen(true);
          setScreen("intro");
        }}
      />
    );
    stageKey = remaining.unlocked ? "countdown-open" : "countdown-locked";
  } else if (screen === "intro") {
    stage = <IntroScreen onEnter={() => setScreen("universe")} />;
    stageKey = "intro";
  } else if (finale) {
    stage = <BirthdayFinale motionOff={reduce} onReturn={() => setFinale(false)} />;
    stageKey = "finale";
  }

  return (
    <>
      <Sky />
      {gateOpen ? <MusicPlayer /> : null}
      <AnimatePresence mode="wait">
        <motion.div key={stageKey} {...fade}>
          {stage}
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
        {gateOpen && open ? (
          <motion.div
            key={open}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <PlanetShell
              title={worldCopy[open].name}
              kicker={worldCopy[open].description}
              wide={open === "reasons"}
              onClose={() => setOpen(null)}
            >
              <PlanetBody id={open} opened={opened} found={found} onDiscover={discover} />
            </PlanetShell>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
