import { randomUUID } from "node:crypto";
import { readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

/**
 * A copy of the whole database for the teacher to keep: every student, their
 * passwords as one-way hashes, and all their work. SQLite's VACUUM INTO makes
 * a consistent copy while the site carries on running.
 */
export async function GET() {
  const user = await getCurrentUser();
  if (user?.role !== "TEACHER") return new Response("Forbidden", { status: 403 });
  if (!(process.env.DATABASE_URL ?? "").startsWith("file:")) {
    return new Response("This download is for a SQLite database. Use your database host's own backups.", { status: 400 });
  }
  // A name of our own making, never anything from the request.
  const file = path.join(tmpdir(), `breakpoint-backup-${randomUUID()}.db`);
  try {
    await db.$executeRawUnsafe(`VACUUM INTO '${file}'`);
    const bytes = await readFile(file);
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type": "application/vnd.sqlite3",
        "Content-Disposition": `attachment; filename="breakpoint-backup-${new Date().toISOString().slice(0, 10)}.db"`,
        "Cache-Control": "no-store",
      },
    });
  } finally {
    await rm(file, { force: true });
  }
}
