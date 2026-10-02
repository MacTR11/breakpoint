import Link from "next/link";
import { Card, DifficultyBadge, KindBadge, PageHeader, StatusMark, chip } from "@/components/ui";
import { db } from "@/lib/db";
import { difficultyLabel, lockedPuzzleIds, MAX_PUZZLE_ATTEMPTS, practiceFilter } from "@/lib/problems";
import { requireUser } from "@/lib/session";
import { TRACKS, trackTitle } from "@/lib/tracks";
import { DIFFICULTIES } from "@/lib/types";

export const metadata = { title: "Practice" };

const TYPES = [
  { value: "", label: "Everything" },
  { value: "write", label: "Write code" },
  { value: "fix", label: "Fix the bug" },
  { value: "puzzle", label: "Puzzles" },
];

const typeOf = (p: { kind: string; style: string }) => (p.kind === "PUZZLE" ? "puzzle" : p.style === "FIX" ? "fix" : "write");

export default async function ProblemsPage({ searchParams }: PageProps<"/problems">) {
  const user = await requireUser();
  const params = await searchParams;
  const pick = (key: string) => (typeof params[key] === "string" ? (params[key] as string) : "");
  const filters = { type: pick("type"), difficulty: pick("difficulty"), track: pick("track") };

  const [all, solves, locked] = await Promise.all([
    db.problem.findMany({
      where: practiceFilter(),
      orderBy: [{ sortOrder: "asc" }],
      select: { id: true, slug: true, title: true, kind: true, style: true, difficulty: true, topic: true, points: true, track: true, _count: { select: { solves: true } } },
    }),
    db.solve.findMany({ where: { userId: user.id }, select: { problemId: true } }),
    lockedPuzzleIds(user.id),
  ]);
  const solved = new Set(solves.map((s) => s.problemId));
  const problems = all.filter(
    (p) => (!filters.type || typeOf(p) === filters.type) && (!filters.difficulty || p.difficulty === filters.difficulty) && (!filters.track || p.track === filters.track),
  );
  const tracksInUse = TRACKS.filter((track) => all.some((p) => p.track === track.id));

  const href = (change: Partial<typeof filters>) => {
    const query = new URLSearchParams(Object.entries({ ...filters, ...change }).filter(([, v]) => v));
    return query.size ? `/problems?${query}` : "/problems";
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-12">
      <PageHeader
        title="Practice"
        intro={`Code is marked automatically and can be retried freely. Puzzles give you ${MAX_PUZZLE_ATTEMPTS} attempts, and a wrong answer costs points.`}
      />

      <div className="space-y-3 mb-8">
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <Link key={t.value} href={href({ type: t.value })} className={chip(filters.type === t.value)}>
              {t.label}
            </Link>
          ))}
          <span className="mx-1 hidden w-px bg-line sm:block" />
          <Link href={href({ difficulty: "" })} className={chip(!filters.difficulty)}>
            Any level
          </Link>
          {DIFFICULTIES.map((d) => (
            <Link key={d} href={href({ difficulty: d })} className={chip(filters.difficulty === d)}>
              {difficultyLabel[d]}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={href({ track: "" })} className={chip(!filters.track)}>
            All topics
          </Link>
          {tracksInUse.map((track) => (
            <Link key={track.id} href={href({ track: track.id })} className={chip(filters.track === track.id)}>
              {track.title}
            </Link>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        {problems.length === 0 ? (
          <p className="p-10 text-center text-muted">No challenges match those filters.</p>
        ) : (
          <ul className="divide-y divide-line">
            {problems.map((p) => (
              <li key={p.id}>
                <Link href={`/problems/${p.slug}`} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/60">
                  <StatusMark status={solved.has(p.id) ? "solved" : locked.has(p.id) ? "locked" : "open"} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{p.title}</p>
                    <p className="text-sm text-muted truncate">
                      {trackTitle(p.track)} · {p.topic} · solved by {p._count.solves}
                    </p>
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
        )}
      </Card>
      <p className="mt-4 text-sm text-muted">
        {problems.length} of {all.length} challenges shown.
      </p>
    </main>
  );
}
