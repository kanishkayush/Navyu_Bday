# A Universe Called Navyu — Chapter 23

A static birthday site. Personal words, photos, and audio live in one file.

## Run it

```bash
pnpm install
pnpm dev
```

Open the local address Vite prints. `pnpm test` checks the Chapter 23 unlock rule. `pnpm typecheck` and `pnpm build` check the project.

Refreshing the page starts the visit again. Progress is not saved.

## Edit the personal parts

Open `src/content/birthdayContent.ts`.

- `welcomePersonal` — the line under the opening quote.
- `memories` — captions, dates, and photo paths, in order.
- `journeyNote` — the last memory card. Leave it empty to hide it.
- `reasons` — up to 23 reasons. Empty slots stay unwritten.
- `letter` — greeting, paragraphs, and signature.
- `finaleMessage` — the note under the birthday headline.
- `secretMessage` — the quiet star cluster. Leave it empty for a non-personal line.
- `audio.musicSrc` and `audio.voiceSrc` — leave them empty for no audio.

## Photos and audio

Put photos in `public/assets/photos/` and audio in `public/assets/audio/`.

```ts
memories: [
  {
    id: "evening",
    image: "/assets/photos/evening.jpg",
    caption: "Your caption.",
    date: "12 March 2025",
  },
],
audio: {
  musicSrc: "/assets/audio/song.mp3",
  voiceSrc: "",
},
```

A memory with no `image` becomes a text card. Music never starts by itself. If a file is missing, the page says so and keeps working.

## Chapter 23

The birthday world stays sealed until Our Little Galaxy, Planet of 23, and From My Heart have each been opened.

## Deploy on Vercel

The site is a static Vite app. No server, environment variables, or database.

1. Push this folder to a Git host.
2. Import the repository in Vercel.
3. Framework preset: Vite.
4. Build command: `pnpm build`.
5. Output directory: `dist`.

The page sends `noindex` so a public link is less likely to be crawled. Share the URL with the people who should have it.
