import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const ROOM_PREFIX = 'code-quest:collaboration:';
const MAX_BODY_BYTES = 24 * 1024;
const MAX_CODE_LENGTH = 16_000;
const MAX_MESSAGES = 100;
const MAX_REQUESTS_PER_MINUTE = 180;
const RATE_LIMIT_WINDOW_SECONDS = 60;
const ROOM_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ROOM_LANGUAGES = ['Python', 'JavaScript', 'Java', 'C++', 'C#', 'Kotlin', 'R', 'SQL'] as const;

type RoomMessage = {
  id: string;
  author: string;
  text: string;
  createdAt: string;
};

type SharedRoom = {
  code: string;
  language: (typeof ROOM_LANGUAGES)[number];
  messages: RoomMessage[];
  updatedAt: string;
};

const memoryRooms = new Map<string, SharedRoom>();
const memoryRateLimits = new Map<string, { count: number; expiresAt: number }>();

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

function createEmptyRoom(): SharedRoom {
  return {
    code: '',
    language: 'JavaScript',
    messages: [],
    updatedAt: new Date(0).toISOString(),
  };
}

function isRoomMessage(value: unknown): value is RoomMessage {
  if (!value || typeof value !== 'object') return false;
  const message = value as Record<string, unknown>;
  return typeof message.id === 'string'
    && typeof message.author === 'string'
    && typeof message.text === 'string'
    && typeof message.createdAt === 'string';
}

function isSharedRoom(value: unknown): value is SharedRoom {
  if (!value || typeof value !== 'object') return false;
  const room = value as Record<string, unknown>;
  return typeof room.code === 'string'
    && room.code.length <= MAX_CODE_LENGTH
    && typeof room.language === 'string'
    && ROOM_LANGUAGES.includes(room.language as (typeof ROOM_LANGUAGES)[number])
    && Array.isArray(room.messages)
    && room.messages.length <= MAX_MESSAGES
    && room.messages.every(isRoomMessage)
    && typeof room.updatedAt === 'string';
}

async function readRoom(roomId: string): Promise<SharedRoom> {
  if (!redis) return memoryRooms.get(roomId) ?? createEmptyRoom();

  const value = await redis.get<unknown>(`${ROOM_PREFIX}${roomId}`);
  if (value === null) return createEmptyRoom();
  if (!isSharedRoom(value)) throw new Error('Stored collaboration room has an unexpected format.');
  return value;
}

async function writeRoom(roomId: string, room: SharedRoom) {
  if (redis) {
    await redis.set(`${ROOM_PREFIX}${roomId}`, room);
    return;
  }
  memoryRooms.set(roomId, room);
}

function getClientKey(request: Request) {
  const ip = request.headers.get('x-real-ip')
    ?? request.headers.get('cf-connecting-ip')
    ?? request.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim()
    ?? 'unknown';
  return `code-quest:collaboration:rate:${ip}`;
}

async function isRateLimited(key: string) {
  if (redis) {
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, RATE_LIMIT_WINDOW_SECONDS);
    return count > MAX_REQUESTS_PER_MINUTE;
  }

  const now = Date.now();
  const current = memoryRateLimits.get(key);
  if (!current || current.expiresAt <= now) {
    if (memoryRateLimits.size >= 10_000) {
      for (const [entryKey, entry] of memoryRateLimits) {
        if (entry.expiresAt <= now) memoryRateLimits.delete(entryKey);
      }
    }
    memoryRateLimits.set(key, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_SECONDS * 1000 });
    return false;
  }
  current.count += 1;
  return current.count > MAX_REQUESTS_PER_MINUTE;
}

async function readBody(request: Request): Promise<string | null> {
  const reader = request.body?.getReader();
  if (!reader) return null;

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_BODY_BYTES) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(body);
}

function isBoundedText(value: unknown, minLength: number, maxLength: number): value is string {
  return typeof value === 'string' && value.trim().length >= minLength && value.length <= maxLength;
}

function getRoomId(request: Request) {
  const roomId = new URL(request.url).searchParams.get('room');
  return roomId && ROOM_ID_PATTERN.test(roomId) ? roomId.toLowerCase() : null;
}

export async function GET(request: Request) {
  const roomId = getRoomId(request);
  if (!roomId) return NextResponse.json({ error: 'Provide a valid room ID.' }, { status: 400 });

  try {
    if (await isRateLimited(getClientKey(request))) {
      return NextResponse.json({ error: 'Too many collaboration requests. Please try again in a minute.' }, { status: 429 });
    }
    const room = await readRoom(roomId);
    return NextResponse.json({ room, shared: Boolean(redis) });
  } catch (error) {
    console.error('Unable to load collaboration room.', error);
    return NextResponse.json({ error: 'Collaboration rooms are temporarily unavailable.' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin) {
    try {
      if (new URL(origin).origin !== new URL(request.url).origin) {
        return NextResponse.json({ error: 'Cross-origin collaboration requests are not allowed.' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
    }
  }

  const roomId = getRoomId(request);
  if (!roomId) return NextResponse.json({ error: 'Provide a valid room ID.' }, { status: 400 });
  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Request exceeds the 24 KB limit.' }, { status: 413 });
  }

  try {
    if (await isRateLimited(getClientKey(request))) {
      return NextResponse.json({ error: 'Too many collaboration requests. Please try again in a minute.' }, { status: 429 });
    }

    const rawBody = await readBody(request);
    if (rawBody === null) {
      return NextResponse.json({ error: 'Request body is missing or exceeds the 24 KB limit.' }, { status: 413 });
    }

    let payload: unknown;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
    }
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return NextResponse.json({ error: 'Invalid collaboration payload.' }, { status: 400 });
    }

    const fields = payload as Record<string, unknown>;
    const room = await readRoom(roomId);

    if (fields.action === 'code') {
      if (
        typeof fields.language !== 'string'
        || !ROOM_LANGUAGES.includes(fields.language as (typeof ROOM_LANGUAGES)[number])
        || typeof fields.code !== 'string'
        || fields.code.length > MAX_CODE_LENGTH
      ) {
        return NextResponse.json({ error: 'Provide a supported language and code sample within the 16,000 character limit.' }, { status: 400 });
      }

      const updatedRoom: SharedRoom = {
        ...room,
        code: fields.code,
        language: fields.language as SharedRoom['language'],
        updatedAt: new Date().toISOString(),
      };
      await writeRoom(roomId, updatedRoom);
      return NextResponse.json({ room: updatedRoom, shared: Boolean(redis) });
    }

    if (fields.action === 'message') {
      if (!isBoundedText(fields.author, 2, 40) || !isBoundedText(fields.text, 1, 500)) {
        return NextResponse.json({ error: 'Provide a display name and a message of up to 500 characters.' }, { status: 400 });
      }

      const updatedRoom: SharedRoom = {
        ...room,
        messages: [...room.messages, {
          id: crypto.randomUUID(),
          author: fields.author.trim(),
          text: fields.text.trim(),
          createdAt: new Date().toISOString(),
        }].slice(-MAX_MESSAGES),
        updatedAt: new Date().toISOString(),
      };
      await writeRoom(roomId, updatedRoom);
      return NextResponse.json({ room: updatedRoom, shared: Boolean(redis) }, { status: 201 });
    }

    return NextResponse.json({ error: 'Action must be code or message.' }, { status: 400 });
  } catch (error) {
    console.error('Unable to save collaboration room data.', error);
    return NextResponse.json({ error: 'Collaboration rooms are temporarily unavailable.' }, { status: 503 });
  }
}
