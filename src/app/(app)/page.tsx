import Link from "next/link";
import { AwardTile } from "@/components/award-tile";
import { ChallengeList } from "@/components/challenge-list";
import { Countdown } from "@/components/countdown";
import { SolveCalendar } from "@/components/solve-calendar";
import { Page, Tag, TopicTile, kindLabel, levelLabel, link, ordinal, signed, tone } from "@/components/ui";
import { HomeworkTasks } from "@/components/homework-list";
import { YourClass } from "@/components/your-class";
import { activity } from "@/lib/activity";
import { awardsFor } from "@/lib/awards";
import { classStandings } from "@/lib/classes";
import { dailyChallenge } from "@/lib/daily";
import { db } from "@/lib/db";
import { hintWallet } from "@/lib/hints";
import { current, homeworkFor } from "@/lib/homework";
import { dateToLondonInput, londonDay, londonDayStart, shiftDay } from "@/lib/london";
import { practiceFilter, standings } from "@/lib/problems";
import { leaderboard, pointsOf } from "@/lib/scoring";
import { requireUser } from "@/lib/session";
import { specialDay } from "@/lib/special-days";
import { TRACKS, trackColor, trackGlyph } from "@/lib/tracks";
import { DIFFICULTIES } from "@/lib/types";

export default async function HomePage() {
  const user = await requireUser();
  const now = new Date();

  const [problems, statusOf, points, wallet, board, history, daily, awards, liveContests, upcoming, classes, homework] = await Promise.all([
    db.problem.findMany({
      where: practiceFilter(),
      orderBy: [{ sortOrder: "asc" }],
      select: { id: true, slug: true, title: true, kind: true, style: true, difficulty: true, points: true, track: true },
    }),
    standings(user.id),
    pointsOf(user.id),
    hintWallet(user.id),
    leaderboard(),
    activity(user.id),
    dailyChallenge(user.id),
    awardsFor(user.id),
    db.contest.findMany({ where: { startsAt: { lte: now }, endsAt: { gt: now } }, orderBy: { endsAt: "asc" } }),
    db.contest.findFirst({ where: { startsAt: { gt: now } }, orderBy: { startsAt: "asc" } }),
    user.classId ? classStandings() : Promise.resolve([]),
    homeworkFor(user),
  ]);
  const dueHomework = current(homework, now);

  const rank = board.find((row) => row.userId === user.id)?.rank;
  const solvedInPractice = problems.filter((p) => statusOf(p.id) === "solved").length;
  // Secret awards appear once found.
  const shownAwards = awards.filter((a) => !a.secret || a.earned);
  const earned = shownAwards.filter((a) => a.earned).length;
  const tomorrow = londonDayStart(shiftDay(londonDay(now), 1)).toISOString();

  // Unfinished attempts first, then the easiest untouched challenge of each kind.
  const order = (d: string) => DIFFICULTIES.indexOf(d as (typeof DIFFICULTIES)[number]);
  const byLevel = [...problems].sort((a, b) => order(a.difficulty) - order(b.difficulty));
  const untouched = byLevel.filter((p) => statusOf(p.id) === "open" && p.id !== daily?.problem.id);
  const pick = (test: (p: (typeof problems)[number]) => boolean) => untouched.filter(test).slice(0, 2);
  const next = [
    ...byLevel.filter((p) => statusOf(p.id) === "failing").slice(0, 3),
    ...pick((p) => p.kind === "CODE" && p.style !== "FIX"),
    ...pick((p) => p.style === "FIX"),
    ...pick((p) => p.kind === "PUZZLE"),
  ];

  const firstName = user.name.split(" ")[0];
  const today = specialDay(londonDay(now));
  const hour = Number(dateToLondonInput(now).slice(11, 13));
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const days = (n: number) => `${n} day${n === 1 ? "" : "s"}`;
  const nudge =
    history.streak === 0
      ? "Solve one challenge today to start a streak."
      : history.solvedToday
        ? `${days(history.streak)} in a row. See you tomorrow for ${history.streak + 1}.`
        : `${days(history.streak)} in a row. Solve one today to make it ${history.streak + 1}.`;

  // Awards already won, then the three nearest to being won.
  const nearest = shownAwards
    .filter((a) => !a.earned)
    .sort((a, b) => b.progress[0] / b.progress[1] - a.progress[0] / a.progress[1])
    .slice(0, 3);
  const dailyStatus = daily ? (daily.done ? "solved" : statusOf(daily.problem.id)) : "open";
  const topics = TRACKS.map((track) => {
    const inTrack = problems.filter((p) => p.track === track.id);
    return { id: track.id, total: inTrack.length, solved: inTrack.filter((p) => statusOf(p.id) === "solved").length };
  }).filter((t) => t.total > 0);

  return (
    <Page>
      <h1 className="font-display text-4xl font-extrabold tracking-tight">
        {greeting}, {firstName}
      </h1>
      <p className="mt-1 text-muted">{nudge}</p>
      {today && <p className="rise mt-2 text-sm font-medium text-hint">{today}</p>}

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,5fr)_minmax(0,4fr)]">
        {daily ? (
          <Link href={`/problems/${daily.problem.slug}`} className="tile flex min-h-[12rem] flex-col justify-between rounded-[22px] p-[1.375rem]" style={tone(trackColor(daily.problem.track))}>
            <span className="glyph top-auto right-5 bottom-4 text-[4.5rem]" aria-hidden="true">
              {trackGlyph(daily.problem.track)}
            </span>
            <span>
              <span className="flex flex-wrap items-baseline justify-between gap-x-4 text-[13px]">
                <span className="font-semibold opacity-85">Today&apos;s challenge</span>
                <span className="opacity-85">
                  new one in <Countdown to={tomorrow} className="font-semibold tabular-nums" />
                </span>
              </span>
              <span className="mt-1 block font-display text-[1.7rem] font-extrabold leading-tight tracking-tight">{daily.problem.title}</span>
              <span className="mt-1 block text-[15px] opacity-90">
                {kindLabel(daily.problem.kind, daily.problem.style)} · {levelLabel(daily.problem.difficulty)}
              </span>
            </span>
            <span className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="btn btn-on-tile">
                {dailyStatus === "solved" ? "Solved · hint earned" : dailyStatus === "locked" ? "Locked" : dailyStatus === "failing" ? "Carry on · earn a hint" : "Start · earn a hint"}
              </span>
            </span>
          </Link>
        ) : (
          <div className="card flex min-h-[12rem] items-center text-muted">You have solved every challenge the daily pick draws from. Impressive.</div>
        )}

        <div className="card grid grid-cols-2 gap-x-4 gap-y-5">
          <div>
            <p className="cap">Points</p>
            <p className="figure text-[2.1rem]">{signed(points)}</p>
            <p className="text-[13px] text-muted">{user.role === "TEACHER" ? "teachers are not ranked" : rank ? `${ordinal(rank)} of ${board.length}` : "solve one to be ranked"}</p>
          </div>
          <div>
            <p className="cap">Solved</p>
            <p className="figure text-[2.1rem]">{solvedInPractice}</p>
            <p className="text-[13px] text-muted">of {problems.length} in practice</p>
          </div>
          <div>
            <p className="cap">Streak</p>
            <p className="figure text-[2.1rem] text-streak">{history.streak}</p>
            <p className="text-[13px] text-muted">
              {days(history.streak).replace(/^\d+ /, "")} · best {history.best}
            </p>
          </div>
          <div>
            <p className="cap">Hints</p>
            <p className="figure text-[2.1rem] text-hint">{wallet.balance}</p>
            <p className="text-[13px] text-muted">
              +1 in {wallet.untilNext} solve{wallet.untilNext === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {dueHomework.length > 0 && (
            <section className="card">
              <div className="flex items-baseline justify-between">
                <h2 className="cap">Homework</h2>
                <Link href="/homework" className={`text-sm font-medium ${link}`}>
                  All homework
                </Link>
              </div>
              <ul className="mt-2 space-y-5">
                {dueHomework.slice(0, 3).map((set) => (
                  <li key={set.id}>
                    <HomeworkTasks set={set} compact />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="card">
            <div className="flex items-baseline justify-between">
              <h2 className="cap">Try next</h2>
              <Link href="/problems" className={`text-sm font-medium ${link}`}>
                All challenges
              </Link>
            </div>
            <div className="mt-1">{next.length === 0 ? <p className="py-4 text-muted">You have worked through everything in practice.</p> : <ChallengeList problems={next} statusOf={statusOf} />}</div>
          </section>
        </div>

        <div className="flex flex-col gap-4">
          {user.classId && classes.length > 1 && <YourClass standings={classes} classId={user.classId} />}

          {(liveContests.length > 0 || upcoming) && (
            <section className="card">
              <h2 className="cap">Competitions</h2>
              <ul className="mt-2 space-y-3">
                {liveContests.map((contest) => (
                  <li key={contest.id}>
                    <Link href={`/contests/${contest.id}`} className="font-semibold hover:underline">
                      {contest.title}
                    </Link>{" "}
                    <Tag color="var(--fail)">Live</Tag>
                    <p className="text-[13px] text-muted">
                      ends in <Countdown to={contest.endsAt!.toISOString()} className="font-semibold tabular-nums text-ink" />
                    </p>
                  </li>
                ))}
                {liveContests.length === 0 && upcoming && (
                  <li>
                    <Link href={`/contests/${upcoming.id}`} className="font-semibold hover:underline">
                      {upcoming.title}
                    </Link>{" "}
                    <Tag color="var(--warn)">Upcoming</Tag>
                    <p className="text-[13px] text-muted">
                      starts in <Countdown to={upcoming.startsAt!.toISOString()} className="font-semibold tabular-nums text-ink" />
                    </p>
                  </li>
                )}
              </ul>
            </section>
          )}

          <section className="card">
            <h2 className="cap">Your last {history.grid.length} weeks</h2>
            <div className="mt-3 overflow-x-auto">
              <SolveCalendar grid={history.grid} />
            </div>
            <p className="mt-2.5 text-[13px] text-muted">
              {history.inGrid} solved · best streak {days(history.best)}
            </p>
          </section>

          <section className="card">
            <div className="flex items-baseline justify-between">
              <h2 className="cap">Awards</h2>
              <Link href="/awards" className={`text-sm font-medium ${link}`}>
                {earned} of {shownAwards.length} earned
              </Link>
            </div>
            <ul className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-2">
              {[...shownAwards.filter((a) => a.earned), ...nearest].slice(0, 6).map((award) => (
                <li key={award.id} className="grid">
                  <AwardTile award={award} compact />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <section className="mt-9">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-extrabold tracking-tight">Topics</h2>
          <Link href="/syllabus" className={`text-sm font-medium ${link}`}>
            Course map
          </Link>
        </div>
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {topics.map((t) => (
            <li key={t.id} className="grid">
              <TopicTile track={t.id} solved={t.solved} total={t.total} href={`/syllabus#${t.id}`} />
            </li>
          ))}
        </ul>
      </section>
    </Page>
  );
}
