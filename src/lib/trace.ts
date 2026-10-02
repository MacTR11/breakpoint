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

/** What one call's variables were when it was last seen before step `index`, if it was. */
export const previousLocals = (steps: TraceStep[], index: number, frameId: number) => before(steps, index, frameId)?.locals ?? null;

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

/** How many times each line ran over the whole run. */
export function lineCounts(steps: TraceStep[]) {
  const counts = new Map<number, number>();
  for (const step of steps) if (step.event === "line") counts.set(step.line, (counts.get(step.line) ?? 0) + 1);
  return counts;
}

export type CallNode = {
  id: number;
  fn: string;
  /** The values it was called with, such as `3` or `[5, 1], 0`. */
  args: string;
  /** The call that made it, or null for a call from the student's own line. */
  parent: number | null;
  children: number[];
  /** The steps where it was called, and where it returned or passed an error up (null if the run stopped first). */
  start: number;
  end: number | null;
  value: string | null;
  raised: boolean;
};

/** Every call in a run as a tree: which call made which, and what each one returned. */
export function callTree(steps: TraceStep[]) {
  const nodes = new Map<number, CallNode>();
  const roots: number[] = [];
  steps.forEach((step, index) => {
    const frame = step.stack[0];
    if (!frame) return;
    if (step.event === "call" && !nodes.has(frame.id)) {
      const parent = step.stack[1]?.id ?? null;
      nodes.set(frame.id, { id: frame.id, fn: frame.fn, args: frame.locals.map(([, value]) => value).join(", "), parent, children: [], start: index, end: null, value: null, raised: false });
      const caller = parent === null ? undefined : nodes.get(parent);
      if (caller) caller.children.push(frame.id);
      else roots.push(frame.id);
    } else if ((step.event === "return" || step.event === "unwind") && nodes.has(frame.id)) {
      const node = nodes.get(frame.id)!;
      node.end = index;
      node.raised = step.event === "unwind";
      node.value = node.raised ? null : (step.value ?? "None");
    }
  });
  return { nodes, roots };
}

/**
 * Where to draw each call, in slots and levels: calls with no calls of their
 * own side by side in the order they were made, and each call centred over
 * the calls it made. Worked out for the whole run, so nothing moves as the
 * tree fills in.
 */
export function treeLayout({ nodes, roots }: ReturnType<typeof callTree>) {
  const place = new Map<number, { x: number; y: number }>();
  let next = 0;
  let levels = 0;
  const visit = (id: number, y: number): number => {
    const node = nodes.get(id)!;
    levels = Math.max(levels, y + 1);
    const xs = node.children.map((child) => visit(child, y + 1));
    const x = xs.length === 0 ? next++ : (xs[0] + xs[xs.length - 1]) / 2;
    place.set(id, { x, y });
    return x;
  };
  for (const root of roots) visit(root, 0);
  return { place, slots: next, levels };
}

export type ListItem = { text: string; number: number | null };

/**
 * A list of plain values as Python shows it, such as `[5, 3, 'a', None]`, split
 * into its items. Null for anything else: nested lists, objects, or a list
 * shortened with "...".
 */
export function parseList(repr: string): ListItem[] | null {
  if (!repr.startsWith("[") || !repr.endsWith("]")) return null;
  const inner = repr.slice(1, -1).trim();
  if (!inner) return [];
  const token = /('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|-?\d+(?:\.\d+)?(?:e[+-]?\d+)?|True|False|None)\s*(?:,\s*|$)/y;
  const items: ListItem[] = [];
  for (let at = 0; at < inner.length; ) {
    token.lastIndex = at;
    const match = token.exec(inner);
    if (!match) return null;
    items.push({ text: match[1], number: /^-?\d/.test(match[1]) ? Number(match[1]) : null });
    at = token.lastIndex;
  }
  return items;
}

/** Names that usually hold a position in a list: i, j, low, mid, high, and the like. */
const INDEX_NAME = /^(i|j|k|idx|index|pos|position|lo|low|hi|high|mid|middle|left|right|start|end|first|last|current|cur|ptr|top|front|rear|head|tail|pivot\w*|min\w*|max\w*|smallest|largest|\w+_(?:i|idx|index|pos))$/i;
const LOW_END = /^(lo|low|left|start|first)$/i;
const HIGH_END = /^(hi|high|right|end|last)$/i;

export type ListView = {
  name: string;
  items: ListItem[];
  /** Every item is a number, so it can be drawn as a bar. */
  numeric: boolean;
  /** Items that changed since this call was last seen. */
  changedAt: boolean[];
  /** Variables that look like positions in the list, and where they point. */
  markers: { name: string; at: number }[];
  /** With both ends of a search range (low and high, say), the part still being searched. */
  range: [number, number] | null;
};

/** The lists of plain values in one call's variables, ready to draw, with any index variables pointing into them. */
export function listViews(locals: [string, string][], previous: [string, string][] | null): ListView[] {
  const positions = locals.filter(([name, value]) => INDEX_NAME.test(name) && /^-?\d+$/.test(value)).map(([name, value]) => ({ name, at: Number(value) }));
  const old = new Map(previous ?? []);
  return locals.flatMap(([name, value]) => {
    const items = parseList(value);
    if (!items || items.length < 2 || items.length > 24 || items.some((item) => item.text.length > 14)) return [];
    const before = old.has(name) ? parseList(old.get(name)!) : null;
    const markers = positions.filter((p) => p.at >= 0 && p.at < items.length);
    const low = markers.find((m) => LOW_END.test(m.name));
    const high = markers.find((m) => HIGH_END.test(m.name));
    return [
      {
        name,
        items,
        numeric: items.every((item) => item.number !== null && Number.isFinite(item.number)),
        changedAt: items.map((item, i) => before !== null && before.length === items.length && before[i].text !== item.text),
        markers,
        range: low && high && low.at <= high.at ? [low.at, high.at] : null,
      },
    ];
  });
}
