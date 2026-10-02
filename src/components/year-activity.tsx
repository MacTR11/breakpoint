import type { ActivityDay } from "@/lib/activity";

// Set per theme in globals.css, as on the Home page's calendar.
const shades = ["var(--cal-0)", "var(--cal-1)", "var(--cal-2)", "var(--cal-3)"];
const level = (count: number) => (count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : 3);
const dayLabel = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
const monthLabel = new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" });
const at = (day: string) => new Date(`${day}T12:00:00Z`);

/**
 * A year of solving, a square a day and a column a week, with the months
 * along the top (after Rare UI's GitHub activity). Scrolled to today on a
 * narrow screen.
 */
export function YearActivity({ grid }: { grid: ActivityDay[][] }) {
  // A month is named over the first week that starts in it, if there is room since the last name.
  let last = -Infinity;
  const months = grid.map((week, i) => {
    const starts = i > 0 && at(week[0].day).getUTCMonth() !== at(grid[i - 1][0].day).getUTCMonth();
    if (!starts || i - last < 3) return "";
    last = i;
    return monthLabel.format(at(week[0].day));
  });
  return (
    <div>
      {/* Right to left outside, left to right inside: starts scrolled to the latest week. */}
      <div dir="rtl" className="overflow-x-auto pb-1 [scrollbar-width:thin]">
        <div dir="ltr" className="grid min-w-[44rem] gap-[3px]" style={{ gridTemplateColumns: `1.75rem repeat(${grid.length}, minmax(0, 1fr))` }} role="img" aria-label="Challenges solved each day over the last year">
          <span />
          {months.map((label, i) => (
            <span key={grid[i][0].day} className="h-4 overflow-visible text-[11px] leading-none whitespace-nowrap text-muted">
              {label}
            </span>
          ))}
          {[0, 1, 2, 3, 4, 5, 6].map((weekday) => (
            <Row key={weekday} weekday={weekday} grid={grid} />
          ))}
        </div>
      </div>
      <p className="mt-2 flex items-center justify-end gap-1.5 text-[11px] text-muted">
        Less
        {shades.map((shade) => (
          <span key={shade} className="size-[11px] rounded-[2px]" style={{ background: shade }} />
        ))}
        More
      </p>
    </div>
  );
}

function Row({ weekday, grid }: { weekday: number; grid: ActivityDay[][] }) {
  return (
    <>
      <span className="self-center pr-1 text-[11px] leading-none text-muted">{weekday % 2 === 0 ? ["Mon", "", "Wed", "", "Fri", "", "Sun"][weekday] : ""}</span>
      {grid.map((week) => {
        const d = week[weekday];
        return (
          <span
            key={d.day}
            title={d.future ? undefined : `${d.count} solved on ${dayLabel.format(at(d.day))}`}
            className="aspect-square rounded-[3px]"
            style={{ background: d.future ? "transparent" : shades[level(d.count)] }}
          />
        );
      })}
    </>
  );
}
