import type { ActivityDay } from "@/lib/activity";

// Set per theme in globals.css.
const shades = ["var(--cal-0)", "var(--cal-1)", "var(--cal-2)", "var(--cal-3)"];
const level = (count: number) => (count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : 3);
const label = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

/** One square per day, a column per week: darker means more solved that day. */
export function SolveCalendar({ grid }: { grid: ActivityDay[][] }) {
  return (
    <div className="flex gap-[3px]" role="img" aria-label="Challenges solved each day over the last few weeks">
      {grid.map((week) => (
        <div key={week[0].day} className="flex flex-col gap-[3px]">
          {week.map((d) => (
            <span
              key={d.day}
              title={d.future ? undefined : `${d.count} solved on ${label.format(new Date(`${d.day}T12:00:00Z`))}`}
              className="h-[11px] w-[11px] rounded-[2px]"
              style={{ background: d.future ? "transparent" : shades[level(d.count)] }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
