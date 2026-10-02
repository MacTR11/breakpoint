import Link from "next/link";
import { HintCoin } from "@/components/brand";
import { Countdown } from "@/components/countdown";
import { ButtonLink, Card, DifficultyBadge, KindBadge, ProgressBar, signed } from "@/components/ui";
import { db } from "@/lib/db";
import { hintWallet, SOLVES_PER_HINT } from "@/lib/hints";
import { lockedPuzzleIds, practiceFilter } from "@/lib/problems";
import { leaderboard, pointsOf } from "@/lib/scoring";
import { requireUser } from "@/lib/session";
import { TRACKS } from "@/lib/tracks";
import { DIFFICULTIES } from "@/lib/types";

export default async function HomePage() {
  const user = await requireUser();
  const now = new Date();

  const [problems, solves, locked, points, wallet, board, liveContests, upcoming] = await Promise.all([
    db.problem.findMany({
      where: practiceFilter(),
      orderBy: [{ sortOrder: "asc" }],
      select: { id: true, slug: true, title: true, kind: true, style: true, difficulty: true, topic: true, points: true, track: true },
    }),
    db.solve.findMany({ where: { userId: user.id }, select: { problemId: true } }),
    lockedPuzzleIds(user.id),
    pointsOf(user.id),
    hintWallet(user.id),
    leaderboard(),
    db.contest.findMany({ where: { startsAt: { lte: now }, endsAt: { gt: now } }, orderBy: { endsAt: "asc" } }),
    db.contest.findFirst({ where: { startsAt: { gt: now } }, orderBy: { startsAt: "asc" } }),
  ]);

  const solvedIds = new Set(solves.map((s) => s.problemId));
  const rank = board.find((row) => row.userId === user.id)?.rank;
  const solvedInPractice = problems.filter((p) => solvedIds.has(p.id)).length;

  // Suggest the easiest open challenge of each kind: write, fix, read.
  const order = (d: string) => DIFFICULTIES.indexOf(d as (typeof DIFFICULTIES)[number]);
  const open = problems.filter((p) => !solvedIds.has(p.id) && !locked.has(p.id)).sort((a, b) => order(a.difficulty) - order(b.difficulty));
  const pick = (test: (p: (typeof open)[number]) => boolean) => open.filter(test).slice(0, 2);
  const suggestions = [...pick((p) => p.kind === "CODE" && p.style !== "FIX"), ...pick((p) => p.style === "FIX"), ...pick((p) => p.kind === "PUZZLE")];
  const progressInSet = wallet.solved % SOLVES_PER_HINT;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-12">
      <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">Hello, {user.name.split(" ")[0]}.</h1>
      <p className="mt-3 text-lg text-muted">
        {solvedIds.size === 0 ? "Solve your first challenge to get on the leaderboard." : "Here is where you stand. Keep going."}
      </p>

      {liveContests.map((contest) => (
        <Link key={contest.id} href={`/contests/${contest.id}`} className="panel-hero glass-lift mt-10 flex flex-wrap items-center justify-between gap-4 rounded-[2rem] px-8 py-7">
          <div>
            <p className="text-sm font-medium text-white/85">Competition live now</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight">{contest.title}</p>
          </div>
          <p className="text-white/80">
            Ends in <Countdown to={contest.endsAt!.toISOString()} className="font-mono font-medium text-white" />
          </p>
        </Link>
      ))}
      {liveContests.length === 0 && upcoming && (
        <Link href={`/contests/${upcoming.id}`} className="glass mt-10 flex flex-wrap items-center justify-between gap-4 rounded-[2rem] px-8 py-7">
          <div>
            <p className="text-sm font-medium text-accent">Next competition</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight">{upcoming.title}</p>
          </div>
          <p className="text-muted">
            Starts in <Countdown to={upcoming.startsAt!.toISOString()} className="font-mono font-medium text-ink" />
          </p>
        </Link>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="tint-blue p-7">
          <p className="text-sm text-muted">Points</p>
          <p className="mt-1 text-5xl font-semibold tracking-tight tabular-nums">{signed(points)}</p>
        </Card>
        <Card className="tint-green p-7">
          <p className="text-sm text-muted">Solved</p>
          <p className="mt-1 text-5xl font-semibold tracking-tight tabular-nums">
            {solvedInPractice}
            <span className="text-2xl text-muted font-normal"> of {problems.length}</span>
          </p>
        </Card>
        <Card className="tint-purple p-7">
          <p className="text-sm text-muted">Leaderboard</p>
          <p className="mt-1 text-5xl font-semibold tracking-tight tabular-nums">
            {user.role === "TEACHER" ? <span className="text-xl font-normal text-muted">Teachers are not ranked</span> : rank ? `#${rank}` : "—"}
          </p>
        </Card>
        <Card className="tint-yellow p-7">
          <p className="text-sm text-muted">Hints</p>
          <p className="mt-1 flex items-center gap-3 text-5xl font-semibold tracking-tight tabular-nums">
            <HintCoin size={38} />
            {wallet.balance}
          </p>
          <div className="mt-4 flex items-center gap-2" aria-hidden="true">
            {Array.from({ length: SOLVES_PER_HINT }, (_, i) => (
              <span key={i} className={`h-2 flex-1 rounded-full ${i < progressInSet ? "bg-[#ff9f0a]" : "bg-black/10"}`} />
            ))}
          </div>
          <p className="mt-2 text-sm text-muted">
            {wallet.untilNext} more solve{wallet.untilNext === 1 ? "" : "s"} earns a hint
          </p>
        </Card>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="text-2xl font-semibold tracking-tight">Try next</h2>
            <Link href="/problems" className="text-link hover:underline">
              All challenges ›
            </Link>
          </div>
          {suggestions.length === 0 ? (
            <Card className="p-7 text-muted">You have worked through everything in practice. Impressive.</Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {suggestions.map((p) => (
                <Link key={p.id} href={`/problems/${p.slug}`} className="glass rounded-3xl p-6">
                  <div className="flex items-center gap-2">
                    <KindBadge kind={p.kind} style={p.style} />
                    <DifficultyBadge difficulty={p.difficulty} />
                    <span className="ml-auto text-sm text-muted tabular-nums">{p.points} pts</span>
                  </div>
                  <p className="mt-4 text-lg font-semibold tracking-tight">{p.title}</p>
                  <p className="text-sm text-muted">{p.topic}</p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-5">Your progress</h2>
          <Card className="p-7 space-y-5">
            {TRACKS.map((track) => {
              const inTrack = problems.filter((p) => p.track === track.id);
              if (inTrack.length === 0) return null;
              const done = inTrack.filter((p) => solvedIds.has(p.id)).length;
              return (
                <div key={track.id}>
                  <div className="mb-2 flex justify-between gap-3 text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: track.color }} />
                      {track.title}
                    </span>
                    <span className="text-muted tabular-nums whitespace-nowrap">
                      {done} of {inTrack.length}
                    </span>
                  </div>
                  <ProgressBar value={done} total={inTrack.length} color={track.color} />
                </div>
              );
            })}
            <ButtonLink href="/syllabus" variant="secondary">
              Open course map
            </ButtonLink>
          </Card>
        </section>
      </div>
    </main>
  );
}
