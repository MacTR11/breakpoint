import Link from "next/link";
import { Card, DifficultyBadge, KindBadge, PageHeader, ProgressBar, StatusMark } from "@/components/ui";
import { db } from "@/lib/db";
import { lockedPuzzleIds, practiceFilter } from "@/lib/problems";
import { requireUser } from "@/lib/session";
import { TRACKS } from "@/lib/tracks";
import { DIFFICULTIES } from "@/lib/types";

export const metadata = { title: "Course map" };

export default async function SyllabusPage() {
  const user = await requireUser();
  const [problems, solves, locked] = await Promise.all([
    db.problem.findMany({
      where: practiceFilter(),
      orderBy: [{ sortOrder: "asc" }],
      select: { id: true, slug: true, title: true, kind: true, style: true, difficulty: true, points: true, track: true, topic: true },
    }),
    db.solve.findMany({ where: { userId: user.id }, select: { problemId: true } }),
    lockedPuzzleIds(user.id),
  ]);
  const solved = new Set(solves.map((s) => s.problemId));
  const order = (d: string) => DIFFICULTIES.indexOf(d as (typeof DIFFICULTIES)[number]);
  const tracks = TRACKS.map((track) => ({
    ...track,
    problems: problems.filter((p) => p.track === track.id).sort((a, b) => order(a.difficulty) - order(b.difficulty)),
  })).filter((track) => track.problems.length > 0);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-12">
      <PageHeader title="Course map" intro="Every practice challenge, grouped by topic and ordered from easiest to hardest. Use it to find the gaps." />

      <nav className="mb-12 flex flex-wrap gap-2">
        {tracks.map((track) => (
          <a key={track.id} href={`#${track.id}`} className="chip inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: track.color }} />
            {track.title}
          </a>
        ))}
      </nav>

      <div className="space-y-12">
        {tracks.map((track) => {
          const done = track.problems.filter((p) => solved.has(p.id)).length;
          return (
            <section key={track.id} id={track.id} className="scroll-mt-24">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="flex items-center gap-3 text-3xl font-semibold tracking-tight">
                  <span className="h-4 w-4 rounded-full" style={{ background: track.color }} />
                  {track.title}
                </h2>
                <p className="text-muted tabular-nums">
                  {done} of {track.problems.length} solved
                </p>
              </div>
              <p className="mt-1 max-w-2xl text-muted">{track.blurb}</p>
              <div className="mt-4 max-w-sm">
                <ProgressBar value={done} total={track.problems.length} color={track.color} />
              </div>

              <Card className="mt-5 overflow-hidden">
                <ul className="divide-y divide-line">
                  {track.problems.map((p) => (
                    <li key={p.id}>
                      <Link href={`/problems/${p.slug}`} className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-white/60">
                        <StatusMark status={solved.has(p.id) ? "solved" : locked.has(p.id) ? "locked" : "open"} />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{p.title}</p>
                          <p className="text-sm text-muted truncate">{p.topic}</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                          <KindBadge kind={p.kind} style={p.style} />
                          <DifficultyBadge difficulty={p.difficulty} />
                        </div>
                        <span className="w-14 text-right text-sm text-muted tabular-nums">{p.points} pts</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            </section>
          );
        })}
      </div>
    </main>
  );
}
