# Code Quest Academy

A fun CS learning platform concept built with Next.js for Vercel deployment.

## Features

- Gamified learning interface
- CS concept cards and missions
- Progress cockpit with XP, streak, cycle goals, and daily challenge
- Searchable and filterable quest board
- Persistent local quest completion state shared across the home dashboard and quiz flow
- Redis-backed leaderboard with an in-memory development fallback
- Responsive interface for desktop and mobile

## Local development

```bash
npm install
npm run dev
```

## Deploy on Vercel

1. Push this project to GitHub.
2. Import it in Vercel.
3. Use the default Next.js settings.
4. Deploy.

## Progress storage

Quest completion is stored in the browser under `code-quest:progress`, so the prototype works without authentication or a database. Leaderboard submissions use Upstash Redis when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are present, and fall back to process memory for local development.
