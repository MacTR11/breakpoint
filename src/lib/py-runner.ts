// Client-side: runs Python in a web worker for the "Run" button.
import { PER_TEST_TIMEOUT_MS } from "../../public/judge/harness.mjs";
import { createCollector } from "./collect";
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
