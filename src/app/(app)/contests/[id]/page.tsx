import Link from "next/link";
import { notFound } from "next/navigation";
import { AutoRefresh, Countdown } from "@/components/countdown";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { ButtonLink, Card, DifficultyBadge, KindBadge, StatusMark, backLink, formatDateTime } from "@/components/ui";
import { db } from "@/lib/db";
import { lockedPuzzleIds } from "@/lib/problems";
import { contestState, leaderboard } from "@/lib/scoring";
import { requireUser } from "@/lib/session";

export async function generateMetadata({ params }: PageProps<"/contests/[id]">) {
  const { id } = await params;
  const contest = await db.contest.findUnique({ where: { id }, select: { title: true } });
  return { title: contest?.title ?? "Competition" };
}

export default async function ContestPage({ params }: PageProps<"/contests/[id]">) {
  const user = await requireUser();
  const { id } = await params;
  const contest = await db.contest.findUnique({
    where: { id },
    include: { problems: { orderBy: { sortOrder: "asc" }, include: { problem: true } } },
  });
  const isTeacher = user.role === "TEACHER";
  if (!contest) notFound();
  const state = contestState(contest);
  if (state === "DRAFT" && !isTeacher) notFound();

  const problems = contest.problems.map((cp) => cp.problem);
  const problemIds = problems.map((p) => p.id);
  const started = state === "LIVE" || state === "FINISHED";
  const showProblems = started || isTeacher;

  const [rows, mySolves, locked] = await Promise.all([
    started ? leaderboard({ problemIds, from: contest.startsAt!, to: contest.endsAt!, tieBreakByTime: true }) : [],
    db.solve.findMany({ where: { userId: user.id, problemId: { in: problemIds } }, select: { problemId: true } }),
    lockedPuzzleIds(user.id),
  ]);
  const solved = new Set(mySolves.map((s) => s.problemId));
  const totalPoints = problems.reduce((sum, p) => sum + p.points, 0);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-12">
      {state === "LIVE" && <AutoRefresh seconds={30} />}
      <Link href="/contests" className={backLink}>
        ‹ Competitions
      </Link>

      <div className="panel-hero mt-5 rounded-[2rem] px-8 py-10 flex flex-wrap items-end justify-between gap-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">{contest.title}</h1>
          {contest.description && <p className="mt-3 text-lg text-white/80">{contest.description}</p>}
          <p className="mt-4 text-sm text-white/70">
            {state === "DRAFT" ? "Not scheduled yet" : `${formatDateTime(contest.startsAt!)} to ${formatDateTime(contest.endsAt!)}`} · {problems.length} problems ·{" "}
            {totalPoints} points available
          </p>
        </div>
        <div className="text-right">
          {state === "LIVE" && (
            <>
              <p className="text-sm font-medium text-white/85">Time remaining</p>
              <Countdown to={contest.endsAt!.toISOString()} className="font-mono text-4xl font-medium" />
            </>
          )}
          {state === "UPCOMING" && (
            <>
              <p className="text-sm font-medium text-white/80">Starts in</p>
              <Countdown to={contest.startsAt!.toISOString()} className="font-mono text-4xl font-medium" />
            </>
          )}
          {state === "FINISHED" && <p className="text-xl font-medium text-white/80">Finished</p>}
        </div>
      </div>

      {isTeacher && (
        <div className="mt-5">
          <ButtonLink href={`/teacher/contests/${contest.id}`} variant="secondary">
            {state === "DRAFT" ? "Schedule this competition" : "Edit competition"}
          </ButtonLink>
        </div>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-5">Problems</h2>
          {!showProblems ? (
            <Card className="p-7 text-muted">The problems will appear here when the competition starts.</Card>
          ) : (
            <Card className="overflow-hidden">
              {!started && <p className="bg-[#fff2d9] px-6 py-3 text-sm text-[#7a4700]">Only teachers can see these until the competition starts.</p>}
              <ul className="divide-y divide-line">
                {problems.map((p, index) => (
                  <li key={p.id}>
                    <Link href={`/problems/${p.slug}`} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/60">
                      <StatusMark status={solved.has(p.id) ? "solved" : locked.has(p.id) ? "locked" : "open"} />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">
                          <span className="text-muted font-mono text-sm mr-2">{index + 1}</span>
                          {p.title}
                        </p>
                        <div className="mt-1.5 flex gap-2">
                          <KindBadge kind={p.kind} style={p.style} />
                          <DifficultyBadge difficulty={p.difficulty} />
                        </div>
                      </div>
                      <span className="text-sm text-muted tabular-nums">{p.points} pts</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-5">{state === "FINISHED" ? "Final standings" : "Live standings"}</h2>
          <LeaderboardTable rows={rows} currentUserId={user.id} emptyMessage={started ? "No points scored yet." : "Standings will appear once the competition starts."} />
          <p className="mt-4 text-sm text-muted">
            Ranked by points, less penalties for wrong puzzle answers. Where points are equal, whoever reached that score first places higher.
          </p>
        </section>
      </div>
    </main>
  );
}
