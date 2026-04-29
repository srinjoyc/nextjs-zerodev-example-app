# Next.js Counter App

A basic Next.js 14 starter using the App Router, TypeScript, and Tailwind CSS, with a simple client-side counter demo.

## Getting started

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — build for production
- `npm start` — run the production build
- `npm run lint` — run ESLint

## Project structure

```
nextjs-counter-app/
├── app/
│   ├── counter.tsx      # Client component with useState
│   ├── globals.css      # Tailwind + base styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page (server component)
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

The counter lives in `app/counter.tsx` and is marked with `"use client"` so it can use React state. `app/page.tsx` stays a server component and imports the counter.
