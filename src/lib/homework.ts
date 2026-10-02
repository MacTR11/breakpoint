import { cache } from "react";
import { db } from "./db";
import { practiceFilter } from "./problems";

// Homework is a list of practice challenges set for one class, or for every
// student, with a due date. A challenge counts as done whenever it was solved,
// even before the homework was set; one solved after the due date is late.

const challengeFields = { id: true, slug: true, title: true, kind: true, style: true, difficulty: true, points: true, track: true } as const;

export type HomeworkState = "done" | "late" | "open" | "overdue";

export const homeworkStateLabel: Record<HomeworkState, [string, string]> = {
  done: ["Done", "var(--pass)"],
  late: ["Done late", "var(--warn)"],
  open: ["To do", "var(--accent)"],
  overdue: ["Overdue", "var(--fail)"],
};

/** Where a student stands on one piece of homework, from when they solved each challenge. */
export function stateOf(dueAt: Date, solvedAt: (Date | undefined)[], now = new Date()): HomeworkState {
  const done = solvedAt.every(Boolean);
  if (done) return solvedAt.some((at) => at! > dueAt) ? "late" : "done";
  return now > dueAt ? "overdue" : "open";
}

/**
 * The homework set for a student's class or for everyone, newest due date
 * last, with their progress. Cached for the request, as the top bar and Home
 * both ask.
 */
export const homeworkFor = cache(async (user: { id: string; classId: string | null }) => {
  const [sets, solves] = await Promise.all([
    db.homework.findMany({
      where: { OR: [{ classId: null }, ...(user.classId ? [{ classId: user.classId }] : [])] },
      orderBy: { dueAt: "asc" },
      include: { class: { select: { name: true } }, problems: { orderBy: { sortOrder: "asc" }, include: { problem: { select: challengeFields } } } },
    }),
    db.solve.findMany({ where: { userId: user.id }, select: { problemId: true, solvedAt: true } }),
  ]);
  const solvedAt = new Map(solves.map((s) => [s.problemId, s.solvedAt]));
  const now = new Date();
  return sets.map((set) => {
    const problems = set.problems.map((p) => p.problem);
    const times = problems.map((p) => solvedAt.get(p.id));
    return {
      id: set.id,
      title: set.title,
      note: set.note,
      dueAt: set.dueAt,
      createdAt: set.createdAt,
      className: set.class?.name ?? null,
      problems,
      solvedIds: problems.filter((p) => solvedAt.has(p.id)).map((p) => p.id),
      done: times.filter(Boolean).length,
      state: stateOf(set.dueAt, times, now),
    };
  });
});

export type StudentHomework = Awaited<ReturnType<typeof homeworkFor>>[number];

/** What belongs on Home: anything not yet due, and anything overdue in the last fortnight. */
export const current = (sets: StudentHomework[], now = new Date()) => sets.filter((h) => h.dueAt > now || (h.state === "overdue" && h.dueAt.getTime() > now.getTime() - 14 * 86_400_000));

/** Every student a piece of homework is for, and when (if ever) they solved each challenge. */
export async function homeworkProgress(id: string) {
  const set = await db.homework.findUnique({
    where: { id },
    include: { class: true, problems: { orderBy: { sortOrder: "asc" }, include: { problem: { select: challengeFields } } } },
  });
  if (!set) return null;
  const problemIds = set.problems.map((p) => p.problemId);
  const students = await db.user.findMany({
    where: { role: "STUDENT", ...(set.classId ? { classId: set.classId } : {}) },
    orderBy: { name: "asc" },
    select: { id: true, name: true, solves: { where: { problemId: { in: problemIds } }, select: { problemId: true, solvedAt: true } } },
  });
  const rows = students.map((student) => {
    const at = new Map(student.solves.map((s) => [s.problemId, s.solvedAt]));
    const times = problemIds.map((pid) => at.get(pid));
    return { id: student.id, name: student.name, times, done: times.filter(Boolean).length, state: stateOf(set.dueAt, times) };
  });
  return { set, problems: set.problems.map((p) => p.problem), rows };
}

/** Each piece of homework with how many of its students have finished it, for the teacher's list. */
export async function homeworkSummaries() {
  const sets = await db.homework.findMany({ orderBy: { dueAt: "desc" }, include: { class: { select: { name: true } }, problems: { select: { problemId: true } } } });
  const students = await db.user.findMany({ where: { role: "STUDENT" }, select: { id: true, classId: true, solves: { select: { problemId: true } } } });
  return sets.map((set) => {
    const ids = set.problems.map((p) => p.problemId);
    const theirs = students.filter((s) => !set.classId || s.classId === set.classId);
    const finished = theirs.filter((s) => {
      const solved = new Set(s.solves.map((x) => x.problemId));
      return ids.every((id) => solved.has(id));
    }).length;
    return { id: set.id, title: set.title, dueAt: set.dueAt, className: set.class?.name ?? null, challenges: ids.length, students: theirs.length, finished };
  });
}

/** Every challenge homework can use: whatever is in Practice. */
export function homeworkChallenges() {
  return db.problem.findMany({
    where: practiceFilter(),
    orderBy: [{ sortOrder: "asc" }],
    select: { id: true, title: true, kind: true, style: true, track: true, difficulty: true, points: true },
  });
}
