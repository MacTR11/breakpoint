// Runs a student's code in their own browser for the "Run" button, using the
// same harness the server uses when they press "Submit".
import { loadPyodide } from "/pyodide/pyodide.mjs";
import { runTests } from "./harness.mjs";

const ready = loadPyodide({ indexURL: "/pyodide/", stdout: () => {}, stderr: () => {} });
ready.then(
  () => self.postMessage({ type: "ready" }),
  (error) => self.postMessage({ type: "fatal", error: String(error) }),
);

self.onmessage = async (message) => {
  const pyodide = await ready;
  await runTests(pyodide, message.data, (event) => self.postMessage(event));
};
