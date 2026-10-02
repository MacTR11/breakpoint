"use client";

import { python } from "@codemirror/lang-python";
import { indentUnit } from "@codemirror/language";
import CodeMirror from "@uiw/react-codemirror";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, useTransition } from "react";
import { submitCode } from "@/app/actions";
import { TestResults } from "@/components/test-results";
import { readDraft, subscribeToDrafts, writeDraft } from "@/lib/drafts";
import { runInBrowser, warmUp } from "@/lib/py-runner";
import { bannedUse, type JudgeOutcome, type TestCase } from "@/lib/types";

const extensions = [python(), indentUnit.of("    ")];

export type RunState = { source: "run" | "submit"; outcome: JudgeOutcome } | null;

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
    <main className="grid flex-1 lg:h-[calc(100vh-4.75rem)] lg:grid-cols-2">
      <section className="px-4 py-8 sm:px-8 lg:overflow-y-auto">
        {header}
        {solved && (
          <p className="mt-3 font-mono text-sm">
            <span className="font-semibold text-pass">PASS</span> solved
          </p>
        )}
        <div className="mt-7">{description}</div>
        {hints}
        {teacherNotes}
      </section>

      <section className="flex min-h-[36rem] flex-col bg-[#21252b] text-[#f6f8fa] lg:min-h-0">
        <div className="flex items-end gap-4 px-4 pt-2 font-mono text-[13px]">
          <span className="rounded-t-md bg-[#282c34] px-4 py-1.5">{fileName}</span>
          {isFix && <span className="pb-1.5 text-[#e5a50a]">this code has bugs</span>}
        </div>

        <div className="min-h-0 flex-1 overflow-hidden bg-[#282c34]">
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

        <div className="max-h-[45%] min-h-28 overflow-y-auto border-t border-white/10 px-4 py-3 font-mono text-[13px] leading-6" aria-live="polite">
          {message && <p className="text-[#ff7b72]">{message}</p>}
          {justSolved && (
            <p>
              <span className="font-semibold text-[#3fb950]">PASS</span> solved, +{points} points
              {justSolved.hintEarned && <span className="text-[#e5a50a]"> · you earned a hint</span>}
            </p>
          )}
          {state ? (
            <TestResults state={state} tests={visibleTests} functionName={functionName} />
          ) : (
            !message && (
              <p className="text-[#9198a1]">
                Run examples: tries {isFix ? "the code" : "your code"} on the {visibleTests.length} example{visibleTests.length === 1 ? "" : "s"} from the question.
                <br />
                Submit: marks it against those plus {hiddenCount} hidden test{hiddenCount === 1 ? "" : "s"}.
              </p>
            )
          )}
        </div>
      </section>
    </main>
  );
}
