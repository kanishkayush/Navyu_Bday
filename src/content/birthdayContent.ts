import type { PlanetId } from "../lib/progress";

export type Memory = {
  id: string;
  /** Public path, for example "/assets/photos/evening.jpg". Omit for a text card. */
  image?: string;
  /** Used as the image alt text when imageAlt is empty. */
  caption: string;
  imageAlt?: string;
  /** Shown as you type it, for example "12 March 2025". */
  date?: string;
};

/**
 * Everything personal lives in this file.
 * Animation code reads these fields and does not invent your story.
 * Leave a field empty until you are ready. The site will show an honest empty state.
 */
export const birthdayContent = {
  /** Her name, used in a few quiet labels. */
  displayName: "Navya",
  /** The name the universe speaks. */
  nickname: "Navyu",
  age: 23,
  /** Shown on the finale. Write it the way you want it read. */
  birthdayLabel: "28 October 2026",

  welcomeGeneric:
    "Somewhere in this endless universe, there is one person who makes everything feel a little more magical.",
  /**
   * Your line, under the quote on the welcome screen.
   * Leave "" until you write it. Example: "Happy birthday, Navyu. This sky is yours."
   */
  welcomePersonal: "",

  /**
   * Photos for Our Little Galaxy, in display order.
   * Put image files in public/assets/photos and point image at "/assets/photos/file.jpg".
   * Leave caption "" when there is no story for that photo. Do not invent memories.
   */
  memories: [
    { id: "IMG_E8958", image: "/assets/photos/IMG_E8958.JPG", caption: "", imageAlt: "Photo 1" },
    { id: "IMG_E9874", image: "/assets/photos/IMG_E9874.JPG", caption: "", imageAlt: "Photo 2" },
    { id: "KNNL1549", image: "/assets/photos/KNNL1549.JPG", caption: "", imageAlt: "Photo 3" },
    { id: "OYAG0820", image: "/assets/photos/OYAG0820.JPG", caption: "", imageAlt: "Photo 4" },
    { id: "PYTP4015", image: "/assets/photos/PYTP4015.JPG", caption: "", imageAlt: "Photo 5" },
    { id: "QHQV2283", image: "/assets/photos/QHQV2283.JPG", caption: "", imageAlt: "Photo 6" },
    { id: "SITM6365", image: "/assets/photos/SITM6365.JPG", caption: "", imageAlt: "Photo 7" },
    { id: "SSMIE2424", image: "/assets/photos/SSMIE2424.JPG", caption: "", imageAlt: "Photo 8" },
    { id: "SVNIE5844", image: "/assets/photos/SVNIE5844.JPG", caption: "", imageAlt: "Photo 9" },
    { id: "TSDXE4442", image: "/assets/photos/TSDXE4442.JPG", caption: "", imageAlt: "Photo 10" },
    { id: "UIOFE6753", image: "/assets/photos/UIOFE6753.JPG", caption: "", imageAlt: "Photo 11" },
    { id: "ULXA6812", image: "/assets/photos/ULXA6812.JPG", caption: "", imageAlt: "Photo 12" },
    { id: "UQGA2610", image: "/assets/photos/UQGA2610.JPG", caption: "", imageAlt: "Photo 13" },
    { id: "URNC5959", image: "/assets/photos/URNC5959.JPG", caption: "", imageAlt: "Photo 14" },
    { id: "VBPV0707", image: "/assets/photos/VBPV0707.JPG", caption: "", imageAlt: "Photo 15" },
    { id: "VJADE9571", image: "/assets/photos/VJADE9571.JPG", caption: "", imageAlt: "Photo 16" },
    { id: "VNNFE4296", image: "/assets/photos/VNNFE4296.JPG", caption: "", imageAlt: "Photo 17" },
    { id: "VNQO5480", image: "/assets/photos/VNQO5480.JPG", caption: "", imageAlt: "Photo 18" },
    { id: "VUPME4569", image: "/assets/photos/VUPME4569.JPG", caption: "", imageAlt: "Photo 19" },
    { id: "WBFPE7420", image: "/assets/photos/WBFPE7420.JPG", caption: "", imageAlt: "Photo 20" },
    { id: "WVLR5403", image: "/assets/photos/WVLR5403.JPG", caption: "", imageAlt: "Photo 21" },
    { id: "XJUY5554", image: "/assets/photos/XJUY5554.JPG", caption: "", imageAlt: "Photo 22" },
    { id: "XNGQE3643", image: "/assets/photos/XNGQE3643.JPG", caption: "", imageAlt: "Photo 23" },
  ] as Memory[],
  /** Last card in the memory world. Leave "" to hide it. */
  journeyNote: "",

  /**
   * One reason per year. The site reads `age` slots (23).
   * Empty slots stay unwritten. Do not pad this list with filler.
   */
  reasons: [
    "Your presence calms me.",
    "Your smile is a medicine.",
    "Your eyes are the most beautiful thing I have ever seen.",
    "You are my chotubaby — my sweetest and cutest.",
    "I admire you as a person.",
    "You are so intelligent.",
    "You care about people so much.",
    "You are so innocent.",
    "Your body is the definition of beauty.",
    "You are sexy as hell.",
    "Your voice is like a melody.",
    "The way you tolerate me.",
    "Your dressing sense is amazing.",
    "Your hugs literally feel like home.",
    "I love how you cheer me up over the little things.",
    "I am grateful for everything you do for me.",
    "I love how you scold me when I don’t take care of myself.",
    "I love how you listen to my nonsense every day.",
    "I love how you give me all the little updates about your day, and still find time to text or call me even on your busiest days.",
    "Thank you for being there for me always.",
    "Really sorry, bachha, for every time I talked rudely to you.",
    "I will choose you every day for the rest of my 7 janams, cutuu.",
    "I really, really love you infinity times, my Navyuuuuu.",
  ],

  letter: {
    /** First line, for example "My Navyu,". Leave "" to hide. */
    greeting: "To my Navyu, 😘",
    /** Each string is one paragraph. */
    paragraphs: [
      "Happy 23rd birthday, my love. ♡",
      "I wish I could put everything I feel for you into words, but somehow, no matter how much I write, it never feels like enough. You mean so much more to me than I could ever properly explain.",
      "Sometimes I wonder how one person can become such a special part of another person's life. How someone can make an ordinary day feel different just by being in it. And then I think of you, and somehow, it all makes sense.",
      "Navyu, if there's one thing I want you to know today, it's that you are so incredibly special to me. Not just because of the big things, but because of all the little things that make you you. The little moments, the conversations, the smiles, the silly things, and all those things that might seem ordinary to you but mean so much more to me than you realise.",
      "As you turn 23, I hope this new chapter of your life brings you happiness that stays, opportunities that excite you, people who appreciate you, and countless reasons to smile. I hope you achieve the things you've been dreaming of, become everything you want to be, and never forget how amazing you are.",
      "And on the days when things don't go the way you want, I hope you remember that you don't have to have everything figured out. You can have difficult days, feel lost sometimes, and take your time. You deserve love, happiness, patience, and all the beautiful things life has to offer.",
      "I wish I could give you the whole universe for your birthday. But since that's a little difficult, I made you this tiny one instead. Every star, every little surprise, and every corner of this universe is here to remind you of one thing: you are loved, Bachha. More than these words can ever explain.",
      "I hope that when you look back at this birthday someday, you remember how special you are and how much you deserve to be celebrated.",
      "Happy 23rd birthday, my favourite person. Thank you for being you.",
      "Really sorry this year I am not there with you on your special day cute🥰",
      "Here's to you, to your happiness, and to all the beautiful chapters still waiting for you.",
    ],
    /** How you sign. Leave "" to hide. Example: "Always, your name" */
    signature: "With all my love,\nAyuuu😘😘😘😘😘",
  },

  /** Spoken under the birthday headline. Leave "" until you write it. */
  finaleMessage: "",

  /**
   * Shown when the quiet star cluster in the galaxy is opened.
   * Leave "" to keep a short non-personal line that does not describe your relationship.
   */
  secretMessage: "",

  audio: {
    /**
     * Exact local file under public/assets/audio.
     * Spaces in the filename are fine — the player encodes the URL.
     */
    musicSrc:
      "/assets/audio/Nazm Nazm (Lyrics) Bareilly Ki Barfi  Kriti Sanon  Arko  Ayushmann Khurrana  Rajkummar Rao. (1).mp3",
    /** Shown next to the music control. Taken from the track title in the filename. */
    musicLabel: "Nazm Nazm",
    /** File for a voice note beside the letter. "" hides the control. */
    voiceSrc: "",
  },
};

export const worldCopy: Record<PlanetId, { name: string; description: string }> = {
  memories: {
    name: "Our Little Galaxy",
    description: "Photos and moments",
  },
  reasons: {
    name: "Planet of 23",
    description: "Twenty-three stars",
  },
  letter: {
    name: "From My Heart",
    description: "A letter for you",
  },
  chapter: {
    name: "Chapter 23",
    description: "The birthday reveal",
  },
};

export function displayReasons() {
  return Array.from({ length: birthdayContent.age }, (_, index) => birthdayContent.reasons[index]?.trim() ?? "");
}
