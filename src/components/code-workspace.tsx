"use client";

import { python } from "@codemirror/lang-python";
import { indentUnit } from "@codemirror/language";
import type { EditorView } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, useTransition } from "react";
import { submitCode } from "@/app/actions";
import { ConsolePanel } from "@/components/console-panel";
import { DebugPanel } from "@/components/debug-panel";
import { RewardLines } from "@/components/rewards";
import { TestResults } from "@/components/test-results";
import { celebrate } from "@/lib/celebrate";
import { debuggerExtensions, reachLine } from "@/lib/debugger";
import { readDraft, subscribeToDrafts, writeDraft } from "@/lib/drafts";
import { ANTIGRAVITY_EVENT, usesAntigravity } from "@/lib/eggs";
import { runInBrowser, warmUp } from "@/lib/py-runner";
import type { Rewards } from "@/lib/solve";
import { bannedUse, type JudgeOutcome, type TestCase } from "@/lib/types";
import { addSeconds, readCounts, trackingExtensions } from "@/lib/typing-counts";
import { callText } from "../../public/judge/harness.mjs";

const extensions = [python(), indentUnit.of("    ")];

export type RunState = { source: "run" | "submit"; outcome: JudgeOutcome } | null;

// Under the editor: the marked results, a Python console, and the debugger.
const TABS = [
  ["results", "Results"],
  ["console", "Console"],
  ["debugger", "Debugger"],
] as const;
type Tab = (typeof TABS)[number][0];

export function CodeWorkspace({
  userId,
  slug,
  fileName,
  functionName,
  starterCode,
  savedCode,
  visibleTests,
  hiddenCount,
  banned,
  points,
  isFix,
  blockPastes,
  draftScope = "",
  solved: initiallySolved,
  header,
  description,
  hints,
  teacherNotes,
}: {
  userId: string;
  slug: string;
  fileName: string;
  functionName: string;
  starterCode: string;
  savedCode: string | null;
  visibleTests: TestCase[];
  hiddenCount: number;
  banned: string[];
  points: number;
  /** The starter code is deliberately broken and the task is to repair it. */
  isFix: boolean;
  /** The teacher has chosen to refuse large pastes from outside the editor. */
  blockPastes: boolean;
  /** Keeps a separate draft, such as one per mock paper, so earlier work does not appear. */
  draftScope?: string;
  solved: boolean;
  header: React.ReactNode;
  description: React.ReactNode;
  hints: React.ReactNode;
  teacherNotes: React.ReactNode;
}) {
  const router = useRouter();
  // Keyed by user so classmates sharing a computer never see each other's work.
  const draftKey = `draft:${userId}:${slug}${draftScope && `:${draftScope}`}`;
  // A draft in this browser is always newer than the last submission.
  const draft = useSyncExternalStore(
    subscribeToDrafts,
    () => readDraft(draftKey),
    () => null,
  );
  const code = draft ?? savedCode ?? starterCode;
  const [state, setState] = useState<RunState>(null);
  // Counts runs, so each new set of results is a fresh element and animates in.
  const [runs, setRuns] = useState(0);
  const [busy, setBusy] = useState<"run" | "submit" | "tool" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [solved, setSolved] = useState(initiallySolved);
  const [justSolved, setJustSolved] = useState<Rewards | null>(null);
  const [, startTransition] = useTransition();

  // Start fetching Python straight away so the first Run is quick.
  useEffect(() => warmUp(), []);

  // What was typed and what was pasted in from outside is counted beside the
  // draft and sent with each submission (see src/lib/integrity.ts).
  const countsKey = `counts:${userId}:${slug}${draftScope && `:${draftScope}`}`;
  const [pasteNote, setPasteNote] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("results");
  const tracking = useMemo(
    () =>
      trackingExtensions(countsKey, blockPastes, (note) => {
        setPasteNote(note);
        setTab("results");
      }),
    [countsKey, blockPastes],
  );
  const [breakpoints, setBreakpoints] = useState<number[]>([]);
  const debugging = useMemo(() => debuggerExtensions(setBreakpoints), []);
  const allExtensions = useMemo(() => [...extensions, ...debugging, ...tracking], [debugging, tracking]);
  const editor = useRef<EditorView | null>(null);
  const showLine = useCallback((line: number | null) => {
    if (editor.current) reachLine(editor.current, line);
  }, []);
  const toolBusy = useCallback((on: boolean) => setBusy(on ? "tool" : null), []);
  const examples = useMemo(() => visibleTests.map((test) => callText(functionName, test)), [visibleTests, functionName]);
  // Time only counts while the page is actually being looked at.
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") addSeconds(countsKey, 5);
    }, 5000);
    return () => clearInterval(timer);
  }, [countsKey]);

  const edit = (value: string) => writeDraft(draftKey, value);

  const run = async () => {
    if (usesAntigravity(code)) window.dispatchEvent(new Event(ANTIGRAVITY_EVENT));
    setTab("results");
    setBusy("run");
    setMessage(null);
    setJustSolved(null);
    const notAllowed = bannedUse(code, banned);
    const outcome: JudgeOutcome = notAllowed ? { status: "ERROR", loadError: notAllowed, results: [] } : await runInBrowser(code, functionName, visibleTests);
    setState({ source: "run", outcome });
    setRuns((n) => n + 1);
    setBusy(null);
  };

  const submit = () => {
    setTab("results");
    setBusy("submit");
    setMessage(null);
    setJustSolved(null);
    startTransition(async () => {
      try {
        const result = await submitCode(slug, code, readCounts(countsKey));
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
    const question = isFix ? "Put the original broken code back?" : "Replace your code with the starter code?";
    if (code !== starterCode && !window.confirm(question)) return;
    edit(starterCode);
    setState(null);
    // The counts are kept: Reset can be undone, which would otherwise bring back pasted code uncounted.
  };

  return (
    <main className="grid flex-1 grid-cols-1 gap-4 p-4 lg:h-[calc(100dvh-3.5rem-1px)] lg:grid-cols-2">
      <section className="card min-w-0 px-5 py-6 sm:px-8 sm:py-7 lg:overflow-y-auto">
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

      <section className="flex min-h-[36rem] min-w-0 flex-col overflow-hidden rounded-[22px] bg-[#21252b] text-[#f6f8fa] lg:min-h-0">
        <div className="flex items-end gap-4 px-4 pt-2 font-mono text-[13px]">
          <span className="rounded-t-[10px] bg-[#282c34] px-4 py-1.5">{fileName}</span>
          {isFix && <span className="pb-1.5 text-[#e5a50a]">this code has bugs</span>}
        </div>

        <div className="min-h-0 flex-1 overflow-hidden bg-[#282c34]">
          <CodeMirror
            value={code}
            onChange={edit}
            theme="dark"
            height="100%"
            style={{ height: "100%" }}
            extensions={allExtensions}
            onCreateEditor={(view) => {
              editor.current = view;
            }}
            aria-label="Python code editor"
            basicSetup={{ tabSize: 4, lineNumbers: false, foldGutter: false }}
          />
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

        <div
          role="tablist"
          aria-label="Under the editor"
          className="flex gap-1 px-4 font-mono text-[13px]"
          onKeyDown={(event) => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            const next = TABS[(TABS.findIndex(([id]) => id === tab) + (event.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length][0];
            setTab(next);
            document.getElementById(`tab-${next}`)?.focus();
          }}
        >
          {TABS.map(([id, label]) => (
            <button
              key={id}
              id={`tab-${id}`}
              type="button"
              role="tab"
              aria-selected={tab === id}
              aria-controls={`panel-${id}`}
              tabIndex={tab === id ? 0 : -1}
              onClick={() => setTab(id)}
              className={`cursor-pointer rounded-t-[10px] px-4 py-1.5 ${tab === id ? "bg-[#282c34] text-white" : "text-[#9198a1] hover:text-white"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={`${tab === "debugger" ? "max-h-[62%]" : "max-h-[45%]"} min-h-28 overflow-y-auto bg-[#282c34] px-4 py-3 font-mono text-[13px] leading-6`}>
          <div id="panel-results" role="tabpanel" aria-labelledby="tab-results" hidden={tab !== "results"} aria-live="polite">
            {message && <p className="text-[#ff7b72]">{message}</p>}
            {pasteNote && <p className="rise text-[#e5a50a]">{pasteNote}</p>}
            {state ? (
              <TestResults key={runs} state={state} tests={visibleTests} functionName={functionName} />
            ) : (
              !message && (
                <p className="text-[#9198a1]">
                  Run examples: tries {isFix ? "the code" : "your code"} on the {visibleTests.length} example{visibleTests.length === 1 ? "" : "s"} from the question.
                  <br />
                  Submit: marks it against those plus {hiddenCount} hidden test{hiddenCount === 1 ? "" : "s"}.
                  <br />
                  {blockPastes ? "Pasting large blocks of code is switched off." : "Large pastes are noted for your teacher."}
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
          <div id="panel-console" role="tabpanel" aria-labelledby="tab-console" hidden={tab !== "console"}>
            <ConsolePanel code={code} examples={examples} disabled={busy !== null} onBusy={toolBusy} />
          </div>
          <div id="panel-debugger" role="tabpanel" aria-labelledby="tab-debugger" hidden={tab !== "debugger"}>
            <DebugPanel code={code} examples={examples} breakpoints={breakpoints} active={tab === "debugger"} disabled={busy !== null} onBusy={toolBusy} onLine={showLine} />
          </div>
        </div>
      </section>
    </main>
  );
}
