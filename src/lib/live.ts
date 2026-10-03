import { db } from "./db";

// A live lesson: the teacher puts one challenge on every student's screen (or
// one class's) and watches who has opened it, who is trying and who has solved
// it. One runs at a time. A lesson the teacher forgets to end stops on its own
// after LESSON_HOURS, so it cannot pull students back to it the next day.

export const LESSON_HOURS = 2;

const running = () => ({ endedAt: null, startedAt: { gt: new Date(Date.now() - LESSON_HOURS * 3600_000) } });

/** The lesson running now, if there is one, with its challenge and class. */
export function currentLesson() {
  return db.liveLesson.findFirst({
    where: running(),
    orderBy: { startedAt: "desc" },
    include: { problem: { select: { id: true, slug: true, title: true, kind: true, style: true } }, class: { select: { id: true, name: true } } },
  });
}

/** The lesson a student should be in now: one for everyone, or for their class. Never the teacher. */
export async function lessonFor(user: { role: string; classId: string | null }) {
  if (user.role === "TEACHER") return null;
  const lesson = await currentLesson();
  if (!lesson || (lesson.classId && lesson.classId !== user.classId)) return null;
  return { id: lesson.id, slug: lesson.problem.slug, title: lesson.problem.title };
}

/** Where a student is with the lesson's challenge. */
export type LiveState = "solved" | "solved-before" | "trying" | "opened" | "waiting";

export type LiveRow = {
  id: string;
  name: string;
  className: string | null;
  state: LiveState;
  /** Tries since the lesson started. */
  tries: number;
  /** The best try's tests passed, out of how many, for code. */
  best: { passed: number; total: number } | null;
  /** When it was solved or opened. */
  at: Date | null;
};

/** Every student the lesson is for, and where each one is with it. */
export async function lessonBoard(lesson: { id: string; problemId: string; classId: string | null; startedAt: Date }): Promise<LiveRow[]> {
  const [students, solves, submissions, opens] = await Promise.all([
    db.user.findMany({
      where: { role: "STUDENT", ...(lesson.classId ? { classId: lesson.classId } : {}) },
      orderBy: { name: "asc" },
      select: { id: true, name: true, class: { select: { name: true } } },
    }),
    db.solve.findMany({ where: { problemId: lesson.problemId }, select: { userId: true, solvedAt: true } }),
    db.submission.findMany({ where: { problemId: lesson.problemId, createdAt: { gte: lesson.startedAt } }, select: { userId: true, passed: true, total: true } }),
    db.liveOpen.findMany({ where: { lessonId: lesson.id }, select: { userId: true, openedAt: true } }),
  ]);
  const solvedAt = new Map(solves.map((s) => [s.userId, s.solvedAt]));
  const openedAt = new Map(opens.map((o) => [o.userId, o.openedAt]));
  return students.map((student) => {
    const mine = submissions.filter((s) => s.userId === student.id);
    const best = mine.reduce<LiveRow["best"]>((top, s) => (s.total > 0 && (!top || s.passed / s.total > top.passed / top.total) ? { passed: s.passed, total: s.total } : top), null);
    const solved = solvedAt.get(student.id) ?? null;
    const opened = openedAt.get(student.id) ?? null;
    const state: LiveState = solved ? (solved >= lesson.startedAt ? "solved" : "solved-before") : mine.length > 0 ? "trying" : opened ? "opened" : "waiting";
    return { id: student.id, name: student.name, className: student.class?.name ?? null, state, tries: mine.length, best, at: solved ?? opened };
  });
}
