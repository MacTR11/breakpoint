import Link from "next/link";
import { Countdown } from "@/components/countdown";
import { link, signed, tone } from "@/components/ui";
import type { Race } from "@/lib/race";

const tinted = (color: string) => `color-mix(in oklab, ${color} var(--topic-keep), var(--topic-mix))`;

/** This week's race between the classes, on the Home page. */
export function WeeklyRace({ race, classId }: { race: Race; classId: string | null }) {
  const { standings, endsAt, lastWinners } = race;
  if (standings.length < 2) return null;
  const top = Math.max(...standings.map((c) => c.averagePoints), 1);
  const leader = standings[0];
  const tied = standings.filter((c) => c.averagePoints === leader.averagePoints).length > 1;
  const mine = standings.find((c) => c.id === classId);

  let headline: string;
  if (leader.averagePoints <= 0) headline = "Nobody has scored yet this week. The first solve puts your class in front.";
  else if (tied) headline = "It's level at the top.";
  else if (mine?.id === leader.id) headline = `${leader.name} is in front. Keep it that way.`;
  else headline = `${leader.name} is in front${mine ? `. ${mine.name} is ${signed(Math.round((leader.averagePoints - mine.averagePoints) * 10) / 10)} points each behind` : ""}.`;

  return (
    <section className="card mt-6" aria-label="This week's class race">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h2 className="cap">Class race this week</h2>
        <span className="text-[13px] text-muted">
          ends in <Countdown to={endsAt.toISOString()} className="font-semibold tabular-nums text-ink" />
        </span>
      </div>
      <p className="mt-1 font-semibold">{headline}</p>
      <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
        {standings.map((c) => (
          <li key={c.id} className={`grid grid-cols-[3.25rem_1fr_3.75rem] items-center gap-3 text-sm ${c.id === classId ? "font-semibold" : "text-ink-soft"}`}>
            <span style={{ color: tinted(c.color) }}>{c.name}</span>
            <span className="meter" style={tone(c.color)} aria-hidden="true">
              <span style={{ width: `${Math.max(0, (c.averagePoints / top) * 100)}%` }} />
            </span>
            <span className="text-right tabular-nums" aria-label={`${c.name}: ${c.averagePoints} points each`}>
              {signed(c.averagePoints)}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 text-[13px] text-muted">
        <span>
          Points per student since Monday.{" "}
          {lastWinners.length > 0 && (
            <>
              Last week:{" "}
              {lastWinners.map((c, i) => (
                <span key={c.id}>
                  {i > 0 && " and "}
                  <span className="font-semibold" style={{ color: tinted(c.color) }}>
                    {c.name}
                  </span>
                </span>
              ))}{" "}
              {lastWinners.length > 1 ? "shared it" : "won"}.
            </>
          )}
        </span>
        <Link href="/leaderboard?view=classes&period=week" className={`font-medium ${link}`}>
          Full table
        </Link>
      </p>
    </section>
  );
}
