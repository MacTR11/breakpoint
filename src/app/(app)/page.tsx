import Link from "next/link";
import { ChallengeList } from "@/components/challenge-list";
import { Countdown } from "@/components/countdown";
import { AsciiBar, link, signed } from "@/components/ui";
import { db } from "@/lib/db";
import { hintWallet } from "@/lib/hints";
import { practiceFilter, standings } from "@/lib/problems";
import { leaderboard, pointsOf } from "@/lib/scoring";
import { requireUser } from "@/lib/session";
import { TRACKS } from "@/lib/tracks";
import { DIFFICULTIES } from "@/lib/types";

export default async function HomePage() {
  const user = await requireUser();
  const now = new Date();

  const [problems, statusOf, points, wallet, board, liveContests, upcoming] = await Promise.all([
    db.problem.findMany({
      where: practiceFilter(),
      orderBy: [{ sortOrder: "asc" }],
      select: { id: true, slug: true, title: true, kind: true, style: true, difficulty: true, points: true, track: true },
    }),
    standings(user.id),
    pointsOf(user.id),
    hintWallet(user.id),
    leaderboard(),
    db.contest.findMany({ where: { startsAt: { lte: now }, endsAt: { gt: now } }, orderBy: { endsAt: "asc" } }),
    db.contest.findFirst({ where: { startsAt: { gt: now } }, orderBy: { startsAt: "asc" } }),
  ]);

  const rank = board.find((row) => row.userId === user.id)?.rank;
  const solvedInPractice = problems.filter((p) => statusOf(p.id) === "solved").length;

  // Unfinished attempts first, then the easiest untouched challenge of each kind.
  const order = (d: string) => DIFFICULTIES.indexOf(d as (typeof DIFFICULTIES)[number]);
  const byLevel = [...problems].sort((a, b) => order(a.difficulty) - order(b.difficulty));
  const untouched = byLevel.filter((p) => statusOf(p.id) === "open");
  const pick = (test: (p: (typeof problems)[number]) => boolean) => untouched.filter(test).slice(0, 2);
  const next = [
    ...byLevel.filter((p) => statusOf(p.id) === "failing").slice(0, 3),
    ...pick((p) => p.kind === "CODE" && p.style !== "FIX"),
    ...pick((p) => p.style === "FIX"),
    ...pick((p) => p.kind === "PUZZLE"),
  ];

  const summary: [string, string][] = [
    ["points", signed(points)],
    ["solved", `${solvedInPractice} of ${problems.length}`],
    ["rank", user.role === "TEACHER" ? "teachers are not ranked" : rank ? `${rank} of ${board.length}` : "solve one challenge to be ranked"],
    ["hints", `${wallet.balance} to spend, next after ${wallet.untilNext} more solve${wallet.untilNext === 1 ? "" : "s"}`],
  ];

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Hello, {user.name.split(" ")[0]}.</h1>

      <dl className="mt-5 font-mono text-sm leading-7">
        {summary.map(([label, value]) => (
          <div key={label} className="flex gap-4">
            <dt className="w-16 text-muted">{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      {(liveContests.length > 0 || upcoming) && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold">Competitions</h2>
          <ul className="mt-3 border-y border-line divide-y divide-line">
            {liveContests.map((contest) => (
              <li key={contest.id} className="flex flex-wrap items-baseline gap-x-4 py-2.5">
                <span className="w-10 font-mono text-[13px] font-semibold text-fail">LIVE</span>
                <Link href={`/contests/${contest.id}`} className={link}>
                  {contest.title}
                </Link>
                <span className="ml-auto text-sm text-muted">
                  ends in <Countdown to={contest.endsAt!.toISOString()} className="font-mono text-ink" />
                </span>
              </li>
            ))}
            {liveContests.length === 0 && upcoming && (
              <li className="flex flex-wrap items-baseline gap-x-4 py-2.5">
                <span className="w-10 font-mono text-[13px] font-semibold text-muted">SOON</span>
                <Link href={`/contests/${upcoming.id}`} className={link}>
                  {upcoming.title}
                </Link>
                <span className="ml-auto text-sm text-muted">
                  starts in <Countdown to={upcoming.startsAt!.toISOString()} className="font-mono text-ink" />
                </span>
              </li>
            )}
          </ul>
        </section>
      )}

      <div className="mt-10 grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">Try next</h2>
            <Link href="/problems" className={`text-sm ${link}`}>
              All challenges
            </Link>
          </div>
          <div className="mt-3">
            {next.length === 0 ? <p className="text-muted">You have worked through everything in practice.</p> : <ChallengeList problems={next} statusOf={statusOf} showTrack={false} />}
          </div>
        </section>

        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">Progress</h2>
            <Link href="/syllabus" className={`text-sm ${link}`}>
              Course map
            </Link>
          </div>
          <ul className="mt-3 border-y border-line divide-y divide-line">
            {TRACKS.map((track) => {
              const inTrack = problems.filter((p) => p.track === track.id);
              if (inTrack.length === 0) return null;
              return (
                <li key={track.id} className="flex items-baseline justify-between gap-4 py-2">
                  <Link href={`/syllabus#${track.id}`} className={`truncate ${link}`}>
                    {track.title}
                  </Link>
                  <AsciiBar value={inTrack.filter((p) => statusOf(p.id) === "solved").length} total={inTrack.length} width={10} />
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </main>
  );
}
