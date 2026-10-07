// A small in-memory rate limiter for the enquiry forms.
//
// What it does: stops one visitor, or one email address, from flooding the
// team's inbox and using up the email quota.
//
// What it does not do: it counts inside one running server. On Vercel a
// site can run on several servers at once, and each starts from zero, so a
// determined attacker spread across them could send more than the limit.
// That is an accepted trade for needing no database. If abuse ever shows up,
// swap the Map below for a shared store (Upstash Redis or Vercel KV), or add
// a rate-limit rule in the Vercel Firewall; the callers don't change.

const HOUR = 60 * 60 * 1000;

// Timestamps of recent submissions, per key.
const hits = new Map<string, number[]>();

type Limit = { key: string; limit: number; windowMs: number };

/**
 * Records one attempt against every limit and says whether it is allowed:
 * true only while each key has made fewer than its `limit` attempts in its
 * last `windowMs`. Nothing is recorded unless every limit passes, so a
 * refused attempt never uses up another key's allowance and waiting always
 * works.
 */
export function allowAttempts(limits: Limit[]) {
  const now = Date.now();

  const recents = limits.map(({ key, windowMs }) =>
    (hits.get(key) ?? []).filter((time) => now - time < windowMs),
  );
  const allowed = limits.every(({ limit }, i) => recents[i].length < limit);

  limits.forEach(({ key }, i) => {
    if (allowed) recents[i].push(now);
    hits.set(key, recents[i]);
  });

  if (hits.size > 5000) forgetOldKeys(now);
  return allowed;
}

// Keeps the Map from growing without end on a long-lived server. No window
// is longer than an hour, so anything quiet for that long can go.
function forgetOldKeys(now: number) {
  for (const [key, times] of hits) {
    if (!times.some((time) => now - time < HOUR)) hits.delete(key);
  }
}
