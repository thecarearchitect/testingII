/**
 * In-memory rate limiter — MVP implementation.
 *
 * IMPORTANT LIMITATION: Vercel serverless functions are stateless.
 * Each function instance has its own Map, so limits are per-instance,
 * not global. Under low traffic this works well; under high traffic
 * multiple instances can each allow the full limit.
 *
 * TO UPGRADE to persistent, globally consistent rate limiting:
 *   1. npm install @upstash/ratelimit @upstash/redis
 *   2. Add UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN to Vercel env vars
 *   3. Replace this module with:
 *
 *   import { Ratelimit } from "@upstash/ratelimit";
 *   import { Redis } from "@upstash/redis";
 *
 *   const ratelimit = new Ratelimit({
 *     redis: Redis.fromEnv(),
 *     limiter: Ratelimit.slidingWindow(10, "1 h"),
 *   });
 *
 *   export async function checkRateLimit(ip: string) {
 *     const { success, remaining, reset } = await ratelimit.limit(ip);
 *     return { allowed: success, remaining, resetAt: reset };
 *   }
 */

const WINDOW_MS   = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 10;

interface Entry {
  count: number;
  resetAt: number; // epoch ms
}

const store = new Map<string, Entry>();

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || entry.resetAt <= now) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: MAX_REQUESTS - entry.count };
}

/** Prune expired entries — call at startup or on a timer if needed. */
export function pruneStore(): void {
  const now = Date.now();
  store.forEach((entry, key) => {
    if (entry.resetAt <= now) store.delete(key);
  });
}
