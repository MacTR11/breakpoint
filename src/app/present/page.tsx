import Link from "next/link";
import { Wordmark } from "@/components/brand";
import { AutoRefresh, Countdown } from "@/components/countdown";
import { FullscreenButton } from "@/components/fullscreen-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { signed, tone } from "@/components/ui";
import { YEAR_LABEL, classStandings } from "@/lib/classes";
import { db } from "@/lib/db";
import { daysAgo, leaderboard, type LeaderboardRow } from "@/lib/scoring";
import { requireTeacher } from "@/lib/session";

export const metadata = { title: "Projector" };

/** "Ada Lovelace" becomes "Ada L.": enough to cheer, less to put on a wall. */
const shortName = (name: string) => {
  const words = name.trim().split(/\s+/);
  return words.length > 1 ? `${words[0]} ${words[words.length - 1][0]}.` : words[0];
};

/**
 * For the classroom screen: classes against each other, this week's top
 * students and any live competition, in big type, refreshing itself.
 */
export default async function PresentPage({ searchParams }: PageProps<"/present">) {
  await requireTeacher();
  const { period } = await searchParams;
  const allTime = period === "all";
  const now = new Date();
  const contest = await db.contest.findFirst({ where: { startsAt: { lte: now }, endsAt: { gt: now } }, orderBy: { endsAt: "asc" }, include: { problems: { select: { problemId: true } } } });
  const scope = allTime ? {} : { from: daysAgo(7) };
  const [classes, students, race] = await Promise.all([
    classStandings(scope),
    leaderboard(scope),
    contest ? leaderboard({ problemIds: contest.problems.map((p) => p.problemId), from: contest.startsAt!, to: contest.endsAt!, tieBreakByTime: true }) : Promise.resolve(null),
  ]);
  const top = Math.max(...classes.map((c) => c.averagePoints), 1);

  return (
    <main className="flex min-h-screen flex-col gap-6 p-6 lg:p-10">
      <AutoRefresh seconds={20} />
      <header className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Wordmark className="text-3xl" />
        <span className="text-xl text-muted">{allTime ? "All time" : "This week"}</span>
        <span className="ml-auto flex items-center gap-4 text-sm text-muted print:hidden">
          <Link href={allTime ? "/present" : "/present?period=all"} className="hover:text-ink">
            {allTime ? "Show this week" : "Show all time"}
          </Link>
          <ThemeToggle />
          <FullscreenButton />
          <Link href="/teacher/classes" className="hover:text-ink">
            Close
          </Link>
        </span>
      </header>

      {classes.length > 0 && (
        <section aria-label="Classes" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {classes.map((c) => (
            <div key={c.id} className="tile flex min-h-[12rem] flex-col justify-between rounded-[26px] p-6" style={tone(c.color)}>
              <span className="glyph text-[3.5rem]" aria-hidden="true">
                #{c.rank}
              </span>
              <span>
                <span className="block font-display text-5xl font-extrabold leading-none">{c.name}</span>
                <span className="text-lg opacity-90">{YEAR_LABEL[c.year]}</span>
              </span>
              <span>
                <span className="figure text-[3.25rem]">{signed(c.averagePoints)}</span> <span className="text-lg opacity-90">points each</span>
                <span className="meter mt-2 block !h-2.5" aria-hidden="true">
                  <span style={{ width: `${Math.max(0, (c.averagePoints / top) * 100)}%` }} />
                </span>
              </span>
            </div>
          ))}
        </section>
      )}

      <div className={`grid flex-1 grid-cols-1 gap-6 ${race ? "xl:grid-cols-2" : ""}`}>
        {race && contest && (
          <Board title={contest.title} rows={race.slice(0, 10)} empty="Nobody has scored yet. The first solve takes the top spot.">
            <p className="text-2xl text-muted">
              ends in <Countdown to={contest.endsAt!.toISOString()} className="font-display font-extrabold tabular-nums text-ink" />
            </p>
          </Board>
        )}
        <Board title={allTime ? "Top students" : "Top students this week"} rows={students.slice(0, 10)} empty="Nobody has solved anything yet." wide={!race} />
      </div>
    </main>
  );
}

/** A top ten in big type: two columns of five on a wide screen when it has the room. */
function Board({ title, rows, empty, wide = false, children }: { title: string; rows: LeaderboardRow[]; empty: string; wide?: boolean; children?: React.ReactNode }) {
  return (
    <section className="card !p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="font-display text-4xl font-extrabold tracking-tight">{title}</h1>
        {children}
      </div>
      {rows.length === 0 ? (
        <p className="mt-6 text-2xl text-muted">{empty}</p>
      ) : (
        <ol className={`mt-6 grid gap-x-12 gap-y-1 ${wide ? "lg:grid-flow-col lg:grid-rows-5" : ""}`}>
          {rows.map((row) => (
            <li key={row.userId} className="flex items-baseline gap-5 border-b border-line py-3 text-2xl lg:text-3xl">
              <span className="w-10 font-display font-extrabold tabular-nums text-muted">{row.rank}</span>
              <span className="min-w-0 flex-1 truncate font-semibold">{shortName(row.name)}</span>
              {row.className && <span className="text-xl text-muted">{row.className}</span>}
              <span className="w-24 text-right font-display font-extrabold tabular-nums">{signed(row.points)}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
