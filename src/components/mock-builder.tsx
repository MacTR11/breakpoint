"use client";

import { useActionState, useState } from "react";
import { startMock } from "@/app/(app)/mock/actions";

type ScenarioOption = { key: string; name: string; marks: number; parts: number; solved: number };

const PRESETS = [20, 30, 45, 60, 90];
const STEP = 5;

/** A minute a mark, as in the real papers, rounded up to five. */
const minutesFor = (marks: number) => Math.max(10, Math.ceil(marks / STEP) * STEP);

/** How long the paper runs: a big number with steps either side and a few common lengths. */
function DurationPicker({ minutes, onChange }: { minutes: number; onChange: (minutes: number) => void }) {
  const set = (value: number) => onChange(Math.min(180, Math.max(STEP, value)));
  const hours = Math.floor(minutes / 60);
  return (
    <div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => set(minutes - STEP)} disabled={minutes <= STEP} className="btn btn-secondary size-10 !p-0 text-xl" aria-label={`${STEP} minutes less`}>
          −
        </button>
        <output className="figure w-40 text-center text-[2.4rem] tabular-nums" aria-live="polite">
          {hours > 0 ? `${hours} h ${minutes % 60 ? `${minutes % 60} min` : ""}` : `${minutes} min`}
        </output>
        <button type="button" onClick={() => set(minutes + STEP)} disabled={minutes >= 180} className="btn btn-secondary size-10 !p-0 text-xl" aria-label={`${STEP} minutes more`}>
          +
        </button>
      </div>
      <div className="segmented mt-3" role="group" aria-label="Common lengths">
        {PRESETS.map((preset) => (
          <button key={preset} type="button" aria-pressed={minutes === preset} onClick={() => set(preset)}>
            {preset < 60 ? `${preset} min` : preset === 60 ? "1 h" : "1 h 30"}
          </button>
        ))}
      </div>
    </div>
  );
}

export function MockBuilder({ scenarios }: { scenarios: ScenarioOption[] }) {
  const [state, action, pending] = useActionState(startMock, null);
  const [chosen, setChosen] = useState<Set<string>>(new Set());
  const [chosenMinutes, setMinutes] = useState<number | null>(null);
  const marks = scenarios.filter((s) => chosen.has(s.key)).reduce((sum, s) => sum + s.marks, 0);
  // Follows the marks until the student picks a length themselves.
  const minutes = chosenMinutes ?? minutesFor(marks);

  // About 35 marks, favouring questions the student has not solved yet.
  const pickForMe = () => {
    const fresh = [...scenarios].sort((a, b) => a.solved / a.parts - b.solved / b.parts || Math.random() - 0.5);
    const picked = new Set<string>();
    let total = 0;
    for (const s of fresh) {
      if (total >= 30) break;
      picked.add(s.key);
      total += s.marks;
    }
    setChosen(picked);
    setMinutes(null);
  };

  return (
    <form action={action} className="space-y-6">
      <fieldset>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <legend className="text-lg font-semibold">Questions</legend>
          <button type="button" onClick={pickForMe} className="text-sm font-medium text-link hover:underline">
            Pick for me
          </button>
        </div>
        <ul className="mt-2 divide-y divide-line border-y border-line">
          {scenarios.map((s) => (
            <li key={s.key}>
              <label className="flex cursor-pointer items-center gap-3 py-2.5">
                <input
                  type="checkbox"
                  name="scenario"
                  value={s.key}
                  checked={chosen.has(s.key)}
                  onChange={() =>
                    setChosen((now) => {
                      const next = new Set(now);
                      if (next.has(s.key)) next.delete(s.key);
                      else next.add(s.key);
                      return next;
                    })
                  }
                  className="size-4 accent-[var(--accent)]"
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{s.name}</span>
                  <span className="block text-[13px] text-muted">
                    {s.parts} part{s.parts === 1 ? "" : "s"}
                    {s.solved > 0 && ` · you have solved ${s.solved === s.parts ? "all of them" : `${s.solved} of them`}`}
                  </span>
                </span>
                <span className="text-sm font-semibold tabular-nums text-muted">{s.marks} marks</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <div>
        <h2 className="text-lg font-semibold">Time</h2>
        <p className="mb-3 text-sm text-muted">A minute a mark is about the pace of the real papers.</p>
        <DurationPicker minutes={minutes} onChange={setMinutes} />
        <input type="hidden" name="minutes" value={minutes} />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm font-medium text-fail">
          {state.error}
        </p>
      )}
      <button disabled={pending || chosen.size === 0} className="btn btn-primary">
        {pending ? "Starting…" : chosen.size === 0 ? "Choose some questions" : `Start: ${marks} marks in ${minutes} minutes`}
      </button>
    </form>
  );
}
