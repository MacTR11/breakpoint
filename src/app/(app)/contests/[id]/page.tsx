import { notFound } from "next/navigation";
import { ChallengeList } from "@/components/challenge-list";
import { AutoRefresh, Countdown } from "@/components/countdown";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { ButtonLink, PageHeader, formatDateTime } from "@/components/ui";
import { db } from "@/lib/db";
import { standings } from "@/lib/problems";
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

  const [rows, statusOf] = await Promise.all([
    started ? leaderboard({ problemIds, from: contest.startsAt!, to: contest.endsAt!, tieBreakByTime: true }) : [],
    standings(user.id),
  ]);
  const totalPoints = problems.reduce((sum, p) => sum + p.points, 0);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      {state === "LIVE" && <AutoRefresh seconds={30} />}
      <PageHeader path={[{ label: "competitions", href: "/contests" }, { label: contest.title }]} title={contest.title} intro={contest.description || undefined}>
        {isTeacher && (
          <ButtonLink href={`/teacher/contests/${contest.id}`} variant="secondary">
            {state === "DRAFT" ? "Schedule" : "Edit"}
          </ButtonLink>
        )}
      </PageHeader>

      <dl className="mb-10 font-mono text-sm leading-7">
        <div className="flex gap-4">
          <dt className="w-20 text-muted">status</dt>
          <dd>
            {state === "LIVE" && (
              <>
                <span className="font-semibold text-fail">LIVE</span>, ends in <Countdown to={contest.endsAt!.toISOString()} />
              </>
            )}
            {state === "UPCOMING" && (
              <>
                starts in <Countdown to={contest.startsAt!.toISOString()} />
              </>
            )}
            {state === "FINISHED" && "finished"}
            {state === "DRAFT" && "not scheduled"}
          </dd>
        </div>
        {state !== "DRAFT" && (
          <div className="flex gap-4">
            <dt className="w-20 text-muted">runs</dt>
            <dd>
              {formatDateTime(contest.startsAt!)} to {formatDateTime(contest.endsAt!)}
            </dd>
          </div>
        )}
        <div className="flex gap-4">
          <dt className="w-20 text-muted">available</dt>
          <dd>
            {totalPoints} points in {problems.length} challenges
          </dd>
        </div>
      </dl>

      <div className="grid gap-x-12 gap-y-10 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-lg font-semibold">Challenges</h2>
          {!showProblems ? (
            <p className="border-y border-line py-6 text-muted">The challenges will appear here when the competition starts.</p>
          ) : (
            <>
              {!started && <p className="mb-2 text-sm text-warn">Only teachers can see these until the competition starts.</p>}
              <ChallengeList problems={problems} statusOf={statusOf} showTrack={false} numbered />
            </>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">{state === "FINISHED" ? "Final standings" : "Standings"}</h2>
          <LeaderboardTable rows={rows} currentUserId={user.id} emptyMessage={started ? "No points scored yet." : "Standings will appear once the competition starts."} />
          <p className="mt-3 text-sm text-muted">Ranked by points, less penalties for wrong puzzle answers. Where points are equal, whoever reached that score first places higher.</p>
        </section>
      </div>
    </main>
  );
}
