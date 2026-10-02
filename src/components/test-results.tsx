import type { RunState } from "@/components/code-workspace";
import type { TestCase, TestResult, TestStatus } from "@/lib/types";
import { callText, toPy } from "../../public/judge/harness.mjs";

const label: Record<TestStatus, string> = { PASS: "Passed", FAIL: "Wrong answer", ERROR: "Error", TIMEOUT: "Too slow", SKIPPED: "Not run" };
const tone: Record<TestStatus, string> = {
  PASS: "text-[#30d158]",
  FAIL: "text-[#ff6961]",
  ERROR: "text-[#ff6961]",
  TIMEOUT: "text-[#ffd60a]",
  SKIPPED: "text-[#6e6e73]",
};

function headline(state: NonNullable<RunState>) {
  const { outcome, source } = state;
  const passed = outcome.results.filter((r) => r.status === "PASS").length;
  const total = outcome.results.length;
  if (outcome.loadError) return { text: "Your code could not be run", good: false };
  if (outcome.status === "ACCEPTED") {
    return source === "submit"
      ? { text: `Accepted. All ${total} tests passed`, good: true }
      : { text: `All ${total} examples passed. Submit to check the hidden tests.`, good: true };
  }
  if (outcome.status === "TIMEOUT") return { text: `Time limit exceeded. ${passed} of ${total} tests passed`, good: false };
  return { text: `${passed} of ${total} tests passed`, good: false };
}

function Row({ result, test, functionName, number }: { result: TestResult; test?: TestCase; functionName: string; number: number }) {
  const detail = test && !result.hidden ? test : null;
  return (
    <li className="rounded-xl bg-white/5 px-4 py-3">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium">{result.hidden ? `Hidden test ${number}` : `Example ${number}`}</span>
        <span className={`font-medium ${tone[result.status]}`}>
          {result.status === "PASS" ? "✓ " : ""}
          {label[result.status]}
        </span>
      </div>
      {detail && (
        <dl className="mt-3 grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-1.5 font-mono text-[13px]">
          <dt className="text-[#a1a1a6]">{detail.steps ? "Calls" : "Call"}</dt>
          <dd className="whitespace-pre-wrap break-all">{callText(functionName, detail)}</dd>
          <dt className="text-[#a1a1a6]">Expected</dt>
          <dd className="break-all">{toPy(detail.expected)}</dd>
          {result.actual !== undefined && (
            <>
              <dt className="text-[#a1a1a6]">Returned</dt>
              <dd className={`break-all ${result.status === "PASS" ? "text-[#30d158]" : "text-[#ff6961]"}`}>{result.actual}</dd>
            </>
          )}
          {result.stdout && (
            <>
              <dt className="text-[#a1a1a6]">Printed</dt>
              <dd className="whitespace-pre-wrap break-all text-[#d1d1d6]">{result.stdout}</dd>
            </>
          )}
        </dl>
      )}
      {detail?.steps && result.status === "FAIL" && (
        <p className="mt-3 text-sm text-[#ffd60a]">Expected and Returned list what each method call gave back, in order, after the object was created.</p>
      )}
      {detail && !detail.steps && result.status === "FAIL" && result.actual === "None" && detail.expected !== null && (
        <p className="mt-3 text-sm text-[#ffd60a]">Your function returned None. Did you forget a return statement, or print the answer instead of returning it?</p>
      )}
      {detail && result.status === "TIMEOUT" && <p className="mt-3 text-sm text-[#ffd60a]">Your code ran for too long on this test. Look for a loop that never ends.</p>}
      {detail && result.error && <pre className="mt-3 whitespace-pre-wrap break-words font-mono text-[13px] text-[#ff6961]">{result.error}</pre>}
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
      <p className={`font-medium ${good ? "text-[#30d158]" : "text-[#ff6961]"}`}>{text}</p>
      {outcome.loadError && <pre className="mt-3 whitespace-pre-wrap break-words font-mono text-[13px] text-[#ff6961]">{outcome.loadError}</pre>}
      <ul className="mt-3 space-y-2">
        {rows.map(({ result, number, test }) => (
          <Row key={result.index} result={result} test={test} functionName={functionName} number={number} />
        ))}
      </ul>
    </div>
  );
}
