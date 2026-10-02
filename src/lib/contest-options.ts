import { db } from "./db";
import { isPending } from "./problems";

/**
 * Problems a teacher can put in a competition, noting anything that would make
 * a problem a poor choice: already solved, or promised to another competition.
 */
export async function contestProblemOptions(editingContestId?: string) {
  const problems = await db.problem.findMany({
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      title: true,
      kind: true,
      style: true,
      track: true,
      difficulty: true,
      points: true,
      specRef: true,
      published: true,
      solves: { where: { user: { role: "STUDENT" } }, select: { id: true } },
      contests: { select: { contest: true } },
    },
  });
  return problems.map(({ solves, published, contests, ...p }) => {
    const other = contests.map((c) => c.contest).find((c) => c.id !== editingContestId && isPending(c));
    const notes = [!published ? "unpublished" : null, other ? `in ${other.title}` : null, solves.length ? `already solved by ${solves.length}` : null];
    return { ...p, note: notes.filter(Boolean).join(", ") || null };
  });
}
