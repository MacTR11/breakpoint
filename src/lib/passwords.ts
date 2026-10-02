import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

// Passwords are never stored. What is kept is "scrypt$cost$salt$key": a slow,
// salted one-way hash, so a copy of the database does not give anyone's password away.
const COST = 16384;
const KEY_LENGTH = 32;

const derive = (password: string, salt: Buffer, cost: number, length: number) =>
  new Promise<Buffer>((resolve, reject) => scrypt(password.normalize("NFKC"), salt, length, { N: cost }, (error, key) => (error ? reject(error) : resolve(key))));

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await derive(password, salt, COST, KEY_LENGTH);
  return `scrypt$${COST}$${salt.toString("base64")}$${key.toString("base64")}`;
}

// Checked against when there is no such user, so a wrong username takes as long as a wrong password.
const NOBODY = `scrypt$${COST}$${randomBytes(16).toString("base64")}$${randomBytes(KEY_LENGTH).toString("base64")}`;

export async function verifyPassword(password: string, stored: string | null | undefined) {
  const [scheme, cost, salt, key] = (stored || NOBODY).split("$");
  if (scheme !== "scrypt" || !Number(cost) || !salt || !key) return false;
  const expected = Buffer.from(key, "base64");
  const actual = await derive(password, Buffer.from(salt, "base64"), Number(cost), expected.length);
  return timingSafeEqual(actual, expected) && Boolean(stored);
}
