import { Tag, signed, tone } from "@/components/ui";
import { YEAR_LABEL, type ClassStanding } from "@/lib/classes";

/** Classes ranked on points per student, each with a bar in its own colour against the leader. */
export function ClassBoard({ rows, mine }: { rows: ClassStanding[]; mine?: string | null }) {
  if (rows.length === 0) return <p className="py-4 text-muted">There are no classes yet.</p>;
  const top = Math.max(...rows.map((r) => r.averagePoints), 1);
  return (
    <ol className="divide-y divide-line">
      {rows.map((row) => (
        <li key={row.id} className={`flex items-center gap-4 py-3.5 ${row.id === mine ? "font-semibold" : ""}`}>
          <span className="w-6 font-display text-xl font-extrabold tabular-nums">{row.rank}</span>
          <span className="icon !w-12 !text-sm" style={tone(row.color)} aria-hidden="true">
            {row.name.slice(0, 4)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-semibold">{row.name}</span>
              <span className="text-sm font-normal text-muted">{YEAR_LABEL[row.year]}</span>
              {row.id === mine && <Tag color="var(--accent)">Your class</Tag>}
            </span>
            <span className="meter mt-1.5 block" style={tone(row.color)} aria-hidden="true">
              <span style={{ width: `${Math.max(0, (row.averagePoints / top) * 100)}%` }} />
            </span>
            <span className="mt-1 block text-[13px] font-normal text-muted">
              {row.averageSolved} solved each · {row.active} of {row.students} scored
            </span>
          </span>
          <span className="w-28 shrink-0 text-right">
            <span className="figure block text-2xl">{signed(row.averagePoints)}</span>
            <span className="text-[13px] font-normal text-muted">points each</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
