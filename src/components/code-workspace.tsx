"use client";

import { python } from "@codemirror/lang-python";
import { indentUnit } from "@codemirror/language";
import CodeMirror from "@uiw/react-codemirror";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, useTransition } from "react";
import { submitCode } from "@/app/actions";
import { HintCoin } from "@/components/brand";
import { TestResults } from "@/components/test-results";
import { readDraft, subscribeToDrafts, writeDraft } from "@/lib/drafts";
import { runInBrowser, warmUp } from "@/lib/py-runner";
import { bannedUse, type JudgeOutcome, type TestCase } from "@/lib/types";

const extensions = [python(), indentUnit.of("    ")];

export type RunState = { source: "run" | "submit"; outcome: JudgeOutcome } | null;

export function CodeWorkspace({
  userId,
  slug,
  functionName,
  starterCode,
  savedCode,
  visibleTests,
  hiddenCount,
  banned,
  points,
  isFix,
  solved: initiallySolved,
  header,
  description,
  hints,
  teacherNotes,
}: {
  userId: string;
  slug: string;
  functionName: string;
  starterCode: string;
  savedCode: string | null;
  visibleTests: TestCase[];
  hiddenCount: number;
  banned: string[];
  points: number;
  /** The starter code is deliberately broken and the task is to repair it. */
  isFix: boolean;
  solved: boolean;
  header: React.ReactNode;
  description: React.ReactNode;
  hints: React.ReactNode;
  teacherNotes: React.ReactNode;
}) {
  const router = useRouter();
  // Keyed by user so classmates sharing a computer never see each other's work.
  const draftKey = `draft:${userId}:${slug}`;
  // A draft in this browser is always newer than the last submission.
  const draft = useSyncExternalStore(
    subscribeToDrafts,
    () => readDraft(draftKey),
    () => null,
  );
  const code = draft ?? savedCode ?? starterCode;
  const [state, setState] = useState<RunState>(null);
  const [busy, setBusy] = useState<"run" | "submit" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [solved, setSolved] = useState(initiallySolved);
  const [justSolved, setJustSolved] = useState<{ hintEarned: boolean } | null>(null);
  const [, startTransition] = useTransition();

  // Start fetching Python straight away so the first Run is quick.
  useEffect(() => warmUp(), []);

  const edit = (value: string) => writeDraft(draftKey, value);

  const run = async () => {
    setBusy("run");
    setMessage(null);
    setJustSolved(null);
    const notAllowed = bannedUse(code, banned);
    const outcome: JudgeOutcome = notAllowed ? { status: "ERROR", loadError: notAllowed, results: [] } : await runInBrowser(code, functionName, visibleTests);
    setState({ source: "run", outcome });
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
          if (result.outcome.status === "ACCEPTED") setSolved(true);
          if (result.newlySolved) {
            setJustSolved({ hintEarned: result.hintEarned });
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
  };

  return (
    <main className="flex-1 grid gap-3 p-3 lg:grid-cols-2 lg:h-[calc(100vh-4rem)]">
      <section className="glass rounded-[1.75rem] lg:overflow-y-auto px-5 sm:px-9 py-9">
        {header}
        {solved && (
          <p className="badge mt-5 inline-flex items-center gap-1.5 bg-[#30d158]/20 px-3 py-1 text-sm text-[#126b2d]">✓ Solved</p>
        )}
        <div className="mt-8">{description}</div>
        {hints}
        {teacherNotes}
      </section>

      <section className="window flex min-h-[38rem] flex-col overflow-hidden rounded-[1.75rem] lg:min-h-0">
        <div className="window-bar flex items-center gap-2 px-5 py-2.5">
          <span className="font-mono text-xs text-[#aeaeb2]">solution.py</span>
          {isFix && <span className="ml-auto rounded-full bg-[#bf5af2]/25 px-2.5 py-0.5 text-xs font-medium text-[#e3c2ff]">This code has bugs</span>}
        </div>

        <div className="flex-1 min-h-0 overflow-hidden bg-[#282c34]">
          <CodeMirror
            value={code}
            onChange={edit}
            theme="dark"
            height="100%"
            style={{ height: "100%" }}
            extensions={extensions}
            aria-label="Python code editor"
            basicSetup={{ tabSize: 4 }}
          />
        </div>

        <div className="window-bar flex flex-wrap items-center gap-3 px-5 py-3">
          <button type="button" onClick={run} disabled={busy !== null} className="btn btn-on-dark">
            {busy === "run" ? "Running…" : "▶ Run examples"}
          </button>
          <button type="button" onClick={submit} disabled={busy !== null} className="btn btn-primary">
            {busy === "submit" ? "Marking…" : "Submit"}
          </button>
          <button type="button" onClick={reset} disabled={busy !== null} className="ml-auto text-sm text-[#aeaeb2] hover:text-white enabled:cursor-pointer">
            Reset
          </button>
        </div>

        <div className="max-h-[45%] min-h-28 overflow-y-auto px-5 py-4 text-[#f5f5f7]" aria-live="polite">
          {message && <p className="mb-3 rounded-xl bg-[#ff453a]/15 px-4 py-3 text-sm text-[#ff9f99]">{message}</p>}
          {justSolved && (
            <p className="mb-3 flex flex-wrap items-center gap-2 rounded-xl bg-[#30d158]/15 px-4 py-3 text-sm font-medium text-[#30d158]">
              Solved. +{points} points
              {justSolved.hintEarned && (
                <span className="flex items-center gap-1.5 text-[#ffd60a]">
                  <HintCoin size={16} /> You earned a hint.
                </span>
              )}
            </p>
          )}
          {state ? (
            <TestResults state={state} tests={visibleTests} functionName={functionName} />
          ) : (
            !message && (
              <p className="text-sm text-[#a1a1a6]">
                <strong className="font-medium text-[#f5f5f7]">Run examples</strong> tries {isFix ? "the code" : "your code"} on the {visibleTests.length} example
                {visibleTests.length === 1 ? "" : "s"} from the question. <strong className="font-medium text-[#f5f5f7]">Submit</strong> marks it against those plus{" "}
                {hiddenCount} hidden test{hiddenCount === 1 ? "" : "s"}.
              </p>
            )
          )}
        </div>
      </section>
    </main>
  );
}
