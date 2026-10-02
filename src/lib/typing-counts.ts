import { EditorView } from "@codemirror/view";
import { EditorState, type Transaction } from "@uiw/react-codemirror";
import { cleanTelemetry, LARGE_PASTE, noTelemetry, type Telemetry } from "./integrity";

// Counts what is typed and what is pasted into the editor from outside, for
// one draft at a time. Kept in the browser beside the draft, and sent with
// each submission. See src/lib/integrity.ts for what the counts are for.
//
// Everything is judged on the changes CodeMirror actually makes, not on
// browser events, so a paste, a dropped file, text dropped from another page
// and a big insertion from a phone keyboard's clipboard are all caught alike.

/** More than this many characters in one go is not typing, whatever the browser calls it. */
const TYPED_AT_ONCE = 40;

// The counts are only ever added to, so the larger of each is the truest: two
// tabs on one challenge merge rather than overwrite each other's record.
const counts = new Map<string, Telemetry>();
// What was last copied, cut or dragged inside each draft's editor: putting your own code back is
// not a paste. Kept per draft, so code copied from one challenge's editor counts when pasted into another.
const copiedHere = new Map<string, string>();

function stored(key: string): Telemetry {
  try {
    return cleanTelemetry(JSON.parse(localStorage.getItem(key) ?? "null"));
  } catch {
    return noTelemetry;
  }
}

export function readCounts(key: string): Telemetry {
  const here = counts.get(key) ?? noTelemetry;
  const there = stored(key);
  return {
    pastedChars: Math.max(here.pastedChars, there.pastedChars),
    largestPaste: Math.max(here.largestPaste, there.largestPaste),
    typedChars: Math.max(here.typedChars, there.typedChars),
    seconds: Math.max(here.seconds, there.seconds),
  };
}

function change(key: string, update: (now: Telemetry) => Telemetry) {
  const next = update(readCounts(key));
  counts.set(key, next);
  try {
    localStorage.setItem(key, JSON.stringify(next));
  } catch {}
}

/** Called every few seconds while the page is in view. */
export const addSeconds = (key: string, seconds: number) => change(key, (now) => ({ ...now, seconds: now.seconds + seconds }));

/** What CodeMirror puts on the clipboard: the selected text, or with nothing selected, each cursor's whole line. */
function copiedText(state: EditorState) {
  const ranges = state.selection.ranges.filter((range) => !range.empty);
  if (ranges.length > 0) return ranges.map((range) => state.sliceDoc(range.from, range.to)).join(state.lineBreak);
  const lines = [...new Set(state.selection.ranges.map((range) => state.doc.lineAt(range.from).number))];
  return lines.map((n) => state.doc.line(n).text).join(state.lineBreak);
}

const squashed = (text: string) => text.replace(/\s+/g, "");

/** Whether a change brought text in from outside the editor (and how much), or was typed. */
function sizeUp(transaction: Transaction, key: string): { outside: boolean; size: number } | null {
  if (!transaction.docChanged) return null;
  let text = "";
  transaction.changes.iterChanges((_fromA, _toA, _fromB, _toB, inserted) => {
    text += inserted.toString();
  });
  const size = text.trim().length;
  if (size === 0) return null;
  // Dragging your own code to a new place is "move.drop", and is neither.
  if (transaction.isUserEvent("input.paste") || transaction.isUserEvent("input.drop")) {
    const copied = copiedHere.get(key);
    return copied !== undefined && squashed(copied) === squashed(text) ? null : { outside: true, size };
  }
  if (transaction.isUserEvent("input.type")) return size >= TYPED_AT_ONCE ? { outside: true, size } : { outside: false, size: text.length };
  return null;
}

/** The editor extensions that do the counting. With `block`, large insertions from outside are refused. */
export function trackingExtensions(key: string, block: boolean, onBlocked: (message: string) => void) {
  const remember = (_event: Event, view: EditorView) => {
    copiedHere.set(key, copiedText(view.state));
    return false;
  };
  return [
    EditorView.domEventHandlers({ copy: remember, cut: remember, dragstart: remember }),
    EditorState.transactionFilter.of((transaction) => {
      if (!block) return transaction;
      const insertion = sizeUp(transaction, key);
      if (!insertion?.outside || insertion.size < LARGE_PASTE) return transaction;
      queueMicrotask(() => onBlocked("Pasting large blocks of code from outside the editor is switched off. Type your solution here."));
      return [];
    }),
    EditorView.updateListener.of((update) => {
      for (const transaction of update.transactions) {
        const insertion = sizeUp(transaction, key);
        if (!insertion) continue;
        const { outside, size } = insertion;
        change(key, (now) => (outside ? { ...now, pastedChars: now.pastedChars + size, largestPaste: Math.max(now.largestPaste, size) } : { ...now, typedChars: now.typedChars + size }));
      }
    }),
  ];
}
