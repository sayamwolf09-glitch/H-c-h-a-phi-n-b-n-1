type Entry = {
  count: number;
  resetAt: number;
};

const memoryStore = new Map<string, Entry>();

export function checkRateLimit(params: {
  key: string;
  windowMs: number;
  max: number;
}) {
  const now = Date.now();
  const existing = memoryStore.get(params.key);

  if (!existing || existing.resetAt <= now) {
    memoryStore.set(params.key, {
      count: 1,
      resetAt: now + params.windowMs
    });
    return { allowed: true, remaining: params.max - 1, resetAt: now + params.windowMs };
  }

  if (existing.count >= params.max) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  memoryStore.set(params.key, existing);
  return { allowed: true, remaining: params.max - existing.count, resetAt: existing.resetAt };
}
