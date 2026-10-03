"use client";

import { cursorCharLeft, cursorCharRight, indentLess, indentMore, redo, undo } from "@codemirror/commands";
import type { EditorView } from "@codemirror/view";
import { useEffect, useState, type RefObject } from "react";

// Typing code on a phone. When the code editor gets the cursor on a touch
// screen narrower than the two-column layout, the editor panel fills exactly
// the part of the screen the keyboard leaves visible: Run and Done along the
// top, the code in the middle, and a row of Python keys at the bottom, just
// above the keyboard. Nothing can end up hidden behind the keyboard or the
// browser's own bars, and the page cannot be scrolled out from under it.

/** A touch screen narrower than the two-column layout: a phone, or a tablet held upright. */
export function usePhone() {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse) and (max-width: 1023px)");
    const sync = () => setPhone(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return phone;
}

/** The visible part of the screen while typing on a phone, or null when not typing. */
export function useTypingMode(editor: RefObject<EditorView | null>, phone: boolean) {
  const [focused, setFocused] = useState(false);
  const [frame, setFrame] = useState<{ top: number; height: number } | null>(null);

  useEffect(() => {
    const onFocus = () => setFocused(Boolean(editor.current?.hasFocus));
    // Focus has not settled when focusout fires, so look a moment later.
    const onBlur = () => setTimeout(onFocus, 0);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("focusout", onBlur);
    return () => {
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("focusout", onBlur);
    };
  }, [editor]);

  const typing = phone && focused;

  // Follow the visible area as the keyboard opens, closes or changes height.
  useEffect(() => {
    if (!typing) return;
    const viewport = window.visualViewport;
    const place = () => setFrame({ top: viewport?.offsetTop ?? 0, height: viewport?.height ?? window.innerHeight });
    place();
    viewport?.addEventListener("resize", place);
    viewport?.addEventListener("scroll", place);
    document.documentElement.classList.add("typing-code");
    return () => {
      viewport?.removeEventListener("resize", place);
      viewport?.removeEventListener("scroll", place);
      document.documentElement.classList.remove("typing-code");
    };
  }, [typing]);

  return typing && frame ? frame : null;
}

type Key = { label: string; name: string; run: (view: EditorView) => void; kind?: "action" };

/** Types `text` at the cursor, as if from the keyboard (so it counts as typed, not pasted). */
const type = (text: string) => (view: EditorView) => {
  const { from, to } = view.state.selection.main;
  view.dispatch({ changes: { from, to, insert: text }, selection: { anchor: from + text.length }, scrollIntoView: true, userEvent: "input.type" });
};

const command = (run: (view: EditorView) => boolean) => (view: EditorView) => {
  run(view);
};

const KEYS: Key[] = [
  { label: "⇥", name: "Indent", run: command(indentMore), kind: "action" },
  { label: "⇤", name: "Outdent", run: command(indentLess), kind: "action" },
  { label: "←", name: "Move left", run: command(cursorCharLeft), kind: "action" },
  { label: "→", name: "Move right", run: command(cursorCharRight), kind: "action" },
  ...[":", "(", ")", "[", "]", "=", "_", '"', "'", "#", ",", ".", "<", ">", "+", "-", "*", "/", "%", "!", "{", "}"].map((symbol) => ({ label: symbol, name: `Type ${symbol}`, run: type(symbol) })),
  { label: "↶", name: "Undo", run: command(undo), kind: "action" },
  { label: "↷", name: "Redo", run: command(redo), kind: "action" },
];

/** The row of Python keys shown at the bottom of the editor while typing on a phone. */
export function MobileKeys({ editor }: { editor: RefObject<EditorView | null> }) {
  return (
    <div className="mobile-keys" role="toolbar" aria-label="Python keys">
      {KEYS.map((key) => (
        <button
          key={key.name}
          type="button"
          aria-label={key.name}
          data-kind={key.kind}
          // Acting on press, and cancelling the press, keeps the cursor in the
          // editor, so the keyboard stays open.
          onPointerDown={(event) => {
            event.preventDefault();
            const view = editor.current;
            if (!view) return;
            key.run(view);
            view.focus();
          }}
          onMouseDown={(event) => event.preventDefault()}
        >
          {key.label}
        </button>
      ))}
    </div>
  );
}
