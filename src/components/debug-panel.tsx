"use client";

import { useEffect, useMemo, useState } from "react";
import { traceInBrowser } from "@/lib/py-runner";
import { callsIn, changed, describe, nextBreakpoint, stepOut, stepOver, traceTable, type TraceResult, type TraceStep } from "@/lib/trace";

// Step through a call to the student's own code, forwards and backwards, in the
// editor's dark colours. The whole run is recorded first (public/judge/tracer.mjs),
// so going back is as quick as going forward. Nothing here is marked.

type Run = { result: TraceResult; code: string; source: string };

const muted = "text-[#9198a1]";
const small = "rounded-full bg-white/10 px-3 py-1 text-[13px] font-semibold text-[#f6f8fa] enabled:cursor-pointer enabled:hover:bg-white/20 disabled:opacity-40";

/** Call depth over the whole run, which doubles as a scrubber: recursion shows up as mountains. */
function Timeline({ steps, index, breakpoints, label, onChange }: { steps: TraceStep[]; index: number; breakpoints: number[]; label: string; onChange: (index: number) => void }) {
  const deepest = Math.max(1, ...steps.map((s) => s.depth));
  const height = (depth: number) => (deepest === 1 ? 60 : 30 + (70 * (depth - 1)) / (deepest - 1));
  const width = Math.max(1, steps.length - 1);
  return (
    <div className="timeline">
      <svg viewBox={`0 0 ${width} 100`} preserveAspectRatio="none" aria-hidden="true">
        {steps.map((step, i) => (
          <rect
            key={i}
            x={i - 0.5}
            width={1}
            y={100 - height(step.depth)}
            height={height(step.depth)}
            fill={step.event === "line" && breakpoints.includes(step.line) ? "#ff3b30" : i <= index ? "#5c6370" : "#3a3f4a"}
          />
        ))}
      </svg>
      <input type="range" min={0} max={steps.length - 1} value={index} onChange={(event) => onChange(Number(event.target.value))} aria-label="Step" aria-valuetext={label} />
    </div>
  );
}

/** The calls waiting on each other, the one running now at the top. */
function CallStack({ step, calls, source, selected, onSelect }: { step: TraceStep; calls: Map<number, string>; source: string; selected: number; onSelect: (id: number) => void }) {
  return (
    <div>
      <p className={`mb-1.5 ${muted}`}>Call stack</p>
      <ol className="space-y-1">
        {step.stack.map((frame, i) => (
          <li key={frame.id}>
            <button
              type="button"
              onClick={() => onSelect(frame.id)}
              aria-pressed={frame.id === selected}
              className={`flex w-full cursor-pointer items-baseline gap-2 rounded-[10px] px-3 py-1.5 text-left ${frame.id === selected ? "bg-[#3a3f4a] text-white" : "bg-white/5 text-[#c9d1d9] hover:bg-white/10"}`}
            >
              <span className="min-w-0 flex-1 truncate">{calls.get(frame.id) ?? frame.fn}</span>
              <span className={`shrink-0 text-xs ${i === 0 ? "text-[#e5a50a]" : muted}`}>{i === 0 ? `line ${frame.line}` : `waiting at line ${frame.line}`}</span>
            </button>
          </li>
        ))}
        {step.hidden > 0 && <li className={`px-3 text-xs ${muted}`}>and {step.hidden} more calls further down</li>}
        <li className={`truncate px-3 text-xs ${muted}`}>called from: {source.replace(/\n/g, "; ")}</li>
      </ol>
    </div>
  );
}

function Variables({ locals, fresh }: { locals: [string, string][]; fresh: Set<string> }) {
  if (locals.length === 0) return <p className={muted}>No variables yet.</p>;
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
      {locals.map(([name, value]) => (
        <div key={name} className="contents">
          <dt className="text-[#d2a8ff]">{name}</dt>
          <dd className={`min-w-0 break-all ${fresh.has(name) ? "rounded-[6px] bg-[#e5a50a]/20 px-1.5 text-[#ffd479]" : "px-1.5"}`}>
            {value}
            {fresh.has(name) && <span className="sr-only"> (changed)</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** A trace table as one is written by hand, filling in as the run goes on. */
function TraceTable({ steps, stdout, frameId, index, title }: { steps: TraceStep[]; stdout: string; frameId: number; index: number; title: string }) {
  const { columns, rows } = useMemo(() => traceTable(steps, stdout, frameId, index), [steps, stdout, frameId, index]);
  const printed = rows.some((row) => row.printed || row.error);
  if (rows.length === 0) return null;
  return (
    <div className="mt-4">
      <p className={`mb-1.5 truncate ${muted}`}>Trace table for {title}</p>
      <div className="overflow-x-auto">
        <table className="trace-table">
          <thead>
            <tr>
              <th>Line</th>
              {columns.map((name) => (
                <th key={name}>{name}</th>
              ))}
              {printed && <th>Printed</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.step} data-latest={i === rows.length - 1 || undefined}>
                <td className={muted}>{row.line}</td>
                {columns.map((name) => (
                  <td key={name}>{row.values.get(name) ?? ""}</td>
                ))}
                {printed && (
                  <td className="whitespace-pre">
                    {row.printed.replace(/\n$/, "")}
                    {row.error && <span className="text-[#ff7b72]">{row.error}</span>}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function DebugPanel({
  code,
  examples,
  breakpoints,
  active,
  disabled,
  onBusy,
  onLine,
}: {
  code: string;
  /** The calls from the question's visible examples. */
  examples: string[];
  breakpoints: number[];
  /** This tab is the one showing. */
  active: boolean;
  disabled: boolean;
  onBusy: (busy: boolean) => void;
  /** Mark a line in the editor, or none. */
  onLine: (line: number | null) => void;
}) {
  const [source, setSource] = useState(examples[0] ?? "");
  const [run, setRun] = useState<Run | null>(null);
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [starting, setStarting] = useState(false);

  const steps = useMemo(() => run?.result.steps ?? [], [run]);
  const calls = useMemo(() => callsIn(steps), [steps]);
  const step = steps[index];
  const stale = run !== null && run.code !== code;
  const frame = step ? (step.stack.find((f) => f.id === chosen) ?? step.stack[0]) : undefined;
  const last = steps.length - 1;

  useEffect(() => {
    onLine(active && step && !stale ? step.line : null);
  }, [active, step, stale, onLine]);

  const start = async () => {
    if (!source.trim()) return;
    setStarting(true);
    onBusy(true);
    const result = await traceInBrowser(code, source);
    setRun({ result, code, source });
    setChosen(null);
    // Like a real debugger, run straight to the first breakpoint if there is one.
    setIndex(breakpoints.length > 0 ? Math.max(0, nextBreakpoint(result.steps, -1, breakpoints)) : 0);
    setStarting(false);
    onBusy(false);
  };

  const go = (to: number) => {
    setIndex(Math.max(0, Math.min(last, to)));
    setChosen(null);
  };

  const words = step ? `${describe(step, calls)}${step.event === "line" ? "" : ` (line ${step.line})`}` : "";
  const reachedBreakpoint = step?.event === "line" && breakpoints.includes(step.line);

  return (
    <div className="space-y-3">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          start();
        }}
        className="space-y-2"
      >
        <label htmlFor="debug-call" className={`block ${muted}`}>
          Call to step through
        </label>
        <div className="flex items-start gap-2">
          <textarea
            id="debug-call"
            value={source}
            onChange={(event) => setSource(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                if (!disabled) start();
              }
            }}
            rows={Math.min(5, source.split("\n").length)}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            className="min-w-0 flex-1 resize-none rounded-[10px] border border-white/10 bg-[#1c1f24] px-3 py-1.5 text-[#f6f8fa] outline-none focus:border-[#58a6ff]"
          />
          <button disabled={disabled || !source.trim()} className={`${small} shrink-0 !px-4 !py-1.5`}>
            {starting ? "Starting…" : run ? "Start again" : "Start"}
          </button>
        </div>
        {examples.length > 1 && (
          <p className="flex flex-wrap gap-1.5">
            {examples.map((example, i) => (
              <button key={i} type="button" onClick={() => setSource(example)} aria-pressed={example === source} className={`${small} max-w-full truncate aria-pressed:bg-[#3a3f4a]`}>
                Example {i + 1}
              </button>
            ))}
          </p>
        )}
      </form>

      {!run && (
        <p className={muted}>
          Click beside a line number to put a breakpoint (a red dot) on it, or press F9. Start runs the call and stops at the first breakpoint, or at the beginning if there is none. Then step forwards
          and backwards and watch the variables change. Nothing here is marked.
        </p>
      )}

      {run && stale && (
        <p className="text-[#e5a50a]">
          You have changed the code since this run, so the steps below are for the old code.{" "}
          <button type="button" onClick={start} disabled={disabled} className="cursor-pointer underline">
            Start again
          </button>
        </p>
      )}

      {run && steps.length === 0 && (
        <div>
          {run.result.loadError ? <p className="text-[#ff7b72]">Your code could not be loaded, so nothing ran.</p> : !run.result.error && <p className={muted}>None of your code ran for that call.</p>}
          {run.result.error && <pre className="mt-1 whitespace-pre-wrap break-words text-[#ff7b72]">{run.result.error}</pre>}
          {run.result.result !== null && <p className="mt-1">Result: {run.result.result}</p>}
        </div>
      )}

      {run && step && frame && (
        <>
          <div className="flex flex-wrap items-center gap-1.5">
            <button type="button" className={small} onClick={() => go(index - 1)} disabled={index === 0}>
              Back
            </button>
            <button type="button" className={small} onClick={() => go(index + 1)} disabled={index === last}>
              Step into
            </button>
            <button type="button" className={small} onClick={() => go(stepOver(steps, index))} disabled={index === last}>
              Step over
            </button>
            <button type="button" className={small} onClick={() => go(stepOut(steps, index))} disabled={index === last}>
              Step out
            </button>
            <button type="button" className={small} onClick={() => go(nextBreakpoint(steps, index, breakpoints))} disabled={index === last}>
              Continue
            </button>
            <span className={`ml-auto text-xs ${muted}`}>
              Step {index + 1} of {steps.length}
            </span>
          </div>

          <Timeline steps={steps} index={index} breakpoints={breakpoints} label={`Step ${index + 1} of ${steps.length}: ${words}`} onChange={go} />

          <p aria-live="polite" className={step.event === "exception" || step.event === "unwind" ? "text-[#ff7b72]" : "text-white"}>
            {reachedBreakpoint && (
              <>
                <span className="mr-2 inline-block size-2.5 rounded-full bg-[#ff3b30] align-middle" aria-hidden="true" />
                <span className="sr-only">Breakpoint. </span>
              </>
            )}
            {words}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className={`mb-1.5 truncate ${muted}`}>Variables in {calls.get(frame.id) ?? frame.fn}</p>
              <Variables locals={frame.locals} fresh={changed(steps, index, frame.id)} />
            </div>
            <CallStack step={step} calls={calls} source={run.source} selected={frame.id} onSelect={setChosen} />
          </div>

          <TraceTable steps={steps} stdout={run.result.stdout} frameId={frame.id} index={index} title={calls.get(frame.id) ?? frame.fn} />

          {step.out > 0 && (
            <div>
              <p className={`mb-1 ${muted}`}>Printed so far</p>
              <pre className="whitespace-pre-wrap break-words">{run.result.stdout.slice(0, step.out)}</pre>
            </div>
          )}

          {index === last && (
            <div className="border-t border-white/10 pt-2">
              {run.result.truncated ? (
                <p className="text-[#e5a50a]">Stopped after {steps.length} steps, which is as many as the debugger records. Try a smaller example, or look for a loop that never ends.</p>
              ) : run.result.error ? (
                <pre className="whitespace-pre-wrap break-words text-[#ff7b72]">{run.result.error}</pre>
              ) : (
                <p>
                  <span className="text-[#3fb950]">Finished.</span> {run.result.result !== null && <>Result: {run.result.result}</>}
                  {breakpoints.length > 0 && !steps.some((s) => s.event === "line" && breakpoints.includes(s.line)) && <span className={muted}> No breakpoint was reached.</span>}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
