import { db } from "./db";

// Slows down password guessing. The first few wrong attempts on a username are
// free; after that each one locks sign-in to that username for longer, up to a
// quarter of an hour. A correct sign-in clears the count.
const FREE_ATTEMPTS = 5;
const FIRST_LOCK_SECONDS = 30;
const LONGEST_LOCK_SECONDS = 15 * 60;
const FORGET_AFTER_MS = 24 * 60 * 60 * 1000;

const key = (username: string) => username.slice(0, 64);

export async function isLocked(username: string) {
  const row = await db.loginThrottle.findUnique({ where: { username: key(username) } });
  return Boolean(row?.lockedUntil && row.lockedUntil > new Date());
}

export async function recordFailure(username: string) {
  const row = await db.loginThrottle.upsert({
    where: { username: key(username) },
    create: { username: key(username), failures: 1 },
    update: { failures: { increment: 1 } },
  });
  const over = row.failures - FREE_ATTEMPTS;
  if (over >= 0) {
    const seconds = Math.min(FIRST_LOCK_SECONDS * 2 ** over, LONGEST_LOCK_SECONDS);
    await db.loginThrottle.update({ where: { username: row.username }, data: { lockedUntil: new Date(Date.now() + seconds * 1000) } });
  }
}

export async function clearFailures(username: string) {
  await db.loginThrottle.deleteMany({ where: { OR: [{ username: key(username) }, { updatedAt: { lt: new Date(Date.now() - FORGET_AFTER_MS) } }] } });
}
