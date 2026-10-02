"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { londonToDate } from "@/lib/london";
import { practiceFilter } from "@/lib/problems";
import { assertTeacher } from "@/lib/session";

export type HomeworkFormState = { errors: string[]; values: Record<string, string> } | null;

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();
const MAX_HOMEWORK_CHALLENGES = 20;

/** Set homework, or change it when the form carries an id. */
export async function saveHomework(_previous: HomeworkFormState, formData: FormData): Promise<HomeworkFormState> {
  await assertTeacher();
  const id = text(formData, "id");
  const problemIds = [...new Set(formData.getAll("problemIds").map(String))];
  const values = {
    title: text(formData, "title").slice(0, 100),
    note: text(formData, "note").slice(0, 2000),
    classId: text(formData, "classId"),
    dueAt: text(formData, "dueAt"),
    problemIds: problemIds.join(","),
  };
  const errors: string[] = [];
  if (!values.title) errors.push("Give the homework a title.");
  const dueAt = londonToDate(values.dueAt);
  if (!values.dueAt || Number.isNaN(dueAt.getTime())) errors.push("Choose when it is due.");
  if (values.classId && !(await db.class.findUnique({ where: { id: values.classId } }))) errors.push("That class no longer exists.");
  if (problemIds.length === 0) errors.push("Tick at least one challenge.");
  if (problemIds.length > MAX_HOMEWORK_CHALLENGES) errors.push(`Choose at most ${MAX_HOMEWORK_CHALLENGES} challenges.`);
  const existing = id ? await db.homework.findUnique({ where: { id }, include: { problems: { select: { problemId: true } } } }) : null;
  if (id && !existing) return { errors: ["That homework no longer exists."], values };
  // New challenges must be ones students can open: published and not held back for a
  // competition. Challenges already in this homework may stay even if they have since
  // gone into a competition, so the homework can still be changed.
  const kept = new Set(existing?.problems.map((p) => p.problemId) ?? []);
  const added = problemIds.filter((problemId) => !kept.has(problemId));
  const [allowed, found] = await Promise.all([
    db.problem.count({ where: { id: { in: added }, ...practiceFilter() } }),
    db.problem.count({ where: { id: { in: problemIds } } }),
  ]);
  if (found !== problemIds.length) errors.push("Some of those challenges have been deleted. Untick them and save again.");
  else if (allowed !== added.length) errors.push("Some of those challenges are not in Practice (unpublished, or held for a competition).");
  if (errors.length > 0) return { errors, values };

  const data = { title: values.title, note: values.note, classId: values.classId || null, dueAt };
  const problems = { create: problemIds.map((problemId, sortOrder) => ({ problemId, sortOrder })) };
  const saved = id ? await db.homework.update({ where: { id }, data: { ...data, problems: { deleteMany: {}, ...problems } } }) : await db.homework.create({ data: { ...data, problems } });
  revalidatePath("/", "layout");
  redirect(`/teacher/homework/${saved.id}`);
}

export async function deleteHomework(formData: FormData) {
  await assertTeacher();
  await db.homework.deleteMany({ where: { id: text(formData, "id") } });
  revalidatePath("/", "layout");
  redirect("/teacher/homework");
}
