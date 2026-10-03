import { db } from "@/lib/db";
import { lessonFor } from "@/lib/live";
import { getCurrentUser } from "@/lib/session";

/** The live lesson the signed-in student should be in, if any. The live banner asks every few seconds. */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Sign in first." }, { status: 401 });
  return Response.json({ lesson: await lessonFor(user) }, { headers: { "Cache-Control": "no-store" } });
}

/** Records that the signed-in student has the live lesson's challenge open, so the teacher can see it. */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Sign in first." }, { status: 401 });
  const body = await request.json().catch(() => null);
  const lesson = await lessonFor(user);
  if (!lesson || lesson.id !== body?.id) return Response.json({ ok: false });
  await db.liveOpen.upsert({
    where: { lessonId_userId: { lessonId: lesson.id, userId: user.id } },
    create: { lessonId: lesson.id, userId: user.id },
    update: {},
  });
  return Response.json({ ok: true });
}
