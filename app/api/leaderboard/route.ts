import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

type LeaderboardEntry = {
  name: string;
  xp: number;
  streak: number;
  badge: string;
};

const LEADERBOARD_KEY = 'code-quest:leaderboard';
const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { name: 'Byte Knight', xp: 12450, streak: 9, badge: 'Logic Legend' },
  { name: 'Pixel Sage', xp: 11680, streak: 7, badge: 'Bug Slayer' },
  { name: 'Null Ninja', xp: 9820, streak: 6, badge: 'Compiler Whisperer' },
  { name: 'Hash Hero', xp: 8610, streak: 5, badge: 'Data Ranger' },
];

let memoryLeaderboard: LeaderboardEntry[] = [...DEFAULT_LEADERBOARD];

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

function isLeaderboardEntry(value: unknown): value is LeaderboardEntry {
  if (!value || typeof value !== 'object') return false;

  const entry = value as Record<string, unknown>;
  return (
    typeof entry.name === 'string' &&
    typeof entry.xp === 'number' &&
    typeof entry.streak === 'number' &&
    typeof entry.badge === 'string'
  );
}

async function readLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    if (redis) {
      const value = await redis.get<LeaderboardEntry[]>(LEADERBOARD_KEY);
      if (Array.isArray(value) && value.length > 0 && value.every(isLeaderboardEntry)) {
        memoryLeaderboard = value;
        return value;
      }
    }
  } catch (error) {
    console.warn('Falling back to in-memory leaderboard storage.', error);
  }

  return memoryLeaderboard;
}

async function writeLeaderboard(entries: LeaderboardEntry[]) {
  memoryLeaderboard = entries;

  try {
    if (redis) {
      await redis.set(LEADERBOARD_KEY, entries);
    }
  } catch (error) {
    console.warn('Could not persist leaderboard to Upstash Redis. Keeping in-memory fallback.', error);
  }
}

export async function GET() {
  const leaderboard = await readLeaderboard();
  return NextResponse.json({ leaderboard });
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    if (!payload || typeof payload !== 'object') {
      return NextResponse.json({ error: 'Invalid leaderboard payload' }, { status: 400 });
    }

    const name = typeof payload.name === 'string' ? payload.name.trim() : '';
    const xp = typeof payload.xp === 'number' ? payload.xp : Number(payload.xp);
    const streak = typeof payload.streak === 'number' ? payload.streak : Number(payload.streak);
    const badge = typeof payload.badge === 'string' ? payload.badge.trim() : 'Rookie';

    if (!name || Number.isNaN(xp) || Number.isNaN(streak)) {
      return NextResponse.json({ error: 'Missing or invalid leaderboard fields' }, { status: 400 });
    }

    const nextEntry: LeaderboardEntry = { name, xp, streak, badge };
    const leaderboard = await readLeaderboard();
    const updated = [...leaderboard, nextEntry]
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 10);

    await writeLeaderboard(updated);

    return NextResponse.json({ leaderboard: updated, saved: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Unable to save leaderboard score', details: String(error) },
      { status: 500 }
    );
  }
}
