import Link from "next/link";
import { link, ordinal, signed, tone } from "@/components/ui";
import type { ClassStanding } from "@/lib/classes";
import { POINTS } from "@/lib/points";

/** Where the student's class stands against the others, and what it would take to climb. */
export function YourClass({ standings, classId }: { standings: ClassStanding[]; classId: string }) {
  const index = standings.findIndex((c) => c.id === classId);
  const mine = standings[index];
  if (!mine) return null;
  const above = standings.slice(0, index).findLast((c) => c.averagePoints > mine.averagePoints);
  const below = standings.slice(index + 1).find((c) => c.averagePoints < mine.averagePoints);
  const top = Math.max(...standings.map((c) => c.averagePoints), 1);

  let message: string;
  if (above) {
    // Points the whole class needs, in medium write-code challenges.
    const gap = above.averagePoints - mine.averagePoints;
    const solves = Math.max(1, Math.ceil((gap * Math.max(mine.students, 1)) / POINTS.write.MEDIUM));
    message = `${signed(Math.round(gap * 10) / 10)} points each behind ${above.name}. About ${solves} medium challenge${solves === 1 ? "" : "s"} across the class would catch them.`;
  } else if (below) {
    message = `Top of the table, ${signed(Math.round((mine.averagePoints - below.averagePoints) * 10) / 10)} points each ahead of ${below.name}.`;
  } else {
    message = "Every solve you make lifts your class's average.";
  }

  return (
    <section className="card">
      <div className="flex items-baseline justify-between">
        <h2 className="cap">Your class</h2>
        <Link href="/leaderboard?view=classes" className={`text-sm font-medium ${link}`}>
          All classes
        </Link>
      </div>
      <p className="mt-1.5 flex items-baseline gap-2">
        <span className="font-display text-[1.7rem] font-extrabold tracking-tight" style={{ color: `color-mix(in oklab, ${mine.color} var(--topic-keep), var(--topic-mix))` }}>
          {mine.name}
        </span>
        <span className="text-muted">
          {ordinal(mine.rank)} of {standings.length}
        </span>
      </p>
      <p className="text-[13px] text-muted">{message}</p>
      <ul className="mt-3 space-y-2">
        {standings.map((c) => (
          <li key={c.id} className={`grid grid-cols-[2.5rem_1fr_3.75rem] items-center gap-3 text-sm ${c.id === classId ? "font-semibold" : "text-ink-soft"}`}>
            <span>{c.name}</span>
            <span className="meter" style={tone(c.color)} aria-hidden="true">
              <span style={{ width: `${Math.max(0, (c.averagePoints / top) * 100)}%` }} />
            </span>
            <span className="text-right tabular-nums">{signed(c.averagePoints)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
