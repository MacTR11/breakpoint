import type { RunState } from "@/components/code-workspace";
import type { TestCase, TestResult, TestStatus } from "@/lib/types";
import { callText, toPy } from "../../public/judge/harness.mjs";

// One line per test, in plain words with a tick or a cross, in the editor's
// own colours. Each result arrives a beat after the one before, then the verdict.
const STEP_MS = 70;

const word: Record<TestStatus, [string, string]> = {
  PASS: ["✓ Passed", "text-[#3fb950]"],
  FAIL: ["✗ Failed", "text-[#ff7b72]"],
  ERROR: ["✗ Error", "text-[#ff7b72]"],
  TIMEOUT: ["✗ Too slow", "text-[#e5a50a]"],
  SKIPPED: ["– Not run", "text-[#9198a1]"],
};

function headline(state: NonNullable<RunState>) {
  const { outcome, source } = state;
  const passed = outcome.results.filter((r) => r.status === "PASS").length;
  const total = outcome.results.length;
  if (outcome.loadError) return { text: "Could not run your code.", good: false };
  if (outcome.status === "ACCEPTED") {
    return source === "submit" ? { text: `All ${total} tests passed.`, good: true } : { text: `All ${total} examples passed. Submit to run the hidden tests.`, good: true };
  }
  if (outcome.status === "TIMEOUT") return { text: `Ran out of time. ${passed} of ${total} passed.`, good: false };
  return { text: `${passed} of ${total} passed.`, good: false };
}

/**
 * A value shown beside another it should have equalled, with the part where
 * they differ washed: green in what was expected, red in what came back.
 */
function Compared({ text, other, color }: { text: string; other: string; color: string }) {
  let prefix = 0;
  while (prefix < text.length && prefix < other.length && text[prefix] === other[prefix]) prefix++;
  let suffix = 0;
  while (suffix < text.length - prefix && suffix < other.length - prefix && text[text.length - 1 - suffix] === other[other.length - 1 - suffix]) suffix++;
  if (text === other || prefix + suffix === 0) return <>{text}</>;
  const middle = text.slice(prefix, text.length - suffix);
  return (
    <>
      {text.slice(0, prefix)}
      <mark className="rounded-[3px] text-inherit" style={{ background: `color-mix(in srgb, ${color} 28%, transparent)` }} title={middle ? undefined : "Something is missing here"}>
        {middle || "‸"}
      </mark>
      {text.slice(text.length - suffix)}
    </>
  );
}

function Row({ result, test, functionName, number, delay }: { result: TestResult; test?: TestCase; functionName: string; number: number; delay: number }) {
  const detail = test && !result.hidden ? test : null;
  const [label, color] = word[result.status];
  // A test that never ran has nothing to compare, so it gets no detail.
  const failed = result.status !== "PASS" && result.status !== "SKIPPED";
  return (
    <li className="rise" style={{ animationDelay: `${delay}ms` }}>
      <p>
        <span className={`inline-block w-[5.75rem] font-semibold ${color}`}>{label}</span>
        {result.hidden ? `hidden ${number}` : `example ${number}`}
        {detail && !detail.steps && <span className="text-[#9198a1]"> {callText(functionName, detail)}</span>}
      </p>
      {detail && result.status !== "SKIPPED" && (failed || detail.steps) && (
        <dl className="mb-2 grid grid-cols-[4.5rem_1fr] gap-x-2 pl-[5.75rem] text-[#9198a1]">
          {detail.steps && (
            <>
              <dt>calls</dt>
              <dd className="whitespace-pre-wrap break-all text-[#f6f8fa]">{callText(functionName, detail)}</dd>
            </>
          )}
          {failed && (
            <>
              <dt>expected</dt>
              <dd className="break-all text-[#f6f8fa]">
                {result.actual === undefined ? toPy(detail.expected) : <Compared text={toPy(detail.expected)} other={result.actual} color="#3fb950" />}
              </dd>
            </>
          )}
          {failed && result.actual !== undefined && (
            <>
              <dt>returned</dt>
              <dd className="break-all text-[#ff7b72]">
                <Compared text={result.actual} other={toPy(detail.expected)} color="#ff7b72" />
              </dd>
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
        <p className="mb-2 pl-[5.75rem] text-[#e5a50a]">Your function returned None. Did you forget a return statement, or print the answer instead of returning it?</p>
      )}
      {detail?.steps && result.status === "FAIL" && <p className="mb-2 pl-[5.75rem] text-[#e5a50a]">expected and returned list what each method call gave back, in order.</p>}
      {detail && result.status === "TIMEOUT" && <p className="mb-2 pl-[5.75rem] text-[#e5a50a]">The code ran for too long on this test. Look for a loop that never ends.</p>}
      {detail && result.error && <pre className="mb-2 whitespace-pre-wrap break-words pl-[5.75rem] text-[#ff7b72]">{result.error}</pre>}
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
      {outcome.loadError && <pre className="mt-1 whitespace-pre-wrap break-words text-[#ff7b72]">{outcome.loadError}</pre>}
      <ul className="mt-1">
        {rows.map(({ result, number, test }, index) => (
          <Row key={result.index} result={result} test={test} functionName={functionName} number={number} delay={index * STEP_MS} />
        ))}
      </ul>
      <p className={`rise ${good ? "text-[#3fb950]" : "text-[#ff7b72]"}`} style={{ animationDelay: `${rows.length * STEP_MS}ms` }}>
        {text}
      </p>
    </div>
  );
}
