"use client";

import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, useTransition } from "react";
import { submitCode } from "@/app/actions";
import { CodeLine } from "@/components/code-text";
import { RewardLines } from "@/components/rewards";
import { SolvedDialog, type Celebration, type SolvedSummary } from "@/components/solved-dialog";
import { TestResults } from "@/components/test-results";
import type { RunState } from "@/components/code-workspace";
import { celebrate } from "@/lib/celebrate";
import { readDraft, subscribeToDrafts, writeDraft } from "@/lib/drafts";
import { runInBrowser, warmUp } from "@/lib/py-runner";
import type { Rewards } from "@/lib/solve";
import type { JudgeOutcome, TestCase } from "@/lib/types";

// A put-in-order challenge: the lines of a working program, shuffled, perhaps
// with a spare line or two that do not belong. The student drags them (or
// moves them with the arrow buttons) into an order that works. Marking runs
// the arranged program against the tests, so any order that works counts.

/** Which offered lines are in the program, in order, and which are set aside, by their index. */
type Arrangement = { program: number[]; spare: number[] };

/** The arrangement with the program line at `from` moved to `to`. */
const moved = (arrangement: Arrangement, from: number, to: number): Arrangement => {
  const program = [...arrangement.program];
  const [line] = program.splice(from, 1);
  program.splice(to, 0, line);
  return { ...arrangement, program };
};

/** How many levels in a line is indented, at four spaces a level. */
const indentOf = (line: string) => (line.length - line.trimStart().length) / 4;

const parse = (raw: string | null, count: number): Arrangement | null => {
  try {
    const value = JSON.parse(raw ?? "null");
    const all = [...value.program, ...value.spare].sort((a: number, b: number) => a - b);
    // Only a saved arrangement of exactly these lines is any use.
    return all.length === count && all.every((n: number, i: number) => n === i) ? value : null;
  } catch {
    return null;
  }
};

export function OrderWorkspace({
  userId,
  slug,
  fileName,
  functionName,
  lines,
  visibleTests,
  hiddenCount,
  points,
  solved: initiallySolved,
  header,
  description,
  hints,
  teacherNotes,
  celebration,
}: {
  userId: string;
  slug: string;
  fileName: string;
  functionName: string;
  /** The lines offered, in the shuffled order they are first shown in. */
  lines: string[];
  visibleTests: TestCase[];
  hiddenCount: number;
  points: number;
  solved: boolean;
  header: React.ReactNode;
  description: React.ReactNode;
  hints: React.ReactNode;
  teacherNotes: React.ReactNode;
  celebration?: Celebration;
}) {
  const router = useRouter();
  const key = `order:${userId}:${slug}`;
  const saved = useSyncExternalStore(
    subscribeToDrafts,
    () => readDraft(key),
    () => null,
  );
  const arrangement = parse(saved, lines.length) ?? {
    program: lines.map((_, i) => i),
    spare: [],
  };
  const arrange = (next: Arrangement) => writeDraft(key, JSON.stringify(next));
  const code = arrangement.program.map((i) => lines[i]).join("\n");

  const [state, setState] = useState<RunState>(null);
  const [runs, setRuns] = useState(0);
  const [busy, setBusy] = useState<"run" | "submit" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [solved, setSolved] = useState(initiallySolved);
  const [justSolved, setJustSolved] = useState<Rewards | null>(null);
  const [popup, setPopup] = useState<SolvedSummary | null>(null);
  // Kept from the first render: the refresh after a solve stops the page sending it.
  const [toCelebrate] = useState(celebration);
  const [dragging, setDragging] = useState<number | null>(null);
  const [, startTransition] = useTransition();
  const rows = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => warmUp(), []);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= arrangement.program.length || from === to) return;
    arrange(moved(arrangement, from, to));
  };
  const setAside = (position: number) => {
    const program = [...arrangement.program];
    const [line] = program.splice(position, 1);
    arrange({ program, spare: [...arrangement.spare, line] });
  };
  const putBack = (position: number) => {
    const spare = [...arrangement.spare];
    const [line] = spare.splice(position, 1);
    arrange({ program: [...arrangement.program, line], spare });
  };

  // Dragging by the handle, with a mouse or a finger: the line moves to
  // wherever the pointer is among the other lines. The pointer is followed on
  // the whole window, because moving the row in the page loses any capture.
  const latest = useRef({ arrangement, dragging });
  useLayoutEffect(() => {
    latest.current = { arrangement, dragging };
  });
  const active = dragging !== null;
  useEffect(() => {
    if (!active) return;
    const follow = (event: PointerEvent) => {
      const { arrangement, dragging } = latest.current;
      if (dragging === null) return;
      const middles = arrangement.program.map((_, i) => {
        const rect = rows.current[i]?.getBoundingClientRect();
        return rect ? rect.top + rect.height / 2 : 0;
      });
      let target = middles.filter((middle) => middle < event.clientY).length;
      if (target > dragging) target -= 1;
      target = Math.max(0, Math.min(target, arrangement.program.length - 1));
      if (target === dragging) return;
      const next = moved(arrangement, dragging, target);
      latest.current = { arrangement: next, dragging: target };
      writeDraft(key, JSON.stringify(next));
      setDragging(target);
    };
    const stop = () => setDragging(null);
    window.addEventListener("pointermove", follow);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    return () => {
      window.removeEventListener("pointermove", follow);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  }, [active, key]);

  const run = async () => {
    setBusy("run");
    setMessage(null);
    setJustSolved(null);
    const outcome: JudgeOutcome = await runInBrowser(code, functionName, visibleTests);
    setState({ source: "run", outcome });
    setRuns((n) => n + 1);
    setBusy(null);
  };

  const submit = () => {
    setBusy("submit");
    setMessage(null);
    setJustSolved(null);
    startTransition(async () => {
      try {
        const result = await submitCode(slug, code);
        if (!result.ok) {
          setMessage(result.message);
        } else {
          setState({ source: "submit", outcome: result.outcome });
          setRuns((n) => n + 1);
          if (result.outcome.status === "ACCEPTED") {
            setSolved(true);
            celebrate();
          }
          if (result.newlySolved) {
            setJustSolved(result.rewards);
            setPopup({
              points: result.points,
              attempts: result.attempts,
              rewards: result.rewards,
            });
            router.refresh();
          }
        }
      } catch {
        setMessage("Could not reach the server. Check your connection and try again.");
      }
      setBusy(null);
    });
  };

  const reset = () => {
    if (!window.confirm("Put every line back where it started?")) return;
    arrange({ program: lines.map((_, i) => i), spare: [] });
    setState(null);
  };

  const lineRow = (index: number, position: number, spare: boolean) => (
    <li
      key={index}
      ref={spare ? undefined : (element) => void (rows.current[position] = element)}
      className={`order-line ${dragging === position && !spare ? "order-dragging" : ""} ${spare ? "order-spare" : ""}`}
    >
      {!spare && (
        <button
          type="button"
          aria-label="Drag to move"
          className="order-handle"
          onPointerDown={(event) => {
            event.preventDefault();
            setDragging(position);
          }}
        >
          <svg viewBox="0 0 10 16" width="10" height="16" aria-hidden="true" fill="currentColor">
            {[3, 8, 13].flatMap((y) => [<circle key={`a${y}`} cx="2.5" cy={y} r="1.4" />, <circle key={`b${y}`} cx="7.5" cy={y} r="1.4" />])}
          </svg>
        </button>
      )}
      <pre className="order-code" style={{ "--level": indentOf(lines[index]) } as React.CSSProperties}>
        <CodeLine line={lines[index].trimStart()} />
      </pre>
      <span className="flex shrink-0 items-center gap-1">
        {spare ? (
          <button type="button" className="order-button" onClick={() => putBack(position)} aria-label={`Put back: ${lines[index].trim()}`}>
            Use
          </button>
        ) : (
          <>
            <span className="order-arrows">
              <button type="button" className="order-button" onClick={() => move(position, position - 1)} disabled={position === 0} aria-label={`Move up: ${lines[index].trim()}`}>
                ↑
              </button>
              <button
                type="button"
                className="order-button"
                onClick={() => move(position, position + 1)}
                disabled={position === arrangement.program.length - 1}
                aria-label={`Move down: ${lines[index].trim()}`}
              >
                ↓
              </button>
            </span>
            <button type="button" className="order-button" onClick={() => setAside(position)} aria-label={`Leave out: ${lines[index].trim()}`}>
              ✕
            </button>
          </>
        )}
      </span>
    </li>
  );

  return (
    <main className="grid flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-2">
      <section className="card min-w-0 px-5 py-6 sm:px-8 sm:py-7">
        {header}
        {solved && (
          <p className="mt-3">
            <span className="tag" style={{ "--tone": "var(--pass)" } as React.CSSProperties}>
              Solved
            </span>
          </p>
        )}
        <div className="mt-7">{description}</div>
        {hints}
        {teacherNotes}
      </section>

      <section className="flex min-w-0 flex-col overflow-hidden rounded-[22px] bg-[#21252b] text-[#f6f8fa]">
        <div className="flex items-end gap-4 px-4 pt-2 font-mono text-[13px]">
          <span className="truncate rounded-t-[10px] bg-[#282c34] px-4 py-1.5">{fileName}</span>
          <span className="hidden pb-1.5 font-sans text-[#9198a1] sm:inline">drag the lines into order</span>
        </div>
        <div className="bg-[#282c34] px-2 py-2">
          <ol aria-label="Your program" className="space-y-1.5">
            {arrangement.program.map((index, position) => lineRow(index, position, false))}
          </ol>
          {arrangement.program.length === 0 && <p className="px-2 py-3 text-sm text-[#9198a1]">Every line has been left out. Use some of them.</p>}
          {arrangement.spare.length > 0 && (
            <div className="mt-3 border-t border-white/10 pt-2">
              <p className="px-2 pb-1.5 text-[13px] text-[#9198a1]">Left out</p>
              <ul aria-label="Lines left out" className="space-y-1.5">
                {arrangement.spare.map((index, position) => lineRow(index, position, true))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 px-4 py-3">
          <button type="button" onClick={run} disabled={busy !== null} className="btn btn-on-dark">
            {busy === "run" ? "Running…" : "Run examples"}
          </button>
          <button type="button" onClick={submit} disabled={busy !== null} className="btn btn-primary">
            {busy === "submit" ? "Marking…" : "Submit"}
          </button>
          <button type="button" onClick={reset} disabled={busy !== null} className="ml-auto text-sm text-[#9198a1] hover:text-white enabled:cursor-pointer">
            Reset
          </button>
        </div>

        <div className="min-h-28 bg-[#282c34] px-4 py-3 font-mono text-[13px] leading-6" aria-live="polite">
          {message && <p className="text-[#ff7b72]">{message}</p>}
          {state ? (
            <TestResults key={runs} state={state} tests={visibleTests} functionName={functionName} />
          ) : (
            !message && (
              <p className="text-[#9198a1]">
                Some lines may not be needed: leave those out with ✕.
                <br />
                Run examples tries your order on the {visibleTests.length} example{visibleTests.length === 1 ? "" : "s"}; Submit marks it against those plus {hiddenCount} hidden test
                {hiddenCount === 1 ? "" : "s"}.
              </p>
            )
          )}
          {justSolved && (
            <div className="mt-2 text-sm">
              <p className="rise" style={{ animationDelay: "200ms" }}>
                <span className="font-semibold text-[#3fb950]">Solved</span> +{points} points
              </p>
              <RewardLines rewards={justSolved} dark />
            </div>
          )}
        </div>
      </section>
      {toCelebrate && popup && <SolvedDialog celebration={toCelebrate} summary={popup} onClose={() => setPopup(null)} />}
    </main>
  );
}
