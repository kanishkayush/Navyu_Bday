/**
 * Editable cinematic copy and timings.
 * Personal photo captions still live in birthdayContent.memories — do not invent memories here.
 */
export const cinematicContent = {
  opening: {
    lines: [
      "Somewhere in this endless universe…",
      "Among billions of stars…",
      "I found my favourite person.",
    ],
    title: "A Universe Called Navyu",
    chapter: "Chapter 23",
    enterLabel: "Enter Our Universe",
    /** Scene clock (ms) for the full cinematic arc. */
    scene: {
      darknessMs: 4000,
      flightMs: 10000,
      linesStartMs: 10000,
      lineHoldMs: 2200,
      titleAtMs: 17000,
      readyAtMs: 21000,
      totalMs: 22000,
    },
  },

  trailer: {
    /** Optional text shown after a photo index (0-based). Leave empty to skip. */
    overlays: [] as Array<{ afterIndex: number; text: string }>,
    endCard: "23 moments. A million feelings. Our story.",
    slideMs: 4200,
    overlayMs: 2400,
    galleryButton: "Our Story",
  },

  finale: {
    wish: "If I could make one wish for every star in this universe, I would still choose more time with you.",
    replayLabel: "Replay our universe",
    returnLabel: "Revisit the galaxy",
  },
};
