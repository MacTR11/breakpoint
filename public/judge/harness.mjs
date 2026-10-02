// Shared by the in-browser worker (public/judge/worker.mjs) and the server-side
// judge (judge/runner.mjs) so a student's code is marked identically in both places.

export const FILENAME = "solution.py";

// Python side of the judge. Expected answers never enter Python: the student's
// code is called with JSON inputs and what it returns is handed back to JS to compare.
export const HARNESS = `
import sys, io, json, time, traceback, linecache, builtins

# Student code gets plain Python only: no bridge to the JavaScript host.
for _m in ("js", "pyodide_js", "pyodide", "pyodide.code", "pyodide.ffi", "pyodide.http", "_pyodide", "_pyodide_core"):
    sys.modules[_m] = None

def _no_input(*a, **k):
    raise RuntimeError("input() is not available here. Your function receives its data as parameters.")
builtins.input = _no_input

class _JudgeProblem(Exception):
    """A mistake worth explaining in plain words rather than with a traceback."""

class _Judge:
    FILENAME = "${FILENAME}"

    def __init__(self):
        self.ns = None

    def _default(self, o):
        if isinstance(o, (set, frozenset)):
            try:
                return sorted(o)
            except TypeError:
                return list(o)
        raise TypeError

    def _format_error(self, exc):
        if isinstance(exc, SyntaxError):
            return "".join(traceback.format_exception_only(type(exc), exc)).strip()
        frames = [f for f in traceback.extract_tb(exc.__traceback__) if f.filename == self.FILENAME]
        lines = []
        if frames:
            lines.append("Traceback (most recent call last):")
            lines.extend(l.rstrip("\\n") for l in traceback.format_list(frames[-6:]))
        lines.append("".join(traceback.format_exception_only(type(exc), exc)).strip())
        return "\\n".join(lines)[:3000]

    def load(self, code):
        linecache.cache[self.FILENAME] = (len(code), None, code.splitlines(True), self.FILENAME)
        ns = {"__name__": "solution"}
        buf = io.StringIO()
        old = sys.stdout
        sys.stdout = buf
        try:
            exec(compile(code, self.FILENAME, "exec"), ns)
            self.ns = ns
            err = None
        except BaseException as exc:
            err = self._format_error(exc)
        finally:
            sys.stdout = old
        return json.dumps({"ok": err is None, "error": err, "stdout": buf.getvalue()[:4000]})

    def _capture(self, thunk):
        buf = io.StringIO()
        old = sys.stdout
        sys.stdout = buf
        res = None
        err = None
        start = time.perf_counter()
        try:
            res = thunk()
        except _JudgeProblem as exc:
            err = str(exc)
        except BaseException as exc:
            err = self._format_error(exc)
        finally:
            sys.stdout = old
        ms = round((time.perf_counter() - start) * 1000, 1)
        try:
            res_json = json.dumps(res, default=self._default, allow_nan=False)
        except (TypeError, ValueError):
            res_json = None
        try:
            shown = repr(res)[:600]
        except BaseException:
            shown = "<unprintable>"
        return json.dumps({"ok": err is None, "result": res_json, "repr": shown,
            "stdout": buf.getvalue()[:4000], "error": err, "ms": ms})

    def call(self, fn_name, args_json):
        args = json.loads(args_json)
        def thunk():
            fn = self.ns.get(fn_name) if self.ns else None
            if not callable(fn):
                raise _JudgeProblem("The function " + fn_name + "() was not found. Keep the function name from the starter code.")
            return fn(*args)
        return self._capture(thunk)

    # steps is [[ClassName, *constructor_args], [method, *args], ...]; the result
    # is the list of what each method call returned.
    def run_steps(self, steps_json):
        steps = json.loads(steps_json)
        def thunk():
            name = steps[0][0]
            cls = self.ns.get(name) if self.ns else None
            if not isinstance(cls, type):
                raise _JudgeProblem("The class " + name + " was not found. Keep the class name from the starter code.")
            obj = cls(*steps[0][1:])
            out = []
            for step in steps[1:]:
                method = getattr(obj, step[0], None)
                if not callable(method):
                    raise _JudgeProblem(name + " has no method called " + step[0] + "().")
                out.append(method(*step[1:]))
            return out
        return self._capture(thunk)

__judge = _Judge()
del _Judge
`;

/** Compare an expected JSON value with what the student's code returned. */
export function deepEqual(expected, actual) {
  if (typeof expected === "number" && typeof actual === "number") {
    if (Number.isInteger(expected) && Number.isInteger(actual)) return expected === actual;
    return Math.abs(expected - actual) <= 1e-6 * Math.max(1, Math.abs(expected));
  }
  if (expected === null || actual === null || typeof expected !== "object" || typeof actual !== "object") {
    return expected === actual;
  }
  if (Array.isArray(expected) !== Array.isArray(actual)) return false;
  if (Array.isArray(expected)) {
    return expected.length === actual.length && expected.every((v, i) => deepEqual(v, actual[i]));
  }
  const keys = Object.keys(expected);
  return keys.length === Object.keys(actual).length && keys.every((k) => k in actual && deepEqual(expected[k], actual[k]));
}

/** Show a JSON value the way Python would print it. */
export function toPy(value) {
  if (value === null || value === undefined) return "None";
  if (value === true) return "True";
  if (value === false) return "False";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) return "[" + value.map(toPy).join(", ") + "]";
  return "{" + Object.entries(value).map(([k, v]) => JSON.stringify(k) + ": " + toPy(v)).join(", ") + "}";
}

/** The Python a test runs, as text: one call, or an object and its method calls. */
export function callText(functionName, test) {
  const args = (list) => list.map(toPy).join(", ");
  if (!test.steps) return `${functionName}(${args(test.args)})`;
  const [[className, ...initArgs], ...calls] = test.steps;
  const name = className.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
  return [`${name} = ${className}(${args(initArgs)})`, ...calls.map(([method, ...rest]) => `${name}.${method}(${args(rest)})`)].join("\n");
}

/**
 * Load the student's code and run each test, reporting progress as it goes so a
 * caller can time out a single slow test. Each test is { args } or { steps }.
 */
export async function runTests(pyodide, { code, functionName, tests }, emit) {
  // The harness blocks further Pyodide imports, so it can only be set up once
  // per interpreter (the browser worker is reused between runs).
  if (!pyodide.globals.has("__judge")) pyodide.runPython(HARNESS);
  const judge = pyodide.globals.get("__judge");
  const load = JSON.parse(judge.load(code));
  emit({ type: "load", ...load });
  if (load.ok) {
    for (let index = 0; index < tests.length; index++) {
      emit({ type: "start", index });
      const test = tests[index];
      const out = JSON.parse(test.steps ? judge.run_steps(JSON.stringify(test.steps)) : judge.call(functionName, JSON.stringify(test.args)));
      let result;
      let serialisable = out.result !== null;
      if (serialisable) {
        try {
          result = JSON.parse(out.result);
        } catch {
          serialisable = false;
        }
      }
      emit({ type: "test", index, ok: out.ok, serialisable, result, repr: out.repr, stdout: out.stdout, error: out.error, ms: out.ms });
    }
  }
  emit({ type: "done" });
}

/** Turn one "test" event into the result shown to the student. */
export function grade(event, expected) {
  const base = { index: event.index, stdout: event.stdout, ms: event.ms };
  if (!event.ok) return { ...base, status: "ERROR", error: event.error };
  const passed = event.serialisable && deepEqual(expected, event.result);
  return { ...base, status: passed ? "PASS" : "FAIL", actual: event.repr };
}

export const PER_TEST_TIMEOUT_MS = 4000;
