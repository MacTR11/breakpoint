// Server-side judge process. Spawned once per submission by src/lib/judge.ts with
// Node's permission model switched on (no file writes, no child processes, no
// workers). Reads one JSON job on stdin and writes one JSON event per line.
//
// The job contains test *inputs* only. Expected answers stay in the parent
// process, so student code has nothing to read them from.
import { constants as fsConstants } from "node:fs";
import { loadPyodide } from "pyodide";
import { runTests } from "../public/judge/harness.mjs";

const emit = (event) => process.stdout.write(JSON.stringify(event) + "\n");

let input = "";
process.stdin.setEncoding("utf8");
for await (const chunk of process.stdin) input += chunk;
const job = JSON.parse(input);

// Pyodide's startup reads file-open flags through process.binding, which the
// permission model blocks. Give it just those constants from the public fs API.
process.binding = (name) => {
  if (name === "constants") return { fs: fsConstants };
  throw new Error("process.binding is disabled");
};

const pyodide = await loadPyodide({ stdout: () => {}, stderr: () => {} });

// Belt and braces on top of the Python-side import block: remove network access
// from the JS global scope before any student code runs.
for (const name of ["fetch", "WebSocket", "XMLHttpRequest", "EventSource"]) {
  try {
    delete globalThis[name];
  } catch {}
}
process.getBuiltinModule = undefined;
process.binding = undefined;

emit({ type: "ready" });
await runTests(pyodide, job, emit);
process.exit(0);
