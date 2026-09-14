import { Hono } from 'hono';
import { handle } from 'hono/vercel';

export const runtime = 'edge';

const api = new Hono().get('/', (context) => {
  return context.json({
    service: 'code-quest-api',
    status: 'online',
    runtime: 'vercel-edge',
    framework: 'hono',
    checkedAt: new Date().toISOString(),
  });
});

export const GET = handle(api);
