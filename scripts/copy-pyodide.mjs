// Copies the Python runtime into public/ so students' browsers load it from
// this site rather than a CDN (school web filters often block CDNs).
import { cpSync, mkdirSync } from "node:fs";
import path from "node:path";

const from = path.join(process.cwd(), "node_modules", "pyodide");
const to = path.join(process.cwd(), "public", "pyodide");
mkdirSync(to, { recursive: true });
for (const file of ["pyodide.mjs", "pyodide.asm.mjs", "pyodide.asm.wasm", "python_stdlib.zip", "pyodide-lock.json"]) {
  cpSync(path.join(from, file), path.join(to, file));
}
