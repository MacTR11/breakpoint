import type { RunState } from "@/components/code-workspace";
import type { TestCase, TestResult, TestStatus } from "@/lib/types";
import { callText, toPy } from "../../public/judge/harness.mjs";

// Written like a test runner's output, in the editor's own colours.
const word: Record<TestStatus, [string, string]> = {
  PASS: ["PASS", "text-[#3fb950]"],
  FAIL: ["FAIL", "text-[#ff7b72]"],
  ERROR: ["ERR ", "text-[#ff7b72]"],
  TIMEOUT: ["SLOW", "text-[#e5a50a]"],
  SKIPPED: ["SKIP", "text-[#9198a1]"],
};

function headline(state: NonNullable<RunState>) {
  const { outcome, source } = state;
  const passed = outcome.results.filter((r) => r.status === "PASS").length;
  const total = outcome.results.length;
  if (outcome.loadError) return { text: "could not run your code", good: false };
  if (outcome.status === "ACCEPTED") {
    return source === "submit" ? { text: `all ${total} tests passed`, good: true } : { text: `all ${total} examples passed. Submit to run the hidden tests.`, good: true };
  }
  if (outcome.status === "TIMEOUT") return { text: `time limit exceeded, ${passed} of ${total} passed`, good: false };
  return { text: `${passed} of ${total} passed`, good: false };
}

function Row({ result, test, functionName, number }: { result: TestResult; test?: TestCase; functionName: string; number: number }) {
  const detail = test && !result.hidden ? test : null;
  const [label, color] = word[result.status];
  // A test that never ran has nothing to compare, so it gets no detail.
  const failed = result.status !== "PASS" && result.status !== "SKIPPED";
  return (
    <li>
      <p>
        <span className={`font-semibold ${color}`}>{label}</span> {result.hidden ? `hidden ${number}` : `example ${number}`}
        {detail && !detail.steps && <span className="text-[#9198a1]"> {callText(functionName, detail)}</span>}
      </p>
      {detail && result.status !== "SKIPPED" && (failed || detail.steps) && (
        <dl className="mb-2 grid grid-cols-[4.5rem_1fr] gap-x-2 pl-[2.6rem] text-[#9198a1]">
          {detail.steps && (
            <>
              <dt>calls</dt>
              <dd className="whitespace-pre-wrap break-all text-[#f6f8fa]">{callText(functionName, detail)}</dd>
            </>
          )}
          {failed && (
            <>
              <dt>expected</dt>
              <dd className="break-all text-[#f6f8fa]">{toPy(detail.expected)}</dd>
            </>
          )}
          {failed && result.actual !== undefined && (
            <>
              <dt>returned</dt>
              <dd className="break-all text-[#ff7b72]">{result.actual}</dd>
            </>
          )}
          {result.stdout && (
            <>
              <dt>printed</dt>
              <dd className="whitespace-pre-wrap break-all text-[#f6f8fa]">{result.stdout}</dd>
            </>
          )}
        </dl>
      )}
      {detail && result.status === "FAIL" && !detail.steps && result.actual === "None" && detail.expected !== null && (
        <p className="mb-2 pl-[2.6rem] text-[#e5a50a]">Your function returned None. Did you forget a return statement, or print the answer instead of returning it?</p>
      )}
      {detail?.steps && result.status === "FAIL" && <p className="mb-2 pl-[2.6rem] text-[#e5a50a]">expected and returned list what each method call gave back, in order.</p>}
      {detail && result.status === "TIMEOUT" && <p className="mb-2 pl-[2.6rem] text-[#e5a50a]">The code ran for too long on this test. Look for a loop that never ends.</p>}
      {detail && result.error && <pre className="mb-2 whitespace-pre-wrap break-words pl-[2.6rem] text-[#ff7b72]">{result.error}</pre>}
    </li>
  );
}

export function TestResults({ state, tests, functionName }: { state: NonNullable<RunState>; tests: TestCase[]; functionName: string }) {
  const { outcome } = state;
  const { text, good } = headline(state);
  // The server sends results for every test but this component only holds the
  // visible ones; both lists keep their order, so the nth visible result
  // belongs to the nth visible test.
  const counts = { hidden: 0, visible: 0 };
  const rows = outcome.results.map((result) => {
    const number = result.hidden ? ++counts.hidden : ++counts.visible;
    return { result, number, test: result.hidden ? undefined : tests[number - 1] };
  });
  return (
    <div>
      <p className={good ? "text-[#3fb950]" : "text-[#ff7b72]"}>{text}</p>
      {outcome.loadError && <pre className="mt-1 whitespace-pre-wrap break-words text-[#ff7b72]">{outcome.loadError}</pre>}
      <ul className="mt-1">
        {rows.map(({ result, number, test }) => (
          <Row key={result.index} result={result} test={test} functionName={functionName} number={number} />
        ))}
      </ul>
    </div>
  );
}
