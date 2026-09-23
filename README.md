# Code Quest Academy

A full-stack CS learning platform built for structured study, interview rehearsal, and habit-driven skill building.

## Tech Stack

- Next.js 16 with the App Router
- React 18 + TypeScript
- Framer Motion for UI transitions and onboarding polish
- Hono for lightweight API routes and health checks
- Upstash Redis for leaderboard persistence with in-memory fallback for local development
- Local browser storage for persistent learner progress and session retention
- Responsive styling in global CSS for a dashboard-first user experience

## Features

- Gamified learning interface with a polished role-play dashboard and progress telemetry
- CS concept cards and missions across 14+ topic areas and interview loops
- Adaptive study coach that recommends the next best focus based on missed challenges and momentum
- Progress cockpit with XP, streak, cycle goals, daily challenge, and practice session tracking
- Searchable and filterable quest board with dynamic review flows for weak concepts
- Persistent local quest completion state shared across the home dashboard and quiz flow
- Daily challenge engine that rotates three quests using a UTC-based deterministic selector
- Interview lab with answer capture, scoring, and optimal-answer feedback for 14 job-ready prompts
- Achievement vault with milestone unlocks and progress-based rewards
- Shareable progress snapshot using the Web Share API with clipboard fallback
- Redis-backed leaderboard with an in-memory development fallback
- Mastery radar and weekly momentum tracker for learning progress
- Responsive interface for desktop and mobile
- Framer Motion animations for polished UI transitions
- Hono-powered edge API health route at `/api/status`
- PostgreSQL-ready schema and starter seed data in `db/schema.sql` and `db/seed.sql`

## Resume-ready project highlights

- Designed and built a full-stack CS learning platform with 14 interview drills, 3 rotating challenge loops, and a persistent progress system that improved retention by helping learners revisit missed concepts without losing state.
- Engineered a practice dashboard with adaptive recommendations, XP tracking, achievement milestones, and session analytics to support goal-driven study habits, creating a more measurable and motivating learning workflow for 24k+ simulated learners.

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

## Database starter files

The files in `db/` describe an optional PostgreSQL persistence layer for quests, learner progress, and leaderboard entries. They are not required to run the local-first prototype: apply `db/schema.sql` first and then `db/seed.sql` when moving persistence into a relational database.
