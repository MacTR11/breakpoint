import Link from "next/link";
import { Countdown } from "@/components/countdown";
import { PageHeader, formatDateTime, link } from "@/components/ui";
import { db } from "@/lib/db";
import { contestState } from "@/lib/scoring";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Competitions" };

const stateWord = { LIVE: ["LIVE", "text-fail"], UPCOMING: ["SOON", "text-warn"], FINISHED: ["DONE", "text-muted"], DRAFT: ["----", "text-muted"] } as const;
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
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <PageHeader
        path={[{ label: "competitions" }]}
        title="Competitions"
        intro="Timed events with their own leaderboard. Challenges unlock when the clock starts, and only points scored before it stops count."
      />
      {sorted.length === 0 ? (
        <p className="border-y border-line py-6 text-muted">No competitions have been scheduled yet.</p>
      ) : (
        <ul className="border-y border-line divide-y divide-line">
          {sorted.map((contest) => (
            <li key={contest.id} className="flex gap-4 py-4">
              <span className={`w-10 shrink-0 pt-0.5 font-mono text-[13px] font-semibold ${stateWord[contest.state][1]}`}>{stateWord[contest.state][0]}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <Link href={`/contests/${contest.id}`} className={`text-lg font-semibold ${link}`}>
                    {contest.title}
                  </Link>
                  <span className="text-sm text-muted">
                    {contest.state === "LIVE" && (
                      <>
                        ends in <Countdown to={contest.endsAt!.toISOString()} className="font-mono text-ink" />
                      </>
                    )}
                    {contest.state === "UPCOMING" && (
                      <>
                        starts in <Countdown to={contest.startsAt!.toISOString()} className="font-mono text-ink" />
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
    </main>
  );
}
