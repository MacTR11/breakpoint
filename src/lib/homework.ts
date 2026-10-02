import { cache } from "react";
import { db } from "./db";
import { isLive, isPending, practiceFilter } from "./problems";

// Homework is a list of practice challenges set for one class, or for every
// student, with a due date. A challenge counts as done whenever it was solved,
// even before the homework was set; one solved after the due date is late.
//
// A challenge can be put into a competition after it was set as homework.
// Until the competition starts (or, for an unscheduled pack, until it has
// been and gone) students cannot open it, so it does not count towards the
// homework unless they had already solved it.

const challengeFields = {
  id: true,
  slug: true,
  title: true,
  kind: true,
  style: true,
  difficulty: true,
  points: true,
  track: true,
  published: true,
  contests: { select: { contest: { select: { startsAt: true, endsAt: true } } } },
} as const;

type Fetched = { published: boolean; contests: { contest: { startsAt: Date | null; endsAt: Date | null } }[] };

/** Whether students can open a challenge now: in Practice, or in a competition that is running (as in findViewableProblem). */
export function openToStudents(problem: Fetched, now = new Date()) {
  const contests = problem.contests.map((c) => c.contest);
  return contests.some((c) => isLive(c, now)) || (problem.published && !contests.some((c) => isPending(c, now)));
}

/** A homework challenge as the pages need it, with `open` saying whether students can get at it. */
const asChallenge = <T extends Fetched>({ published, contests, ...rest }: T, now: Date) => ({ ...rest, open: openToStudents({ published, contests }, now) });

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

/** As `stateOf`, leaving out challenges students cannot open yet unless already solved. With nothing left to count it is still to do. */
export function homeworkState(dueAt: Date, entries: { solvedAt: Date | undefined; open: boolean }[], now = new Date()): HomeworkState {
  const counted = entries.filter((e) => e.solvedAt || e.open);
  return counted.length > 0 ? stateOf(dueAt, counted.map((e) => e.solvedAt), now) : "open";
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
    const problems = set.problems.map((p) => asChallenge(p.problem, now));
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
      state: homeworkState(
        set.dueAt,
        problems.map((p, i) => ({ solvedAt: times[i], open: p.open })),
        now,
      ),
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
  const now = new Date();
  const problems = set.problems.map((p) => asChallenge(p.problem, now));
  const problemIds = problems.map((p) => p.id);
  const students = await db.user.findMany({
    where: { role: "STUDENT", ...(set.classId ? { classId: set.classId } : {}) },
    orderBy: { name: "asc" },
    select: { id: true, name: true, solves: { where: { problemId: { in: problemIds } }, select: { problemId: true, solvedAt: true } } },
  });
  const rows = students.map((student) => {
    const at = new Map(student.solves.map((s) => [s.problemId, s.solvedAt]));
    const times = problemIds.map((pid) => at.get(pid));
    const state = homeworkState(
      set.dueAt,
      problems.map((p, i) => ({ solvedAt: times[i], open: p.open })),
      now,
    );
    return { id: student.id, name: student.name, times, done: times.filter(Boolean).length, state };
  });
  return { set, problems, rows };
}

/** Each piece of homework with how many of its students have finished it, for the teacher's list. */
export async function homeworkSummaries() {
  const sets = await db.homework.findMany({
    orderBy: { dueAt: "desc" },
    include: { class: { select: { name: true } }, problems: { select: { problem: { select: { id: true, published: true, contests: challengeFields.contests } } } } },
  });
  const students = await db.user.findMany({ where: { role: "STUDENT" }, select: { id: true, classId: true, solves: { select: { problemId: true } } } });
  const now = new Date();
  return sets.map((set) => {
    const challenges = set.problems.map((p) => asChallenge(p.problem, now));
    const theirs = students.filter((s) => !set.classId || s.classId === set.classId);
    // Finished: every challenge that counts is solved (one students cannot open yet only counts once solved).
    const finished = theirs.filter((s) => {
      const solved = new Set(s.solves.map((x) => x.problemId));
      const counted = challenges.filter((c) => c.open || solved.has(c.id));
      return counted.length > 0 && counted.every((c) => solved.has(c.id));
    }).length;
    return {
      id: set.id,
      title: set.title,
      dueAt: set.dueAt,
      className: set.class?.name ?? null,
      challenges: challenges.length,
      held: challenges.filter((c) => !c.open).length,
      students: theirs.length,
      finished,
    };
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
