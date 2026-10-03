import { cache } from "react";
import { db } from "./db";
import { isLive, isPending, practiceFilter } from "./problems";

// Homework is a list of practice challenges set for one class, or for every
// student, with a due date. A challenge counts as done whenever it was solved,
// even before the homework was set; one solved after the due date is late.
//
// A challenge can be put into a competition after it was set as homework, or
// be unpublished. While students cannot open it, it does not count towards the
// homework unless they have solved it. Once the due date has passed, what
// counts is whether they could open it at the due date, so a competition that
// starts (or a pack made) afterwards never changes a past result.

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
  contests: { select: { createdAt: true, contest: { select: { startsAt: true, endsAt: true } } } },
} as const;

type Fetched = { published: boolean; contests: { createdAt?: Date; contest: { startsAt: Date | null; endsAt: Date | null } }[] };

/**
 * Whether students could open a challenge at `at`: in Practice, or in a
 * competition running then (as in findViewableProblem). A competition it was
 * put into after `at` is left out. Published is as it is now.
 */
export function openToStudents(problem: Fetched, at = new Date()) {
  const contests = problem.contests.filter((c) => !c.createdAt || c.createdAt <= at).map((c) => c.contest);
  return contests.some((c) => isLive(c, at)) || (problem.published && !contests.some((c) => isPending(c, at)));
}

/** Why students cannot open a challenge now, if they cannot. */
export type Held = "competition" | "unpublished" | null;

/**
 * A homework challenge as the pages need it: `open` (students can get at it now,
 * so it is a link), `held` (why not), and `counts` (whether it counts towards
 * homework due at `dueAt` even if unsolved).
 */
function asChallenge<T extends Fetched>({ published, contests, ...rest }: T, dueAt: Date, now: Date) {
  const open = openToStudents({ published, contests }, now);
  const held: Held = open ? null : contests.some((c) => isPending(c.contest, now)) ? "competition" : "unpublished";
  return { ...rest, open, held, counts: openToStudents({ published, contests }, now < dueAt ? now : dueAt) };
}

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
 * As `stateOf`, leaving out challenges that do not count (see asChallenge)
 * unless solved. One solved after the due date that could not be opened before
 * it is not late. Homework with no challenges left is done; with challenges but
 * nothing yet to count, it is still to do.
 */
export function homeworkState(dueAt: Date, entries: { solvedAt: Date | undefined; counts: boolean }[], now = new Date()): HomeworkState {
  if (entries.length === 0) return "done";
  const counted = entries.filter((e) => e.solvedAt || e.counts).map((e) => (e.counts || !e.solvedAt || e.solvedAt <= dueAt ? e.solvedAt : dueAt));
  return counted.length > 0 ? stateOf(dueAt, counted, now) : "open";
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
  // Homework whose challenges have all been deleted has nothing to do, so students do not see it.
  return sets
    .filter((set) => set.problems.length > 0)
    .map((set) => {
      const problems = set.problems.map((p) => asChallenge(p.problem, set.dueAt, now));
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
          problems.map((p, i) => ({ solvedAt: times[i], counts: p.counts })),
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
  const problems = set.problems.map((p) => asChallenge(p.problem, set.dueAt, now));
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
      problems.map((p, i) => ({ solvedAt: times[i], counts: p.counts })),
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
    const challenges = set.problems.map((p) => asChallenge(p.problem, set.dueAt, now));
    const theirs = students.filter((s) => !set.classId || s.classId === set.classId);
    // Finished: every challenge that counts is solved (as in homeworkState; lateness does not matter here).
    const finished = theirs.filter((s) => {
      const solved = new Set(s.solves.map((x) => x.problemId));
      const counted = challenges.filter((c) => c.counts || solved.has(c.id));
      return challenges.length === 0 || (counted.length > 0 && counted.every((c) => solved.has(c.id)));
    }).length;
    return {
      id: set.id,
      title: set.title,
      dueAt: set.dueAt,
      className: set.class?.name ?? null,
      challenges: challenges.length,
      held: challenges.filter((c) => c.held === "competition").length,
      unpublished: challenges.filter((c) => c.held === "unpublished").length,
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
