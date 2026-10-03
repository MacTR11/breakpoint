// Loads the starter problems and competition packs from content/ into the
// database. Safe to re-run: problems are matched on their slug and updated in
// place, and competitions that already exist keep their dates. Problems made
// in the teacher dashboard are never touched. A renamed file keeps its
// problem (matched on the title). A problem whose file has gone is removed
// only if no student has worked on it and no homework or mock paper uses it.
import { PrismaClient } from "@prisma/client";
import { loadContent, loadContests } from "./content";

const db = new PrismaClient();
const FORTNIGHT = 14 * 24 * 60 * 60 * 1000;

async function main() {
  const loaded = loadContent();
  const packs = new Map<string, string[]>();
  const fileSlugs = new Set(loaded.map((p) => p.slug));
  const rows = await db.problem.findMany({ select: { id: true, slug: true, title: true, fromFile: true } });
  const bySlug = new Map(rows.map((p) => [p.slug, p]));

  // A file renamed since the last seed: its problem takes the new slug, keeping its solves.
  const renamed: string[] = [];
  const orphans = rows.filter((p) => p.fromFile && !fileSlugs.has(p.slug));
  for (const p of loaded) {
    const old = bySlug.has(p.slug) ? undefined : orphans.find((o) => o.title === p.title);
    if (!old) continue;
    await db.problem.update({ where: { id: old.id }, data: { slug: p.slug } });
    orphans.splice(orphans.indexOf(old), 1);
    bySlug.set(p.slug, { ...old, slug: p.slug });
    renamed.push(`${old.slug} → ${p.slug}`);
  }

  // A slug held by a problem that is not (or no longer) from a file is only taken over by
  // a file of the same title (a deleted file put back). Anything else would hand that
  // problem's solves, and so its answers, to a different challenge.
  const clashes = loaded.filter((p) => {
    const holder = bySlug.get(p.slug);
    return holder && !holder.fromFile && holder.title !== p.title;
  });
  const problems = loaded.filter((p) => !clashes.includes(p));

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

  // A file that has been deleted takes its problem with it, unless students
  // have worked on it (deleting it would delete their solves and points too),
  // or homework or a mock paper uses it. Those are kept, unpublished, taken out
  // of competitions that have not started, and handed to the teacher to deal
  // with in Teacher > Problems.
  const students = { where: { user: { role: "STUDENT" } } } as const;
  const gone = await db.problem.findMany({
    where: { fromFile: true, slug: { notIn: [...fileSlugs] } },
    select: { id: true, slug: true, _count: { select: { solves: students, submissions: students, homework: true } } },
  });
  const onPapers = new Set((await db.mockPaper.findMany({ select: { problemIds: true } })).flatMap((paper) => JSON.parse(paper.problemIds) as string[]));
  const kept = gone.filter((p) => p._count.solves + p._count.submissions + p._count.homework > 0 || onPapers.has(p.id));
  if (kept.length > 0) {
    const ids = kept.map((p) => p.id);
    await db.problem.updateMany({ where: { id: { in: ids } }, data: { published: false, fromFile: false } });
    await db.contestProblem.deleteMany({ where: { problemId: { in: ids }, contest: { OR: [{ startsAt: null }, { startsAt: { gt: new Date() } }] } } });
  }
  const pruned = await db.problem.deleteMany({ where: { id: { in: gone.filter((p) => !kept.includes(p)).map((p) => p.id) } } });

  const contests = loadContests();
  for (const pack of contests) {
    // Databases seeded before packs had slugs are matched on title, once.
    const existing =
      (await db.contest.findUnique({ where: { slug: pack.slug } })) ?? (await db.contest.findFirst({ where: { slug: null, title: pack.title } }));
    const now = new Date();
    // Left alone when nothing has changed.
    const changed = existing && (existing.slug !== pack.slug || existing.title !== pack.title || existing.description !== pack.description);
    const contest = existing
      ? changed
        ? await db.contest.update({ where: { id: existing.id }, data: { slug: pack.slug, title: pack.title, description: pack.description } })
        : existing
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

  // Includes any kept above whose file has since come back: the seed never republishes on its own.
  const now = new Date();
  const hidden = await db.problem.findMany({
    where: { published: false, OR: [{ fromFile: true }, { id: { in: kept.map((p) => p.id) } }] },
    select: { slug: true, contests: { select: { contest: { select: { title: true, startsAt: true, endsAt: true } } } } },
  });
  console.log(`Seeded ${problems.length} problems and ${contests.length} competition packs${pruned.count ? `; removed ${pruned.count} old problems` : ""}.`);
  if (renamed.length > 0) console.log(`Renamed, keeping their solves: ${renamed.join(", ")}.`);
  for (const p of clashes) {
    console.log(
      `Not loaded: the file for "${p.title}" uses the slug ${p.slug}, which belongs to a different problem made in Teacher > Problems or kept from an old file. Rename the file, or deal with that problem first.`,
    );
  }
  if (kept.length > 0) {
    console.log(
      `Kept ${kept.length} problem${kept.length === 1 ? "" : "s"} whose file has gone, unpublished, because students have worked on ${kept.length === 1 ? "it" : "them"} or homework or a mock paper uses ${kept.length === 1 ? "it" : "them"}: ${kept.map((p) => p.slug).join(", ")}.`,
    );
    console.log("Their points are safe. Delete or republish them in Teacher > Problems.");
  }
  if (hidden.length > 0) {
    console.log(`Unpublished, so not in Practice: ${hidden.map((p) => p.slug).join(", ")}. Publish them in Teacher > Problems if they should be.`);
    for (const p of hidden) {
      for (const { contest } of p.contests) {
        if (contest.startsAt && contest.endsAt && contest.endsAt > now) {
          console.log(`  ${p.slug} is in ${contest.title}, so students can open it there ${contest.startsAt <= now ? "now" : "once it starts"}.`);
        }
      }
    }
  }
}

main().finally(() => db.$disconnect());
