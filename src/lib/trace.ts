// What the debugger shows, worked out from a recorded run (public/judge/tracer.mjs).
// No CodeMirror and no worker here, so `npm run check` can test it.

export type TraceFrame = { id: number; fn: string; line: number; locals: [string, string][] };

/** One moment in a run: about to run a line, or a function being called, returning, raising or passing an error up. */
export type TraceStep = {
  event: "call" | "line" | "return" | "exception" | "unwind";
  line: number;
  fn: string;
  /** How many of the student's functions are running, the current one included. */
  depth: number;
  /** Outer calls left out of `stack` because it was too deep to show. */
  hidden: number;
  /** The current function first, then the ones that called it. */
  stack: TraceFrame[];
  /** How much had been printed by this point. */
  out: number;
  /** What was returned, or the name of the error raised. */
  value?: string;
};

export type TraceResult = { ok: boolean; steps: TraceStep[]; result: string | null; stdout: string; error: string | null; truncated: boolean; loadError?: boolean };
export type ConsoleResult = { ok: boolean; result: string | null; stdout: string; error: string | null };

/** Each call as it was made, such as `factorial(n=3)`, by its number. */
export function callsIn(steps: TraceStep[]) {
  const calls = new Map<number, string>();
  for (const step of steps) {
    const frame = step.stack[0];
    if (frame && !calls.has(frame.id)) calls.set(frame.id, `${frame.fn}(${frame.locals.map(([name, value]) => `${name}=${value}`).join(", ")})`);
  }
  return calls;
}

/** One step in plain words. */
export function describe(step: TraceStep, calls: Map<number, string>) {
  const call = calls.get(step.stack[0]?.id ?? -1) ?? `${step.fn}()`;
  switch (step.event) {
    case "call":
      return `Calling ${call}`;
    case "line":
      return `About to run line ${step.line}`;
    case "return":
      return `${call} returns ${step.value}`;
    case "exception":
      return `${step.value} on line ${step.line}`;
    case "unwind":
      return `${call} stops, and the error goes back to ${step.depth > 1 ? "the function that called it" : "your call"}`;
  }
}

/** Where `frameId` was last seen before step `index`, if it was. */
function before(steps: TraceStep[], index: number, frameId: number) {
  for (let i = index - 1; i >= 0; i--) {
    const frame = steps[i].stack.find((f) => f.id === frameId);
    if (frame) return frame;
  }
  return null;
}

/** The variables of one call that changed since that call was last seen. */
export function changed(steps: TraceStep[], index: number, frameId: number) {
  const now = steps[index]?.stack.find((f) => f.id === frameId);
  const then = before(steps, index, frameId);
  if (!now || !then) return new Set<string>();
  const old = new Map(then.locals);
  return new Set(now.locals.filter(([name, value]) => old.get(name) !== value).map(([name]) => name));
}

export type TraceRow = { step: number; line: number; values: Map<string, string>; printed: string; error: string | null };

/**
 * A trace table for one call, the way one is written by hand: a row for each
 * line once it has run, with only the values that changed, and what it printed.
 * Lines of functions it calls are folded into the line that called them.
 * Only lines finished by step `upTo` are included.
 */
export function traceTable(steps: TraceStep[], stdout: string, frameId: number, upTo: number) {
  const mine: number[] = [];
  for (let i = 0; i <= Math.min(upTo, steps.length - 1); i++) if (steps[i].stack[0]?.id === frameId) mine.push(i);
  const columns: string[] = [];
  const rows: TraceRow[] = [];
  const first = steps[mine[0]];
  let shown = new Map<string, string>(first?.stack[0].locals ?? []);
  for (const name of shown.keys()) columns.push(name);
  // The first row is what it was called with.
  if (first?.event === "call" && shown.size > 0) rows.push({ step: mine[0], line: first.line, values: new Map(shown), printed: "", error: null });
  for (let k = 0; k + 1 < mine.length; k++) {
    const at = steps[mine[k]];
    const next = steps[mine[k + 1]];
    if (at.event !== "line") continue;
    const values = new Map<string, string>();
    for (const [name, value] of next.stack[0].locals) {
      if (!columns.includes(name)) columns.push(name);
      if (shown.get(name) !== value) values.set(name, value);
    }
    shown = new Map(next.stack[0].locals);
    rows.push({ step: mine[k], line: at.line, values, printed: stdout.slice(at.out, next.out), error: next.event === "exception" ? (next.value ?? "Error") : null });
  }
  return { columns, rows };
}

/** Step over: the next step in this call or a call further out, skipping what the current line calls. */
export function stepOver(steps: TraceStep[], index: number) {
  const here = steps[index];
  if (!here) return index;
  for (let i = index + 1; i < steps.length; i++) {
    const frame = steps[i].stack[0];
    if (steps[i].depth < here.depth || frame?.id === here.stack[0]?.id) return i;
  }
  return steps.length - 1;
}

/** Step out: to where the current call returns (or passes an error up), then on into its caller. */
export function stepOut(steps: TraceStep[], index: number) {
  const id = steps[index]?.stack[0]?.id;
  for (let i = index + 1; i < steps.length; i++) {
    if ((steps[i].event === "return" || steps[i].event === "unwind") && steps[i].stack[0]?.id === id) return i;
  }
  return Math.min(index + 1, steps.length - 1);
}

/** Continue: to the next line with a breakpoint on it, or the end. */
export function nextBreakpoint(steps: TraceStep[], index: number, breakpoints: number[]) {
  for (let i = index + 1; i < steps.length; i++) if (steps[i].event === "line" && breakpoints.includes(steps[i].line)) return i;
  return steps.length - 1;
}
