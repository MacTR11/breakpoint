// Browser only: steps through a student's own code for the debugger, and runs
// single calls for the console. Nothing here marks anything: marking stays in
// harness.mjs. Only the student's code and calls they type (or the visible
// examples) ever reach this, so no hidden test can leak through it.

export const TRACER = `
import sys, io, json, types, reprlib, linecache, traceback

class _StepLimit(BaseException):
    pass

class _Tracer:
    FILENAME = "solution.py"
    MAX_STEPS = 600
    MAX_FRAMES = 8
    MAX_LOCALS = 12

    def __init__(self):
        r = reprlib.Repr()
        r.maxstring = 60
        r.maxother = 60
        r.maxlist = 24
        r.maxtuple = 24
        r.maxset = 10
        r.maxdict = 8
        r.maxlevel = 3
        self._repr = r.repr
        self.console_ns = None
        self.console_code = None
        self._ids = {}
        self._next = 0

    def shown(self, value, depth=0):
        # An object of a class the student wrote, without its own __repr__, is
        # shown by its attributes: Stack(items=[3]) rather than <Stack object at 0x...>.
        try:
            kind = type(value)
            if kind.__module__ == "solution" and kind.__repr__ is object.__repr__ and hasattr(value, "__dict__"):
                if depth >= 2:
                    return kind.__name__ + "(...)"
                parts = [k + "=" + self.shown(v, depth + 1) for k, v in list(vars(value).items())[:6]]
                return kind.__name__ + "(" + ", ".join(parts) + ")"
            return self._repr(value)
        except BaseException:
            return "<unprintable>"

    def _error(self, exc):
        if isinstance(exc, SyntaxError):
            return "".join(traceback.format_exception_only(type(exc), exc)).strip()
        frames = [f for f in traceback.extract_tb(exc.__traceback__) if f.filename in (self.FILENAME, "<call>")]
        lines = []
        if frames:
            lines.append("Traceback (most recent call last):")
            lines.extend(l.rstrip("\\n") for l in traceback.format_list(frames[-6:]))
        lines.append("".join(traceback.format_exception_only(type(exc), exc)).strip())
        return "\\n".join(lines)[:3000]

    def _load(self, code):
        linecache.cache[self.FILENAME] = (len(code), None, code.splitlines(True), self.FILENAME)
        ns = {"__name__": "solution"}
        exec(compile(code, self.FILENAME, "exec"), ns)
        return ns

    def _locals(self, frame):
        out = []
        for name, value in list(frame.f_locals.items()):
            if name.startswith("__") or isinstance(value, (types.FunctionType, types.ModuleType, type, types.BuiltinFunctionType, types.MethodType)):
                continue
            out.append([name, self.shown(value)])
            if len(out) >= self.MAX_LOCALS:
                break
        return out

    def _id(self, frame):
        # Each call gets its own number, so two calls of one function can be told apart.
        key = id(frame)
        if key not in self._ids:
            self._next += 1
            self._ids[key] = self._next
        return self._ids[key]

    def _stack(self, frame):
        frames = []
        f = frame
        while f is not None:
            if f.f_code.co_filename == self.FILENAME and f.f_code.co_name != "<module>":
                frames.append(f)
            f = f.f_back
        hidden = max(0, len(frames) - self.MAX_FRAMES)
        shown = frames[: self.MAX_FRAMES]
        return [{"id": self._id(f), "fn": f.f_code.co_name, "line": f.f_lineno, "locals": self._locals(f)} for f in shown], len(frames), hidden

    def _evaluate(self, source, ns):
        try:
            compiled = compile(source, "<call>", "eval")
            return True, eval(compiled, ns)
        except SyntaxError:
            exec(compile(source, "<call>", "exec"), ns)
            return False, None

    def trace(self, code, source):
        steps = []
        buf = io.StringIO()
        old = sys.stdout
        sys.stdout = buf
        result = None
        error = None
        truncated = False
        try:
            try:
                ns = self._load(code)
            except BaseException as exc:
                return json.dumps({"ok": False, "steps": [], "result": None, "stdout": buf.getvalue()[:4000], "error": self._error(exc), "truncated": False, "loadError": True})

            raising = set()
            self._ids = {}
            self._next = 0

            def tracer(frame, event, arg):
                if frame.f_code.co_filename != self.FILENAME:
                    return tracer
                if event not in ("call", "line", "return", "exception"):
                    return tracer
                # A frame left while an error is on its way out did not return: it passed the error up.
                if event == "exception":
                    raising.add(id(frame))
                elif event == "line":
                    raising.discard(id(frame))
                elif event == "return" and id(frame) in raising:
                    raising.discard(id(frame))
                    event = "unwind"
                stack, depth, hidden = self._stack(frame)
                step = {"event": event, "line": frame.f_lineno, "fn": frame.f_code.co_name, "depth": depth, "hidden": hidden, "stack": stack, "out": len(buf.getvalue())}
                if event == "return":
                    step["value"] = self.shown(arg)
                elif event == "unwind":
                    step["value"] = ""
                elif event == "exception":
                    step["value"] = arg[0].__name__
                steps.append(step)
                if event in ("return", "unwind"):
                    # The frame is finished, and Python may reuse its id for the next call.
                    self._ids.pop(id(frame), None)
                if len(steps) >= self.MAX_STEPS:
                    raise _StepLimit()
                return tracer

            sys.settrace(tracer)
            try:
                is_expr, value = self._evaluate(source, ns)
                if is_expr:
                    result = self.shown(value)
            except _StepLimit:
                truncated = True
            except BaseException as exc:
                error = self._error(exc)
            finally:
                sys.settrace(None)
        finally:
            sys.stdout = old
        return json.dumps({"ok": error is None, "steps": steps, "result": result, "stdout": buf.getvalue()[:4000], "error": error, "truncated": truncated, "loadError": False})

    def console(self, code, source):
        buf = io.StringIO()
        old = sys.stdout
        sys.stdout = buf
        result = None
        error = None
        try:
            if self.console_ns is None or self.console_code != code:
                self.console_ns = None
                self.console_code = code
                self.console_ns = self._load(code)
            is_expr, value = self._evaluate(source, self.console_ns)
            if is_expr and value is not None:
                result = self.shown(value)
        except BaseException as exc:
            error = self._error(exc)
            if self.console_ns is None:
                self.console_code = None
        finally:
            sys.stdout = old
        return json.dumps({"ok": error is None, "result": result, "stdout": buf.getvalue()[:4000], "error": error})

__tracer = _Tracer()
del _Tracer
`;

/** Run one trace or console job, after the harness has blocked the Pyodide bridge. */
export function runTrace(pyodide, harness, { kind, code, source }) {
  if (!pyodide.globals.has("__judge")) pyodide.runPython(harness);
  if (!pyodide.globals.has("__tracer")) pyodide.runPython(TRACER);
  const tracer = pyodide.globals.get("__tracer");
  return JSON.parse(kind === "console" ? tracer.console(code, source) : tracer.trace(code, source));
}
