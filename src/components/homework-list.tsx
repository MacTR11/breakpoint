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

/**
 * Why a challenge cannot be opened, or does not count, in a few words; null when
 * neither. Students are not told when it is because of a competition: which
 * challenges a competition holds stays hidden until it starts.
 */
function challengeNote(p: StudentHomework["problems"][number], solved: boolean) {
  if (!p.open) return solved || p.counts ? "Not available at the moment." : "Not available at the moment, so it does not count towards this homework.";
  return solved || p.counts ? null : "It could not be opened before the due date, so it does not count towards this homework.";
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
          const why = challengeNote(p, solved);
          const check = (
            <span
              className="task-check"
              data-done={solved ? "" : undefined}
              data-held={!solved && !p.open ? "" : undefined}
              aria-label={solved ? "Solved" : p.open ? "Not solved yet" : "Cannot be opened now"}
              role="img"
            />
          );
          const title = <span className={`block text-[15px] ${solved ? "text-muted line-through decoration-1" : p.open ? "font-medium" : "text-muted"}`}>{p.title}</span>;
          const points = <span className="shrink-0 text-sm font-semibold tabular-nums text-muted">{p.points}</span>;
          // Students cannot open it now (held for a competition, or unpublished), so it is not a link.
          if (!p.open) {
            return (
              <li key={p.id} className="-mx-2 flex items-center gap-3 px-2 py-1.5">
                {check}
                <span className="min-w-0 flex-1">
                  {title}
                  <span className="block text-[13px] text-muted">{why}</span>
                </span>
                {points}
              </li>
            );
          }
          return (
            <li key={p.id}>
              <Link href={`/problems/${p.slug}`} className="-mx-2 flex items-center gap-3 rounded-[12px] px-2 py-1.5 transition-colors duration-150 hover:bg-paper">
                {check}
                <span className="min-w-0 flex-1">
                  {title}
                  {(why || !compact) && (
                    <span className="block text-[13px] text-muted">
                      {why ?? (
                        <>
                          {kindLabel(p.kind, p.style)} · {levelLabel(p.difficulty)}
                        </>
                      )}
                    </span>
                  )}
                </span>
                {points}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
