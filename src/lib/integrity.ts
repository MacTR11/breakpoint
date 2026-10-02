// How a piece of code came to be written, as far as the browser can tell.
//
// The student's browser counts what was typed and what was pasted in from
// outside the editor, and sends the counts with each submission. They are a
// prompt for a conversation, never proof: a student can retype an answer from
// another screen, and a determined one could send false counts.

export type Telemetry = { pastedChars: number; largestPaste: number; typedChars: number; seconds: number };

export const noTelemetry: Telemetry = { pastedChars: 0, largestPaste: 0, typedChars: 0, seconds: 0 };

/** A single paste this long or longer is recorded as a large paste (and refused, when blocking is on). */
export const LARGE_PASTE = 120;

const count = (value: unknown) => (typeof value === "number" && Number.isFinite(value) ? Math.min(1_000_000, Math.max(0, Math.round(value))) : 0);

/** Counts arrive from the browser, so they are checked before being stored. */
export function cleanTelemetry(raw: unknown): Telemetry {
  const data = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
  return { pastedChars: count(data.pastedChars), largestPaste: count(data.largestPaste), typedChars: count(data.typedChars), seconds: count(data.seconds) };
}

/** What, if anything, a teacher should look at about a submission. */
export function pasteFlag(submission: { code: string; pastedChars: number; largestPaste: number }): string | null {
  const share = submission.code.length ? Math.round((submission.pastedChars / submission.code.length) * 100) : 0;
  if (submission.largestPaste >= LARGE_PASTE) return `Pasted ${submission.largestPaste} characters in one go${share >= 50 ? `, about ${Math.min(share, 100)}% of the code` : ""}`;
  if (submission.pastedChars >= 80 && share >= 50) return `About ${Math.min(share, 100)}% of the code was pasted in`;
  return null;
}

export const isFlagged = (submission: { code: string; pastedChars: number; largestPaste: number }) => pasteFlag(submission) !== null;

/** Narrows the submissions worth checking with `isFlagged` in the database first. */
export const mightBeFlagged = { OR: [{ largestPaste: { gte: LARGE_PASTE } }, { pastedChars: { gte: 80 } }] };

/** "4 min" or "35 s": how long the editor was open and in view. */
export const duration = (seconds: number) => (seconds >= 90 ? `${Math.round(seconds / 60)} min` : `${seconds} s`);
