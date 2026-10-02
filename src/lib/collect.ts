import { grade } from "../../public/judge/harness.mjs";
import { overallStatus, type JudgeEvent, type JudgeOutcome, type TestCase, type TestResult } from "./types";

export const LOAD_TIMEOUT_MESSAGE = "Your code took too long to load. Is there a loop running outside your function?";

/**
 * Builds a JudgeOutcome from the stream of harness events. Used by both the
 * server judge and the in-browser runner so they report results identically.
 */
export function createCollector(tests: TestCase[]) {
  const results: TestResult[] = [];
  let loadError: string | undefined;
  let loaded = false;
  let current: number | null = null;

  return {
    /** Returns true once the run has finished. */
    handle(event: JudgeEvent): boolean {
      if (event.type === "load") {
        loaded = true;
        if (!event.ok) loadError = event.error ?? "Your code could not be loaded.";
      }
      if (event.type === "start") current = event.index;
      if (event.type === "test") {
        current = null;
        results.push(grade(event, tests[event.index].expected) as TestResult);
      }
      return event.type === "done";
    },

    /** `reason` says why the run stopped: normally, on a timer, or because the interpreter died. */
    outcome(reason: "done" | "timeout" | "crash"): JudgeOutcome {
      if (!loaded && reason === "timeout") loadError = LOAD_TIMEOUT_MESSAGE;
      if (!loaded && reason === "crash") loadError = "Your code crashed the Python interpreter while loading.";
      if (loadError !== undefined) return { status: "ERROR", loadError, results: [] };
      for (let index = results.length; index < tests.length; index++) {
        if (index !== current) results.push({ index, status: "SKIPPED" });
        else if (reason === "timeout") results.push({ index, status: "TIMEOUT" });
        // Dying mid-test is almost always memory exhaustion.
        else results.push({ index, status: "ERROR", error: "Your code crashed the Python interpreter (it may have run out of memory)." });
      }
      const marked = results.map((r) => ({ ...r, hidden: Boolean(tests[r.index].hidden) }));
      return { status: overallStatus(marked), results: marked };
    },
  };
}
