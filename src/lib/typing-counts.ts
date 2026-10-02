import { EditorView } from "@codemirror/view";
import { cleanTelemetry, LARGE_PASTE, noTelemetry, type Telemetry } from "./integrity";

// Counts what is typed and what is pasted into the editor from outside, for
// one draft at a time. Kept in the browser beside the draft, and sent with
// each submission. See src/lib/integrity.ts for what the counts are for.

const counts = new Map<string, Telemetry>();
// The last thing copied, cut or dragged inside the editor: putting your own code back is not a paste.
let copiedHere = "";

function save(key: string) {
  try {
    localStorage.setItem(key, JSON.stringify(counts.get(key) ?? noTelemetry));
  } catch {}
}

export function readCounts(key: string): Telemetry {
  if (!counts.has(key)) {
    try {
      counts.set(key, cleanTelemetry(JSON.parse(localStorage.getItem(key) ?? "null")));
    } catch {
      counts.set(key, noTelemetry);
    }
  }
  return counts.get(key) ?? noTelemetry;
}

function change(key: string, update: (now: Telemetry) => Telemetry) {
  counts.set(key, update(readCounts(key)));
  save(key);
}

export const resetCounts = (key: string) => change(key, () => noTelemetry);

/** Called every few seconds while the page is in view. */
export const addSeconds = (key: string, seconds: number) => change(key, (now) => ({ ...now, seconds: now.seconds + seconds }));

/** The editor extensions that do the counting. With `block`, large pastes from outside are refused. */
export function trackingExtensions(key: string, block: boolean, onBlocked: (message: string) => void) {
  const remember = (_event: Event, view: EditorView) => {
    const { from, to } = view.state.selection.main;
    copiedHere = view.state.sliceDoc(from, to);
    return false;
  };
  const incoming = (text: string, event: Event) => {
    const size = text.trim().length;
    if (size === 0 || text === copiedHere) return false;
    if (block && size >= LARGE_PASTE) {
      event.preventDefault();
      onBlocked("Pasting large blocks of code from outside the editor is switched off. Type your solution here.");
      return true;
    }
    change(key, (now) => ({ ...now, pastedChars: now.pastedChars + size, largestPaste: Math.max(now.largestPaste, size) }));
    return false;
  };
  return [
    EditorView.domEventHandlers({
      copy: remember,
      cut: remember,
      dragstart: remember,
      paste: (event) => incoming(event.clipboardData?.getData("text/plain") ?? "", event),
      drop: (event) => incoming(event.dataTransfer?.getData("text/plain") ?? "", event),
    }),
    EditorView.updateListener.of((update) => {
      for (const transaction of update.transactions) {
        if (!transaction.isUserEvent("input.type")) continue;
        let typed = 0;
        transaction.changes.iterChanges((_fromA, _toA, _fromB, _toB, inserted) => {
          typed += inserted.length;
        });
        if (typed > 0) change(key, (now) => ({ ...now, typedChars: now.typedChars + typed }));
      }
    }),
  ];
}
