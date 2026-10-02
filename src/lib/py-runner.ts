// Client-side: runs Python in a web worker for the "Run" button.
import { PER_TEST_TIMEOUT_MS } from "../../public/judge/harness.mjs";
import { createCollector } from "./collect";
import type { ConsoleResult, TraceResult } from "./trace";
import { toJob, type JudgeEvent, type JudgeOutcome, type TestCase } from "./types";

let worker: Worker | null = null;
let ready: Promise<void> | null = null;

function boot() {
  const w = new Worker("/judge/worker.mjs", { type: "module" });
  worker = w;
  ready = new Promise<void>((resolve, reject) => {
    const onMessage = (message: MessageEvent<JudgeEvent>) => {
      if (message.data.type === "ready") {
        w.removeEventListener("message", onMessage);
        resolve();
      } else if (message.data.type === "fatal") {
        reject(new Error(message.data.error));
      }
    };
    w.addEventListener("message", onMessage);
    w.addEventListener("error", () => reject(new Error("Python could not be loaded in this browser.")));
  });
  ready.catch(() => shutDown());
  return ready;
}

function shutDown() {
  worker?.terminate();
  worker = null;
  ready = null;
}

/** Start downloading Python as soon as a problem page opens. */
export function warmUp() {
  if (!worker) boot().catch(() => {});
}

export async function runInBrowser(code: string, functionName: string, tests: TestCase[]): Promise<JudgeOutcome> {
  try {
    await (ready ?? boot());
  } catch (error) {
    return { status: "ERROR", loadError: error instanceof Error ? error.message : String(error), results: [] };
  }
  const w = worker!;
  const collector = createCollector(tests);

  return new Promise((resolve) => {
    let timer = setTimeout(() => finish("timeout"), PER_TEST_TIMEOUT_MS);

    const finish = (reason: "done" | "timeout") => {
      clearTimeout(timer);
      w.removeEventListener("message", onMessage);
      // A worker stuck in an infinite loop can only be stopped by killing it.
      if (reason === "timeout") shutDown();
      resolve(collector.outcome(reason));
    };

    const onMessage = (message: MessageEvent<JudgeEvent>) => {
      if (message.data.type === "start") {
        clearTimeout(timer);
        timer = setTimeout(() => finish("timeout"), PER_TEST_TIMEOUT_MS);
      }
      if (collector.handle(message.data)) finish("done");
    };

    w.addEventListener("message", onMessage);
    w.postMessage({ code, functionName, tests: toJob(tests) });
  });
}

// The debugger and the console (public/judge/tracer.mjs). They run in the same
// worker as "Run", one job at a time, and mark nothing.

const TRACE_TIMEOUT_MS = 6000;
let nextJob = 0;

async function ask<T>(job: { kind: "trace" | "console"; code: string; source: string }): Promise<T | { failed: string; restarted?: boolean }> {
  try {
    await (ready ?? boot());
  } catch (error) {
    return { failed: error instanceof Error ? error.message : String(error) };
  }
  const w = worker!;
  const id = ++nextJob;
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      w.removeEventListener("message", onMessage);
      // Something in the code never finishes: only killing the worker stops it.
      shutDown();
      resolve({ failed: "That took too long, so it was stopped. Is there a loop that never ends?", restarted: true });
    }, TRACE_TIMEOUT_MS);
    const onMessage = (message: MessageEvent<{ type: string; id?: number; result?: T }>) => {
      if (message.data.type !== "trace" || message.data.id !== id) return;
      clearTimeout(timer);
      w.removeEventListener("message", onMessage);
      resolve(message.data.result as T);
    };
    w.addEventListener("message", onMessage);
    w.postMessage({ ...job, id });
  });
}

/** Step through `source` (a call such as `factorial(3)`, or a few statements) against the student's code. */
export async function traceInBrowser(code: string, source: string): Promise<TraceResult> {
  const result = await ask<TraceResult>({ kind: "trace", code, source });
  return "failed" in result ? { ok: false, steps: [], result: null, stdout: "", error: result.failed, truncated: false } : result;
}

/** Run one line in the console. What it defines is kept for the next line until the code changes. */
export async function consoleInBrowser(code: string, source: string): Promise<ConsoleResult> {
  const result = await ask<ConsoleResult>({ kind: "console", code, source });
  if (!("failed" in result)) return result;
  return { ok: false, result: null, stdout: "", error: result.restarted ? `${result.failed} Python was restarted, so anything made in the console has gone.` : result.failed };
}
