import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

type LeaderboardEntry = {
  name: string;
  xp: number;
  streak: number;
  badge: string;
};

const LEADERBOARD_KEY = 'code-quest:leaderboard';
const MAX_NAME_LENGTH = 40;
const MAX_BADGE_LENGTH = 60;
const MAX_XP = 10_000_000;
const MAX_STREAK = 36_500;
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

function isIntegerInRange(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= min && value <= max;
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
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON' }, { status: 400 });
  }

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return NextResponse.json({ error: 'Invalid leaderboard payload' }, { status: 400 });
  }

  const entry = payload as Record<string, unknown>;
  const name = typeof entry.name === 'string' ? entry.name.trim() : '';
  const xp = entry.xp;
  const streak = entry.streak;
  const badge = entry.badge === undefined ? 'Rookie' : entry.badge;

  if (
    name.length === 0 ||
    name.length > MAX_NAME_LENGTH ||
    !isIntegerInRange(xp, 0, MAX_XP) ||
    !isIntegerInRange(streak, 0, MAX_STREAK) ||
    typeof badge !== 'string' ||
    badge.trim().length === 0 ||
    badge.trim().length > MAX_BADGE_LENGTH
  ) {
    return NextResponse.json({ error: 'Missing or invalid leaderboard fields' }, { status: 400 });
  }

  const nextEntry: LeaderboardEntry = {
    name,
    xp,
    streak,
    badge: badge.trim(),
  };
  const leaderboard = await readLeaderboard();
  const updated = [
    ...leaderboard.filter((current) => current.name.toLowerCase() !== name.toLowerCase()),
    nextEntry,
  ]
    .sort((a, b) => b.xp - a.xp || b.streak - a.streak)
    .slice(0, 10);

  try {
    await writeLeaderboard(updated);
    return NextResponse.json({ leaderboard: updated, saved: true });
  } catch (error) {
    console.error('Unable to save leaderboard score.', error);
    return NextResponse.json({ error: 'Unable to save leaderboard score' }, { status: 500 });
  }
}
