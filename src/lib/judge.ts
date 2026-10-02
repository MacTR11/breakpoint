import { spawn } from "node:child_process";
import path from "node:path";
import { PER_TEST_TIMEOUT_MS } from "../../public/judge/harness.mjs";
import { createCollector } from "./collect";
import { toJob, type JudgeEvent, type JudgeOutcome, type TestCase } from "./types";

const STARTUP_TIMEOUT_MS = 30_000;
const MAX_CONCURRENT = Number(process.env.JUDGE_CONCURRENCY) || 4;
const START_FAILED = "The judge could not start. Please try again, and tell your teacher if it keeps happening.";

let running = 0;
const waiting: (() => void)[] = [];

async function withSlot<T>(work: () => Promise<T>): Promise<T> {
  if (running >= MAX_CONCURRENT) await new Promise<void>((resolve) => waiting.push(resolve));
  running++;
  try {
    return await work();
  } finally {
    running--;
    waiting.shift()?.();
  }
}

/**
 * Mark a student's code against every test in a locked-down child process.
 * Only the test inputs are sent to that process; answers are compared here.
 */
export function judge(code: string, functionName: string, tests: TestCase[]): Promise<JudgeOutcome> {
  return withSlot(() => runJudge(code, functionName, tests));
}

function runJudge(code: string, functionName: string, tests: TestCase[]): Promise<JudgeOutcome> {
  const root = process.cwd();
  const child = spawn(
    process.execPath,
    [
      "--permission",
      `--allow-fs-read=${path.join(root, "node_modules", "pyodide")}`,
      `--allow-fs-read=${path.join(root, "judge")}`,
      `--allow-fs-read=${path.join(root, "public", "judge")}`,
      path.join(root, "judge", "runner.mjs"),
    ],
    { env: { NODE_ENV: "production" }, stdio: ["pipe", "pipe", "pipe"] },
  );

  return new Promise((resolve) => {
    const collector = createCollector(tests);
    let started = false;
    let settled = false;
    let buffer = "";
    let stderr = "";
    let timer = setTimeout(() => finish("timeout"), STARTUP_TIMEOUT_MS);

    const finish = (reason: "done" | "timeout" | "crash") => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      child.kill("SIGKILL");
      if (!started) {
        console.error("Judge failed to start:", stderr);
        return resolve({ status: "ERROR", loadError: START_FAILED, results: [] });
      }
      resolve(collector.outcome(reason));
    };

    const handle = (event: JudgeEvent) => {
      // Once Python is up, the clock is on the student's code: first loading
      // it, then each test in turn.
      if (event.type === "ready" || event.type === "start") {
        started = true;
        clearTimeout(timer);
        timer = setTimeout(() => finish("timeout"), PER_TEST_TIMEOUT_MS);
      }
      if (collector.handle(event)) finish("done");
    };

    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (chunk: string) => {
      buffer += chunk;
      let newline;
      while ((newline = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, newline);
        buffer = buffer.slice(newline + 1);
        let event: JudgeEvent;
        try {
          event = JSON.parse(line);
        } catch {
          continue;
        }
        handle(event);
      }
    });
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk: string) => (stderr = (stderr + chunk).slice(-4000)));
    child.on("error", () => finish("crash"));
    child.on("close", () => finish("crash"));

    child.stdin.on("error", () => {});
    child.stdin.end(JSON.stringify({ code, functionName, tests: toJob(tests) }));
  });
}
