import { notFound } from "next/navigation";
import { ChallengeList } from "@/components/challenge-list";
import { AutoRefresh, Countdown } from "@/components/countdown";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { ButtonLink, Page, PageHeader, Tag, formatDateTime } from "@/components/ui";
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
    <Page>
      {state === "LIVE" && <AutoRefresh seconds={30} />}
      <PageHeader path={[{ label: "competitions", href: "/contests" }, { label: contest.title }]} title={contest.title} intro={contest.description || undefined}>
        {isTeacher && (
          <ButtonLink href={`/teacher/contests/${contest.id}`} variant="secondary">
            {state === "DRAFT" ? "Schedule" : "Edit"}
          </ButtonLink>
        )}
      </PageHeader>

      <dl className="card mb-4 text-[15px] leading-8">
        <div className="flex gap-4">
          <dt className="w-24 shrink-0 text-muted">Status</dt>
          <dd>
            {state === "LIVE" && (
              <>
                <Tag color="var(--fail)">Live</Tag> ends in <Countdown to={contest.endsAt!.toISOString()} className="font-semibold tabular-nums" />
              </>
            )}
            {state === "UPCOMING" && (
              <>
                <Tag color="var(--warn)">Upcoming</Tag> starts in <Countdown to={contest.startsAt!.toISOString()} className="font-semibold tabular-nums" />
              </>
            )}
            {state === "FINISHED" && "Finished"}
            {state === "DRAFT" && "Not scheduled"}
          </dd>
        </div>
        {state !== "DRAFT" && (
          <div className="flex gap-4">
            <dt className="w-24 shrink-0 text-muted">Runs</dt>
            <dd>
              {formatDateTime(contest.startsAt!)} to {formatDateTime(contest.endsAt!)}
            </dd>
          </div>
        )}
        <div className="flex gap-4">
          <dt className="w-24 shrink-0 text-muted">Available</dt>
          <dd>
            {totalPoints} points in {problems.length} challenges
          </dd>
        </div>
      </dl>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="card">
          <h2 className="cap mb-1">Challenges</h2>
          {!showProblems ? (
            <p className="py-4 text-muted">The challenges will appear here when the competition starts.</p>
          ) : (
            <>
              {!started && <p className="mb-2 text-sm text-warn">Only teachers can see these until the competition starts.</p>}
              <ChallengeList problems={problems} statusOf={statusOf} showTrack={false} numbered />
            </>
          )}
        </section>

        <section className="card">
          <h2 className="cap mb-1">{state === "FINISHED" ? "Final standings" : "Standings"}</h2>
          <LeaderboardTable rows={rows} currentUserId={user.id} emptyMessage={started ? "No points scored yet." : "Standings will appear once the competition starts."} />
          <p className="mt-3 text-sm text-muted">Ranked by points, less penalties for wrong puzzle answers. Where points are equal, whoever reached that score first places higher.</p>
        </section>
      </div>
    </Page>
  );
}
