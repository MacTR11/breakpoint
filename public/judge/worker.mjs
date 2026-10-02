// Runs a student's code in their own browser for the "Run" button, using the
// same harness the server uses when they press "Submit". The debugger and the
// console use the tracer instead, which marks nothing.
import { loadPyodide } from "/pyodide/pyodide.mjs";
import { HARNESS, runTests } from "./harness.mjs";
import { runTrace } from "./tracer.mjs";

const ready = loadPyodide({ indexURL: "/pyodide/", stdout: () => {}, stderr: () => {} });
ready.then(
  () => self.postMessage({ type: "ready" }),
  (error) => self.postMessage({ type: "fatal", error: String(error) }),
);

self.onmessage = async (message) => {
  const pyodide = await ready;
  const job = message.data;
  if (job.kind === "trace" || job.kind === "console") {
    let result;
    try {
      result = runTrace(pyodide, HARNESS, job);
    } catch (error) {
      result = { ok: false, steps: [], result: null, stdout: "", error: String(error), truncated: false };
    }
    self.postMessage({ type: "trace", id: job.id, result });
    return;
  }
  await runTests(pyodide, job, (event) => self.postMessage(event));
};
