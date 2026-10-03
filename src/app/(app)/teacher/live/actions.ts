"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { practiceFilter } from "@/lib/problems";
import { assertTeacher } from "@/lib/session";

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

/** Starts a live lesson on a challenge, ending any that is running. */
export async function startLive(formData: FormData) {
  await assertTeacher();
  const problemId = text(formData, "problemId");
  const classId = text(formData, "classId") || null;
  // Only a challenge students can open: published, and not held for a competition.
  const problem = await db.problem.findFirst({ where: { id: problemId, ...practiceFilter() }, select: { id: true } });
  if (!problem) redirect("/teacher/live?error=challenge");
  if (classId && !(await db.class.findUnique({ where: { id: classId } }))) redirect("/teacher/live?error=class");
  await db.$transaction([
    db.liveLesson.updateMany({ where: { endedAt: null }, data: { endedAt: new Date() } }),
    db.liveLesson.create({ data: { problemId: problem.id, classId } }),
  ]);
  revalidatePath("/teacher/live");
  redirect("/teacher/live");
}

/** Ends the live lesson. Students' screens stop being sent to it. */
export async function endLive() {
  await assertTeacher();
  await db.liveLesson.updateMany({ where: { endedAt: null }, data: { endedAt: new Date() } });
  revalidatePath("/teacher/live");
}
