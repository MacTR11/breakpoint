import Link from "next/link";
import { Tag, kindLabel, levelLabel } from "@/components/ui";
import { homeworkStateLabel, type StudentHomework } from "@/lib/homework";
import { londonDay } from "@/lib/london";

const dueFormat = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });

/** "Fri 9 Oct, 08:30 · in 3 days", or "2 days overdue". */
export function dueLabel(dueAt: Date, now = new Date()) {
  const days = Math.round((Date.parse(londonDay(dueAt)) - Date.parse(londonDay(now))) / 86_400_000);
  const when = days === 0 ? "today" : days === 1 ? "tomorrow" : days > 1 ? `in ${days} days` : days === -1 ? "yesterday" : `${-days} days ago`;
  return `${dueFormat.format(dueAt)} · ${when}`;
}

/** One piece of homework as a task list: a circle per challenge, ticked once solved. */
export function HomeworkTasks({ set, compact = false }: { set: StudentHomework; compact?: boolean }) {
  const [word, color] = homeworkStateLabel[set.state];
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <p className="font-semibold">{set.title}</p>
        <Tag color={color}>{word}</Tag>
      </div>
      <p className="text-[13px] text-muted">
        Due {dueLabel(set.dueAt)} · {set.done} of {set.problems.length} done
      </p>
      {set.note && !compact && <p className="mt-1.5 max-w-2xl text-sm whitespace-pre-line text-ink-soft">{set.note}</p>}
      <ul className="mt-2">
        {set.problems.map((p) => {
          const solved = set.solvedIds.includes(p.id);
          // Put into a competition since it was set: students cannot open it until the competition starts.
          if (!p.open && !solved) {
            return (
              <li key={p.id} className="-mx-2 flex items-center gap-3 px-2 py-1.5">
                <span className="task-check" data-held="" aria-label="Not open yet" role="img" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] text-muted">{p.title}</span>
                  <span className="block text-[13px] text-muted">Held for a competition, so not open yet. It does not count until it is.</span>
                </span>
                <span className="shrink-0 text-sm font-semibold tabular-nums text-muted">{p.points}</span>
              </li>
            );
          }
          return (
            <li key={p.id}>
              <Link href={`/problems/${p.slug}`} className="-mx-2 flex items-center gap-3 rounded-[12px] px-2 py-1.5 transition-colors duration-150 hover:bg-paper">
                <span className="task-check" data-done={solved ? "" : undefined} aria-label={solved ? "Solved" : "Not solved yet"} role="img" />
                <span className="min-w-0 flex-1">
                  <span className={`block text-[15px] ${solved ? "text-muted line-through decoration-1" : "font-medium"}`}>{p.title}</span>
                  {!compact && (
                    <span className="block text-[13px] text-muted">
                      {kindLabel(p.kind, p.style)} · {levelLabel(p.difficulty)}
                    </span>
                  )}
                </span>
                <span className="shrink-0 text-sm font-semibold tabular-nums text-muted">{p.points}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
