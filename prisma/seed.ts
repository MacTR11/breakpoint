// Loads the starter problems and competition packs from content/ into the
// database. Safe to re-run: problems are matched on their slug and updated in
// place, and competitions that already exist keep their dates. Problems made
// in the teacher dashboard are never touched.
import { PrismaClient } from "@prisma/client";
import { loadContent, loadContests } from "./content";

const db = new PrismaClient();
const FORTNIGHT = 14 * 24 * 60 * 60 * 1000;

async function main() {
  const problems = loadContent();
  const packs = new Map<string, string[]>();

  for (const p of problems) {
    const data = {
      title: p.title,
      kind: p.kind,
      style: p.style ?? "WRITE",
      difficulty: p.difficulty,
      topic: p.topic,
      track: p.track,
      specRef: p.specRef,
      points: p.points,
      description: p.description,
      sortOrder: p.sortOrder,
      fromFile: true,
      hints: JSON.stringify(p.hints),
      functionName: p.functionName ?? null,
      starterCode: p.starter ?? null,
      tests: p.tests ? JSON.stringify(p.tests) : null,
      solution: p.solution ?? null,
      banned: p.banned ? JSON.stringify(p.banned) : null,
      options: p.options ? JSON.stringify(p.options) : null,
      answer: p.answer === undefined ? null : String(p.answer),
      explanation: p.explanation ?? null,
    };
    const saved = await db.problem.upsert({ where: { slug: p.slug }, create: { slug: p.slug, ...data }, update: data });
    if (p.contest) packs.set(p.contest, [...(packs.get(p.contest) ?? []), saved.id]);
  }

  // A file that has been deleted takes its problem with it.
  const pruned = await db.problem.deleteMany({ where: { fromFile: true, slug: { notIn: problems.map((p) => p.slug) } } });

  const contests = loadContests();
  for (const pack of contests) {
    // Databases seeded before packs had slugs are matched on title, once.
    const existing =
      (await db.contest.findUnique({ where: { slug: pack.slug } })) ?? (await db.contest.findFirst({ where: { slug: null, title: pack.title } }));
    const now = new Date();
    const contest = existing
      ? await db.contest.update({ where: { id: existing.id }, data: { slug: pack.slug, title: pack.title, description: pack.description } })
      : await db.contest.create({
          data: {
            slug: pack.slug,
            title: pack.title,
            description: pack.description,
            ...(pack.live ? { startsAt: now, endsAt: new Date(now.getTime() + FORTNIGHT) } : {}),
          },
        });
    for (const [sortOrder, problemId] of (packs.get(pack.slug) ?? []).entries()) {
      await db.contestProblem.upsert({
        where: { contestId_problemId: { contestId: contest.id, problemId } },
        create: { contestId: contest.id, problemId, sortOrder },
        update: { sortOrder },
      });
    }
  }
  // Packs dropped from contests.json go too, unless a teacher has already scheduled them.
  await db.contest.deleteMany({ where: { slug: { not: null, notIn: contests.map((c) => c.slug) }, startsAt: null } });

  console.log(`Seeded ${problems.length} problems and ${contests.length} competition packs${pruned.count ? `; removed ${pruned.count} old problems` : ""}.`);
}

main().finally(() => db.$disconnect());
