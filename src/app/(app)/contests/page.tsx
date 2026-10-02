import Link from "next/link";
import { Countdown } from "@/components/countdown";
import { Card, PageHeader, formatDateTime } from "@/components/ui";
import { db } from "@/lib/db";
import { contestState, contestStateLabel } from "@/lib/scoring";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Competitions" };

const stateStyle = {
  LIVE: "bg-[#ff375f] text-white",
  UPCOMING: "bg-[#0a84ff]/16 text-[#0a4fa8]",
  FINISHED: "bg-black/8 text-ink-soft",
  DRAFT: "bg-black/8 text-ink-soft",
};
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
    <main className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-12">
      <PageHeader title="Competitions" intro="Timed events with their own leaderboard. Problems unlock when the clock starts, and only points scored before it stops count." />
      {sorted.length === 0 ? (
        <Card className="p-10 text-center text-muted">No competitions have been scheduled yet.</Card>
      ) : (
        <ul className="space-y-4">
          {sorted.map((contest) => (
            <li key={contest.id}>
              <Link href={`/contests/${contest.id}`} className="glass block rounded-[2rem] p-7">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`badge ${stateStyle[contest.state]}`}>{contestStateLabel[contest.state]}</span>
                  <span className="ml-auto text-sm text-muted">
                    {contest.state === "LIVE" && (
                      <>
                        Ends in <Countdown to={contest.endsAt!.toISOString()} className="font-mono font-medium text-ink" />
                      </>
                    )}
                    {contest.state === "UPCOMING" && (
                      <>
                        Starts in <Countdown to={contest.startsAt!.toISOString()} className="font-mono font-medium text-ink" />
                      </>
                    )}
                  </span>
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">{contest.title}</h2>
                {contest.description && <p className="mt-2 text-muted">{contest.description}</p>}
                <p className="mt-4 text-sm text-muted">
                  {formatDateTime(contest.startsAt!)} to {formatDateTime(contest.endsAt!)} · {contest._count.problems} problems
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
