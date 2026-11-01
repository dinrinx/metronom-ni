# Metronome Alfa Final

Next.js 16 demo-prototype with mobile flows for Metronome inside Alfa Bank.

## Local Start

Requirements:

- Node.js `>=20.9.0`
- npm

Commands:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

## Environment Variables

Base setup:

```dotenv
NEXT_PUBLIC_LLM_MODE=auto
GIGACHAT_AUTH_KEY=
GIGACHAT_SCOPE=GIGACHAT_API_PERS
GIGACHAT_MODEL=GigaChat-3-Ultra
```

Notes:

- `NEXT_PUBLIC_LLM_MODE=auto` is the default and safe choice for Vercel.
- If `GIGACHAT_AUTH_KEY` is not set, the product can still work with fallback explanations in demo scenarios.
- `GIGACHAT_AUTH_KEY` must be provided in Vercel only if you want live GigaChat responses from `/api/gigachat`.

## Checks Before Deploy

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Verified locally on August 12, 2026:

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

## Deploy To Vercel

1. Push the project to GitHub, GitLab, or Bitbucket.
2. In Vercel, click `Add New...` -> `Project`.
3. Import this repository.
4. Keep the root directory as the repository root.
5. Let Vercel detect `Next.js`.
6. In `Environment Variables`, add:
   - `NEXT_PUBLIC_LLM_MODE=auto`
   - `GIGACHAT_AUTH_KEY` only if live GigaChat mode is needed
   - `GIGACHAT_SCOPE=GIGACHAT_API_PERS`
   - `GIGACHAT_MODEL=GigaChat-3-Ultra`
7. Start the first deploy.

Recommended Vercel settings:

- Install command: `npm ci`
- Build command: `npm run build`
- Output: default for Next.js
- Node.js version: `20.x` or newer

## Smoke Check After Deploy

Open and verify these routes:

- `/`
- `/cycle/fundraise/recommend`
- `/cycle/fundraise/compare`
- `/envelopes/detail`
- `/reserve-rule`

What to check:

- recommendation cards are tappable on `/cycle/fundraise/recommend`
- `/cycle/fundraise/compare` fits on one mobile screen without awkward overflow
- envelope detail screen has no top segmented plaque
- reserve rule red card has balanced top and bottom spacing

## Important Runtime Detail

The API route `/api/gigachat` is configured with:

- `runtime = "nodejs"`
- `dynamic = "force-dynamic"`

This is compatible with Vercel and does not require extra deployment config.
