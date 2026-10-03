import { db } from "@/lib/db";

/**
 * For the host and an uptime monitor: 200 when the site can reach its
 * database, 503 when it cannot. Says nothing else, so it is safe to leave open.
 */
export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ ok: false }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
