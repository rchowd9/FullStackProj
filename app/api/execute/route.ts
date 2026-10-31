import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const MAX_REQUEST_BYTES = 36 * 1024;
const MAX_SOURCE_LENGTH = 24_000;
const MAX_STDIN_LENGTH = 8_000;
const MAX_PROVIDER_RESPONSE_BYTES = 64 * 1024;
const MAX_REQUESTS_PER_MINUTE = 10;
const RATE_LIMIT_WINDOW_SECONDS = 60;

const LANGUAGE_IDS: Record<string, number> = {
  Python: 71,
  JavaScript: 63,
  Java: 62,
  'C++': 54,
  'C#': 51,
  Kotlin: 78,
  R: 80,
  SQL: 82,
};

type RunPayload = {
  language: string;
  source: string;
  stdin: string;
};

type Judge0Result = {
  status?: { description?: string };
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  time?: string | null;
  memory?: number | null;
};

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

const memoryRateLimits = new Map<string, { count: number; expiresAt: number }>();

function getClientKey(request: Request): string {
  const headers = request.headers;
  const ip = headers.get('x-real-ip')
    ?? headers.get('cf-connecting-ip')
    ?? headers.get('x-forwarded-for')?.split(',').at(-1)?.trim()
    ?? 'unknown';

  return `code-quest:execute:rate:${ip}`;
}

async function isRateLimited(key: string): Promise<boolean> {
  if (redis) {
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, RATE_LIMIT_WINDOW_SECONDS);
    }
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

async function readRequestBody(request: Request): Promise<string | null> {
  const reader = request.body?.getReader();
  if (!reader) return null;

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.byteLength;
      if (totalBytes > MAX_REQUEST_BYTES) {
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

function parsePayload(value: unknown): RunPayload | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;

  const payload = value as Record<string, unknown>;
  if (
    typeof payload.language !== 'string'
    || !(payload.language in LANGUAGE_IDS)
    || typeof payload.source !== 'string'
    || payload.source.trim().length === 0
    || payload.source.length > MAX_SOURCE_LENGTH
    || (payload.stdin !== undefined && typeof payload.stdin !== 'string')
    || (typeof payload.stdin === 'string' && payload.stdin.length > MAX_STDIN_LENGTH)
  ) {
    return null;
  }

  return {
    language: payload.language,
    source: payload.source,
    stdin: typeof payload.stdin === 'string' ? payload.stdin : '',
  };
}

function getJudge0Endpoint(): { url: URL; apiKey?: string } | null {
  const configuredUrl = process.env.JUDGE0_API_URL
    || (process.env.NODE_ENV === 'development' ? 'https://ce.judge0.com' : undefined);
  if (!configuredUrl) return null;

  try {
    const url = new URL(configuredUrl);
    const localHost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    if (
      (url.protocol !== 'https:' && !(localHost && url.protocol === 'http:'))
      || url.username
      || url.password
      || url.search
      || url.hash
    ) {
      return null;
    }

    url.pathname = `${url.pathname.replace(/\/+$/, '')}/submissions`;
    url.searchParams.set('base64_encoded', 'false');
    url.searchParams.set('wait', 'true');
    return { url, apiKey: process.env.JUDGE0_API_KEY };
  } catch {
    return null;
  }
}

async function readProviderResponse(response: Response): Promise<string | null> {
  const reader = response.body?.getReader();
  if (!reader) return '';

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.byteLength;
      if (totalBytes > MAX_PROVIDER_RESPONSE_BYTES) {
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

export async function POST(request: Request) {
  const requestOrigin = request.headers.get('origin');
  if (requestOrigin) {
    try {
      if (new URL(requestOrigin).origin !== new URL(request.url).origin) {
        return NextResponse.json({ error: 'Cross-origin execution requests are not allowed' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
    }
  }

  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: 'Request exceeds the 36 KB limit' }, { status: 413 });
  }

  const rawBody = await readRequestBody(request);
  if (rawBody === null) {
    return NextResponse.json({ error: 'Request body is missing or exceeds the 36 KB limit' }, { status: 413 });
  }

  let json: unknown;
  try {
    json = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON' }, { status: 400 });
  }

  const payload = parsePayload(json);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid language, source code, or standard input' }, { status: 400 });
  }

  const endpoint = getJudge0Endpoint();
  if (!endpoint) {
    return NextResponse.json({ error: 'Code execution is not configured. Set JUDGE0_API_URL on the server.' }, { status: 503 });
  }

  try {
    if (await isRateLimited(getClientKey(request))) {
      return NextResponse.json(
        { error: 'Execution limit reached. Try again in a minute.' },
        { status: 429, headers: { 'Retry-After': String(RATE_LIMIT_WINDOW_SECONDS) } },
      );
    }
  } catch (error) {
    console.error('Unable to apply code execution rate limit.', error);
    return NextResponse.json({ error: 'Code execution is temporarily unavailable' }, { status: 503 });
  }

  const headers = new Headers({ 'Content-Type': 'application/json' });
  if (endpoint.apiKey) {
    headers.set('X-RapidAPI-Key', endpoint.apiKey);
    headers.set('X-RapidAPI-Host', endpoint.url.hostname);
  }

  try {
    const providerResponse = await fetch(endpoint.url, {
      method: 'POST',
      headers,
      redirect: 'error',
      signal: AbortSignal.timeout(15_000),
      body: JSON.stringify({
        source_code: payload.source,
        language_id: LANGUAGE_IDS[payload.language],
        stdin: payload.stdin,
        cpu_time_limit: 2,
        wall_time_limit: 5,
        memory_limit: 128_000,
        max_processes: 20,
        max_file_size: 1_024,
      }),
    });

    const responseText = await readProviderResponse(providerResponse);
    if (responseText === null) {
      return NextResponse.json({ error: 'Runner returned an oversized response' }, { status: 502 });
    }
    if (!providerResponse.ok) {
      console.error('Judge0 rejected the execution request.', providerResponse.status, responseText);
      return NextResponse.json({ error: 'The code runner rejected this request' }, { status: 502 });
    }

    let result: Judge0Result;
    try {
      result = JSON.parse(responseText) as Judge0Result;
    } catch {
      console.error('Judge0 returned an invalid response.');
      return NextResponse.json({ error: 'The code runner returned an invalid response' }, { status: 502 });
    }

    return NextResponse.json({
      status: typeof result.status?.description === 'string' ? result.status.description : 'Finished',
      stdout: typeof result.stdout === 'string' ? result.stdout : '',
      stderr: typeof result.stderr === 'string' ? result.stderr : '',
      compileOutput: typeof result.compile_output === 'string' ? result.compile_output : '',
      time: typeof result.time === 'string' ? result.time : null,
      memory: typeof result.memory === 'number' ? result.memory : null,
    });
  } catch (error) {
    console.error('Code runner request failed.', error);
    return NextResponse.json({ error: 'The code runner is unavailable or timed out' }, { status: 502 });
  }
}
