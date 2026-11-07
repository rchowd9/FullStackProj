import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const REVIEW_KEY = 'code-quest:peer-reviews';
const MAX_SUBMISSIONS = 50;
const MAX_REVIEWS_PER_SUBMISSION = 20;
const MAX_BODY_BYTES = 24 * 1024;
const MAX_REQUESTS_PER_MINUTE = 12;
const RATE_LIMIT_WINDOW_SECONDS = 60;
const REVIEW_LANGUAGES = ['Python', 'JavaScript', 'Java', 'C++', 'C#', 'Kotlin', 'R', 'SQL'] as const;

type PeerReview = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type ReviewSubmission = {
  id: string;
  author: string;
  title: string;
  language: (typeof REVIEW_LANGUAGES)[number];
  prompt: string;
  code: string;
  createdAt: string;
  reviews: PeerReview[];
};

let memorySubmissions: ReviewSubmission[] = [];
const memoryRateLimits = new Map<string, { count: number; expiresAt: number }>();

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

function isPeerReview(value: unknown): value is PeerReview {
  if (!value || typeof value !== 'object') return false;
  const review = value as Record<string, unknown>;
  return typeof review.id === 'string'
    && typeof review.author === 'string'
    && typeof review.rating === 'number'
    && typeof review.comment === 'string'
    && typeof review.createdAt === 'string';
}

function isSubmission(value: unknown): value is ReviewSubmission {
  if (!value || typeof value !== 'object') return false;
  const submission = value as Record<string, unknown>;
  return typeof submission.id === 'string'
    && typeof submission.author === 'string'
    && typeof submission.title === 'string'
    && typeof submission.language === 'string'
    && REVIEW_LANGUAGES.includes(submission.language as (typeof REVIEW_LANGUAGES)[number])
    && typeof submission.prompt === 'string'
    && typeof submission.code === 'string'
    && typeof submission.createdAt === 'string'
    && Array.isArray(submission.reviews)
    && submission.reviews.every(isPeerReview);
}

async function readSubmissions(): Promise<ReviewSubmission[]> {
  if (!redis) return memorySubmissions;

  const value = await redis.get<unknown>(REVIEW_KEY);
  if (value === null) return [];
  if (!Array.isArray(value) || !value.every(isSubmission)) {
    throw new Error('Stored peer reviews have an unexpected format.');
  }
  return value;
}

async function writeSubmissions(submissions: ReviewSubmission[]) {
  if (redis) {
    await redis.set(REVIEW_KEY, submissions);
    return;
  }
  memorySubmissions = submissions;
}

function isBoundedText(value: unknown, minLength: number, maxLength: number): value is string {
  return typeof value === 'string'
    && value.trim().length >= minLength
    && value.length <= maxLength;
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

function getClientKey(request: Request) {
  const ip = request.headers.get('x-real-ip')
    ?? request.headers.get('cf-connecting-ip')
    ?? request.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim()
    ?? 'unknown';
  return `code-quest:peer-reviews:rate:${ip}`;
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

export async function GET() {
  try {
    const submissions = await readSubmissions();
    return NextResponse.json({ submissions, shared: Boolean(redis) });
  } catch (error) {
    console.error('Unable to load peer code reviews.', error);
    return NextResponse.json({ error: 'Peer reviews are temporarily unavailable.' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin) {
    try {
      if (new URL(origin).origin !== new URL(request.url).origin) {
        return NextResponse.json({ error: 'Cross-origin review requests are not allowed.' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
    }
  }

  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Request exceeds the 24 KB limit.' }, { status: 413 });
  }

  try {
    if (await isRateLimited(getClientKey(request))) {
      return NextResponse.json({ error: 'Too many review requests. Please try again in a minute.' }, { status: 429 });
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
      return NextResponse.json({ error: 'Invalid peer review payload.' }, { status: 400 });
    }

    const fields = payload as Record<string, unknown>;
    const submissions = await readSubmissions();

    if (fields.action === 'submit') {
      if (
        !isBoundedText(fields.author, 2, 40)
        || !isBoundedText(fields.title, 5, 120)
        || typeof fields.language !== 'string'
        || !REVIEW_LANGUAGES.includes(fields.language as (typeof REVIEW_LANGUAGES)[number])
        || !isBoundedText(fields.prompt, 10, 500)
        || !isBoundedText(fields.code, 1, 16_000)
      ) {
        return NextResponse.json({ error: 'Provide a name, title, language, review request, and code within the stated limits.' }, { status: 400 });
      }

      const submission: ReviewSubmission = {
        id: crypto.randomUUID(),
        author: fields.author.trim(),
        title: fields.title.trim(),
        language: fields.language as ReviewSubmission['language'],
        prompt: fields.prompt.trim(),
        code: fields.code,
        createdAt: new Date().toISOString(),
        reviews: [],
      };
      const updated = [submission, ...submissions].slice(0, MAX_SUBMISSIONS);
      await writeSubmissions(updated);
      return NextResponse.json({ submission, shared: Boolean(redis) }, { status: 201 });
    }

    if (fields.action === 'review') {
      if (
        typeof fields.submissionId !== 'string'
        || !/^[0-9a-f-]{36}$/i.test(fields.submissionId)
        || !isBoundedText(fields.author, 2, 40)
        || !Number.isInteger(fields.rating)
        || (fields.rating as number) < 1
        || (fields.rating as number) > 5
        || !isBoundedText(fields.comment, 8, 1_000)
      ) {
        return NextResponse.json({ error: 'Provide your name, a rating from 1 to 5, and feedback of at least 8 characters.' }, { status: 400 });
      }

      const index = submissions.findIndex((submission) => submission.id === fields.submissionId);
      if (index < 0) {
        return NextResponse.json({ error: 'This submission is no longer available for review.' }, { status: 404 });
      }

      const submission = submissions[index];
      if (submission.reviews.length >= MAX_REVIEWS_PER_SUBMISSION) {
        return NextResponse.json({ error: 'This submission has reached its review limit.' }, { status: 409 });
      }
      const review: PeerReview = {
        id: crypto.randomUUID(),
        author: fields.author.trim(),
        rating: fields.rating as number,
        comment: fields.comment.trim(),
        createdAt: new Date().toISOString(),
      };
      const updatedSubmission = { ...submission, reviews: [...submission.reviews, review] };
      const updated = [...submissions];
      updated[index] = updatedSubmission;
      await writeSubmissions(updated);
      return NextResponse.json({ submission: updatedSubmission, shared: Boolean(redis) });
    }

    return NextResponse.json({ error: 'Action must be submit or review.' }, { status: 400 });
  } catch (error) {
    console.error('Unable to save peer code review.', error);
    return NextResponse.json({ error: 'Peer reviews are temporarily unavailable.' }, { status: 503 });
  }
}
