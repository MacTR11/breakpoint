"use client";

import { useEffect, useRef, useState } from "react";
import { isQuack, QUACK } from "@/lib/eggs";
import { consoleInBrowser } from "@/lib/py-runner";
import type { ConsoleResult } from "@/lib/trace";

// A Python prompt beside the editor: call your own code with any input you like.
// It loads the code as it is now, and keeps what you make here until the code
// changes. Nothing here is marked.

type Entry = { kind: "run"; source: string; result: ConsoleResult } | { kind: "reloaded" };

const muted = "text-[#9198a1]";

export function ConsolePanel({ code, examples, disabled, onBusy }: { code: string; examples: string[]; disabled: boolean; onBusy: (busy: boolean) => void }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  // Where ↑ and ↓ have got to in the history, or null when typing something new.
  const [browsing, setBrowsing] = useState<number | null>(null);
  const loaded = useRef<string | null>(null);
  const end = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);

  // Keep the newest line in view, scrolling only the panel and never the page.
  useEffect(() => {
    const box = end.current?.closest(".overflow-y-auto");
    if (box && entries.length) box.scrollTop = box.scrollHeight;
  }, [entries]);

  const run = async (sources: string[]) => {
    const lines = sources.map((s) => s.trim()).filter(Boolean);
    if (lines.length === 0) return;
    onBusy(true);
    const added: Entry[] = [];
    // The console starts afresh whenever the code has changed since the last line.
    if (loaded.current !== null && loaded.current !== code) added.push({ kind: "reloaded" });
    loaded.current = code;
    for (const source of lines) {
      const result: ConsoleResult = isQuack(source) ? { ok: true, result: null, stdout: QUACK, error: null } : await consoleInBrowser(code, source);
      added.push({ kind: "run", source, result });
    }
    setEntries((now) => [...now, ...added].slice(-200));
    setHistory((now) => [...now.filter((s) => !lines.includes(s)), ...lines].slice(-50));
    setBrowsing(null);
    onBusy(false);
  };

  const recall = (step: -1 | 1) => {
    if (history.length === 0) return;
    const at = browsing === null ? (step === -1 ? history.length - 1 : null) : browsing + step;
    if (at === null || at >= history.length) {
      setBrowsing(null);
      setInput("");
    } else {
      const index = Math.max(0, at);
      setBrowsing(index);
      setInput(history[index]);
    }
  };

  return (
    <div>
      {entries.length === 0 ? (
        <p className={muted}>Call your code with any input you like, then press Enter. It uses your code as it is now, and nothing here is marked. ↑ and ↓ bring back earlier lines.</p>
      ) : (
        <div className="space-y-1">
          {entries.map((entry, i) =>
            entry.kind === "reloaded" ? (
              <p key={i} className={`border-t border-white/10 pt-1 text-xs ${muted}`}>
                Your code changed, so it was loaded again. Anything made here before has gone.
              </p>
            ) : (
              <div key={i}>
                <p className="whitespace-pre-wrap break-all">
                  <span className={muted}>&gt;&gt;&gt; </span>
                  {entry.source}
                </p>
                {entry.result.stdout && <pre className="whitespace-pre-wrap break-words text-[#c9d1d9]">{entry.result.stdout.replace(/\n$/, "")}</pre>}
                {entry.result.result !== null && <p className="whitespace-pre-wrap break-all text-[#79c0ff]">{entry.result.result}</p>}
                {entry.result.error && <pre className="whitespace-pre-wrap break-words text-[#ff7b72]">{entry.result.error}</pre>}
              </div>
            ),
          )}
        </div>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!disabled) {
            run([input]);
            setInput("");
          }
        }}
        className="mt-2 flex items-center gap-2"
      >
        <label htmlFor="console-line" className={muted}>
          &gt;&gt;&gt;
        </label>
        <input
          id="console-line"
          ref={field}
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setBrowsing(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowUp" || event.key === "ArrowDown") {
              event.preventDefault();
              recall(event.key === "ArrowUp" ? -1 : 1);
            }
          }}
          aria-label="Python line to run"
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          enterKeyHint="go"
          className="min-w-0 flex-1 bg-transparent text-[#f6f8fa] outline-none placeholder:text-[#5c6370]"
          placeholder={examples[0]?.split("\n")[0] ?? "Type some Python"}
        />
        {entries.length > 0 && (
          <button type="button" onClick={() => setEntries([])} className={`text-xs ${muted} cursor-pointer hover:text-white`}>
            Clear
          </button>
        )}
      </form>

      {examples.length > 0 && (
        <p className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className={`text-xs ${muted}`}>Try:</span>
          {examples.map((example, i) => (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => {
                run(example.split("\n"));
                field.current?.focus({ preventScroll: true });
              }}
              className="max-w-full truncate rounded-full bg-white/10 px-3 py-0.5 text-[13px] text-[#f6f8fa] enabled:cursor-pointer enabled:hover:bg-white/20 disabled:opacity-40"
            >
              {example.replace(/\n/g, "; ")}
            </button>
          ))}
        </p>
      )}
      <div ref={end} />
    </div>
  );
}
