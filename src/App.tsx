import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { UniverseAudioProvider } from "./audio/UniverseAudio";
import { worldCopy } from "./content/birthdayContent";
import { BirthdayFinale } from "./components/BirthdayFinale";
import { CinematicOpening } from "./components/CinematicOpening";
import { CountdownScreen } from "./components/CountdownScreen";
import { GalaxyScene } from "./components/GalaxyScene";
import { MemoryTrailer } from "./components/MemoryTrailer";
import { MusicPlayer } from "./components/MusicPlayer";
import { PlanetBody } from "./components/PlanetStage";
import { PlanetShell } from "./components/PlanetShell";
import { Sky } from "./components/Sky";
import { useBirthdayGate } from "./hooks/useBirthdayGate";
import { discoverMemory } from "./lib/constellation";
import { createClock } from "./lib/unlock";
import { finaleUnlocked, type PlanetId } from "./lib/progress";

type Screen = "cinema" | "universe";

export default function App() {
  return (
    <UniverseAudioProvider>
      <AppExperience />
    </UniverseAudioProvider>
  );
}

function AppExperience() {
  const reduce = useReducedMotion() === true;
  const getNow = useMemo(() => createClock(), []);
  const remaining = useBirthdayGate(getNow);
  const [gateOpen, setGateOpen] = useState(false);
  const [screen, setScreen] = useState<Screen>("cinema");
  const [open, setOpen] = useState<PlanetId | null>(null);
  const [finale, setFinale] = useState(false);
  const [trailer, setTrailer] = useState(false);
  const [opened, setOpened] = useState<Set<PlanetId>>(() => new Set());
  const [found, setFound] = useState<Set<number>>(() => new Set());
  const [discoveredMemories, setDiscoveredMemories] = useState<Set<string>>(() => new Set());

  const fade = {
    initial: reduce ? false : { opacity: 0, scale: 1.04 },
    animate: { opacity: 1, scale: 1 },
    exit: reduce ? undefined : { opacity: 0, scale: 0.98 },
    transition: { duration: 0.7, ease: "easeOut" as const },
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

  const discoverPhoto = useCallback((id: string) => {
    setDiscoveredMemories((prev) => {
      const next = discoverMemory(prev, id);
      return next === prev ? prev : new Set(next);
    });
  }, []);

  let stage = (
    <GalaxyScene
      opened={opened}
      lockedAway={open !== null || trailer}
      onOpen={openPlanet}
      onOpenTrailer={() => setTrailer(true)}
    />
  );
  let stageKey = "galaxy";
  if (!gateOpen) {
    stage = (
      <CountdownScreen
        remaining={remaining}
        onEnter={() => {
          setGateOpen(true);
          setScreen("cinema");
          setFinale(false);
          setTrailer(false);
        }}
      />
    );
    stageKey = remaining.unlocked ? "countdown-open" : "countdown-locked";
  } else if (screen === "cinema") {
    stage = (
      <CinematicOpening
        reduceMotion={reduce}
        onEnter={() => {
          setScreen("universe");
          setFinale(false);
        }}
      />
    );
    stageKey = "cinema";
  } else if (finale) {
    stage = (
      <BirthdayFinale
        motionOff={reduce}
        onReturn={() => setFinale(false)}
        onReplay={() => {
          setFinale(false);
          setOpen(null);
          setTrailer(false);
          setScreen("cinema");
        }}
      />
    );
    stageKey = "finale";
  }

  return (
    <>
      <Sky />
      {/* Keep the player mounted after unlock so visualiser state is stable; hide during cinema/trailer UI. */}
      {gateOpen ? <MusicPlayer hidden={screen === "cinema" || trailer} /> : null}
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
              wide={open === "reasons" || open === "memories"}
              onClose={() => setOpen(null)}
            >
              <PlanetBody
                id={open}
                opened={opened}
                found={found}
                onDiscover={discover}
                discoveredMemories={discoveredMemories}
                onDiscoverMemory={discoverPhoto}
              />
            </PlanetShell>
          </motion.div>
        ) : null}
      </AnimatePresence>
      {gateOpen && trailer ? <MemoryTrailer reduceMotion={reduce} onClose={() => setTrailer(false)} /> : null}
    </>
  );
}
