# Code Quest Academy

A fun CS learning platform concept built with Next.js for Vercel deployment.

## Features

- Gamified learning interface
- CS concept cards and missions
- Progress cockpit with XP, streak, cycle goals, and daily challenge
- Searchable and filterable quest board
- Persistent local quest completion state shared across the home dashboard and quiz flow
- Adaptive review queue for missed questions to reinforce weak concepts
- Daily challenge engine that rotates three quests using a UTC-based deterministic selector
- Shareable progress snapshot using the Web Share API with clipboard fallback
- Redis-backed leaderboard with an in-memory development fallback
- Mastery radar and weekly momentum tracker for learning progress
- Responsive interface for desktop and mobile
- Framer Motion animations for polished UI transitions
- Hono-powered Vercel Edge API health route at `/api/status`

## Resume-ready project highlights

- Built a full-stack CS learning app with a searchable quest board, 3 rotating daily challenges, and persistent progress tracking across sessions so learners can resume and review missed questions without losing state.
- Implemented a resilient Vercel Edge API and leaderboard flow with Upstash Redis plus an in-memory fallback, exposing 1 live health endpoint and maintaining a ranked list of up to 10 entries when remote storage is unavailable.

## Local development

```bash
npm install
npm run dev
```

Additional framework installed:
- Framer Motion for small animated UI interactions and onboarding polish
- Hono for a lightweight Edge API boundary that runs on Vercel

## Deploy on Vercel

1. Push this project to GitHub.
2. Import it in Vercel.
3. Use the default Next.js settings.
4. Deploy.

## Progress storage

Quest completion is stored in the browser under `code-quest:progress`, so the prototype works without authentication or a database. Leaderboard submissions use Upstash Redis when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are present, and fall back to process memory for local development.
