import type { MockPaper, Problem } from "@prisma/client";
import { db } from "./db";
import { POINTS_PER_MARK, marksIn } from "./points";
import { practiceFilter } from "./problems";

// A mock paper is a timed sitting of exam-style questions, chosen a scenario
// at a time (Cinema (a), (b), (c)...). Nothing about the marks is stored: they
// are worked out from the submissions made while the paper was running.

/** A question's marks, from the "[4 marks]" in its description, or else from its points. */
export const marksOf = (problem: Pick<Problem, "description" | "points">) => marksIn(problem.description) ?? Math.max(1, Math.round(problem.points / POINTS_PER_MARK));

/** "Cinema (a): count the free seats" is part of "Cinema". */
const partOf = (title: string) => title.split(" (")[0].trim();

export type Scenario = { key: string; name: string; marks: number; parts: { id: string; slug: string; title: string; marks: number }[] };

/**
 * The exam-style questions students can open, grouped into their scenarios in
 * paper order. A scenario's parts share a file number in the tens (2051, 2052
 * and 2053 are one), and its name joins its parts' names: "Searching and sorting".
 */
export async function examScenarios(): Promise<Scenario[]> {
  const questions = await db.problem.findMany({
    where: { track: "exam", kind: "CODE", ...practiceFilter() },
    orderBy: { sortOrder: "asc" },
    select: { id: true, slug: true, title: true, description: true, points: true, sortOrder: true },
  });
  const scenarios = new Map<string, Scenario>();
  for (const q of questions) {
    const key = String(Math.floor(q.sortOrder / 10));
    const scenario = scenarios.get(key) ?? { key, name: "", marks: 0, parts: [] };
    const name = partOf(q.title);
    if (!scenario.name) scenario.name = name;
    else if (!scenario.name.toLowerCase().split(" and ").includes(name.toLowerCase())) scenario.name += ` and ${name.charAt(0).toLowerCase()}${name.slice(1)}`;
    const marks = marksOf(q);
    scenario.parts.push({ id: q.id, slug: q.slug, title: q.title, marks });
    scenario.marks += marks;
    scenarios.set(key, scenario);
  }
  return [...scenarios.values()];
}

export const paperIds = (paper: Pick<MockPaper, "problemIds">): string[] => {
  try {
    const ids = JSON.parse(paper.problemIds);
    return Array.isArray(ids) ? ids.map(String) : [];
  } catch {
    return [];
  }
};

/** When the paper stopped, or will stop: handed in early, or out of time. */
export const paperEnd = (paper: Pick<MockPaper, "endsAt" | "finishedAt">) => (paper.finishedAt && paper.finishedAt < paper.endsAt ? paper.finishedAt : paper.endsAt);

export const isRunning = (paper: Pick<MockPaper, "endsAt" | "finishedAt">, now = new Date()) => paperEnd(paper) > now;

/** The paper a student is sitting now, if any. */
export const runningPaper = (userId: string) => db.mockPaper.findFirst({ where: { userId, finishedAt: null, endsAt: { gt: new Date() } }, orderBy: { startedAt: "desc" } });

/** The running paper that includes this question, which turns hints and model answers off. */
export async function paperUsing(userId: string, problemId: string) {
  const paper = await runningPaper(userId);
  return paper && paperIds(paper).includes(problemId) ? paper : null;
}

export type PartResult = { id: string; slug: string; title: string; marks: number; scored: number; attempted: boolean; passed: number; total: number };

/**
 * Marks for each question: full marks once accepted, otherwise the share of
 * tests the best attempt passed, rounded down. An estimate of a mark scheme,
 * not a replacement for one.
 */
export async function paperResults(paper: MockPaper) {
  const ids = paperIds(paper);
  const [questions, submissions] = await Promise.all([
    db.problem.findMany({ where: { id: { in: ids } }, select: { id: true, slug: true, title: true, description: true, points: true } }),
    db.submission.findMany({
      where: { userId: paper.userId, problemId: { in: ids }, createdAt: { gte: paper.startedAt, lte: paperEnd(paper) } },
      select: { problemId: true, status: true, passed: true, total: true },
    }),
  ]);
  const byId = new Map(questions.map((q) => [q.id, q]));
  const parts: PartResult[] = ids.flatMap((id) => {
    const q = byId.get(id);
    if (!q) return [];
    const marks = marksOf(q);
    const tries = submissions.filter((s) => s.problemId === id);
    const share = (s: { passed: number; total: number }) => (s.total ? s.passed / s.total : 0);
    const best = tries.reduce<(typeof tries)[number] | null>((top, s) => (!top || share(s) > share(top) ? s : top), null);
    const accepted = tries.some((s) => s.status === "ACCEPTED");
    const scored = accepted ? marks : best ? Math.floor(marks * share(best)) : 0;
    return [{ id, slug: q.slug, title: q.title, marks, scored, attempted: tries.length > 0, passed: best?.passed ?? 0, total: best?.total ?? 0 }];
  });
  const marks = parts.reduce((sum, p) => sum + p.marks, 0);
  const scored = parts.reduce((sum, p) => sum + p.scored, 0);
  return { parts, marks, scored, percent: marks ? Math.round((scored / marks) * 100) : 0 };
}

/** A student's papers, newest first, each with its result. */
export async function papersOf(userId: string) {
  const papers = await db.mockPaper.findMany({ where: { userId }, orderBy: { startedAt: "desc" } });
  return Promise.all(papers.map(async (paper) => ({ paper, result: await paperResults(paper) })));
}
