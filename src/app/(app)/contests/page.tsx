import Link from "next/link";
import { Countdown } from "@/components/countdown";
import { Page, PageHeader, Tag, formatDateTime } from "@/components/ui";
import { db } from "@/lib/db";
import { contestState } from "@/lib/scoring";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Competitions" };

const stateWord = { LIVE: ["Live", "var(--fail)"], UPCOMING: ["Upcoming", "var(--warn)"], FINISHED: ["Finished", "var(--muted)"], DRAFT: ["Not scheduled", "var(--muted)"] } as const;
const order = { LIVE: 0, UPCOMING: 1, FINISHED: 2, DRAFT: 3 };

export default async function ContestsPage() {
  await requireUser();
  // Packs without dates are only for teachers to schedule; they are not listed here.
  const contests = await db.contest.findMany({
    where: { startsAt: { not: null }, endsAt: { not: null } },
    orderBy: { startsAt: "desc" },
    include: { _count: { select: { problems: true } } },
  });
  const sorted = contests.map((c) => ({ ...c, state: contestState(c) })).sort((a, b) => order[a.state] - order[b.state]);

  return (
    <Page>
      <PageHeader
        path={[{ label: "competitions" }]}
        title="Competitions"
        intro="Timed events with their own leaderboard. Challenges unlock when the clock starts, and only points scored before it stops count."
      />
      {sorted.length === 0 ? (
        <p className="card text-muted">No competitions have been scheduled yet.</p>
      ) : (
        <ul className="space-y-3">
          {sorted.map((contest) => (
            <li key={contest.id} className="card">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <span className="flex flex-wrap items-center gap-x-2.5">
                    <Link href={`/contests/${contest.id}`} className="font-display text-xl font-extrabold tracking-tight hover:underline">
                      {contest.title}
                    </Link>
                    <Tag color={stateWord[contest.state][1]}>{stateWord[contest.state][0]}</Tag>
                  </span>
                  <span className="text-sm text-muted">
                    {contest.state === "LIVE" && (
                      <>
                        ends in <Countdown to={contest.endsAt!.toISOString()} className="font-semibold tabular-nums text-ink" />
                      </>
                    )}
                    {contest.state === "UPCOMING" && (
                      <>
                        starts in <Countdown to={contest.startsAt!.toISOString()} className="font-semibold tabular-nums text-ink" />
                      </>
                    )}
                  </span>
                </div>
                {contest.description && <p className="mt-1">{contest.description}</p>}
                <p className="mt-1 text-sm text-muted">
                  {formatDateTime(contest.startsAt!)} to {formatDateTime(contest.endsAt!)} · {contest._count.problems} challenges
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Page>
  );
}
