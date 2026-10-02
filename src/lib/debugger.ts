import { foldGutter } from "@codemirror/language";
import { Decoration, EditorView, gutter, GutterMarker, gutterLineClass, keymap, lineNumbers } from "@codemirror/view";
import { ExternalChange, RangeSet, StateEffect, StateField, type EditorState, type Extension } from "@uiw/react-codemirror";

// The debugger's part of the editor: breakpoints, which are the site's own mark
// (a red dot beside a line), and the line a step-through has reached. The
// stepping itself is src/lib/trace.ts and src/components/debug-panel.tsx.

const toggle = StateEffect.define<number>();
const showLine = StateEffect.define<number | null>();

const dot = new (class extends GutterMarker {
  toDOM() {
    const span = document.createElement("span");
    span.className = "cm-breakpoint-dot";
    return span;
  }
})();
const here = new (class extends GutterMarker {
  elementClass = "cm-debug-gutter";
})();
const hereLine = Decoration.line({ class: "cm-debug-line" });

/** One dot per line, at the start of each line that has one. */
const breakpoints = StateField.define<RangeSet<GutterMarker>>({
  create: () => RangeSet.empty,
  update(set, tr) {
    if (tr.docChanged) {
      const lines: number[] = [];
      if (tr.annotation(ExternalChange)) {
        // The whole draft was replaced (Reset, or a change in another tab): keep the same line numbers.
        set.between(0, tr.startState.doc.length, (from) => void lines.push(tr.startState.doc.lineAt(from).number));
      } else {
        // An edit: the dots move with their lines, and two that end up on one line become one.
        set.map(tr.changes).between(0, tr.state.doc.length, (from) => void lines.push(tr.state.doc.lineAt(from).number));
      }
      const kept = [...new Set(lines)].filter((n) => n <= tr.state.doc.lines).sort((a, b) => a - b);
      set = RangeSet.of(kept.map((n) => dot.range(tr.state.doc.line(n).from)));
    }
    for (const effect of tr.effects) {
      if (!effect.is(toggle)) continue;
      const pos = effect.value;
      let on = false;
      set.between(pos, pos, () => void (on = true));
      set = on ? set.update({ filter: (from) => from !== pos }) : set.update({ add: [dot.range(pos)] });
    }
    return set;
  },
});

/** The line a step-through has reached. Editing the code clears it, since the run no longer matches. */
const reached = StateField.define<number | null>({
  create: () => null,
  update(line, tr) {
    let next = tr.docChanged ? null : line;
    for (const effect of tr.effects) if (effect.is(showLine)) next = effect.value;
    return next !== null && next >= 1 && next <= tr.state.doc.lines ? next : null;
  },
  provide: (field) => [
    EditorView.decorations.compute([field], (state) => {
      const line = state.field(field);
      return line === null ? Decoration.none : Decoration.set([hereLine.range(state.doc.line(line).from)]);
    }),
    gutterLineClass.compute([field], (state) => {
      const line = state.field(field);
      return line === null ? RangeSet.empty : RangeSet.of([here.range(state.doc.line(line).from)]);
    }),
  ],
});

const toggleAt = (view: EditorView, pos: number) => {
  view.dispatch({ effects: toggle.of(view.state.doc.lineAt(pos).from) });
  return true;
};

/** The line numbers of every breakpoint, in order. */
export function breakpointLines(state: EditorState) {
  const lines: number[] = [];
  state.field(breakpoints, false)?.between(0, state.doc.length, (from) => void lines.push(state.doc.lineAt(from).number));
  return lines;
}

/** Mark the line a step-through has reached (or none), scrolling it into view. */
export function reachLine(view: EditorView, line: number | null) {
  const effects: StateEffect<unknown>[] = [showLine.of(line)];
  if (line !== null && line >= 1 && line <= view.state.doc.lines) effects.push(EditorView.scrollIntoView(view.state.doc.line(line).from, { y: "nearest" }));
  view.dispatch({ effects });
}

/**
 * The editor's gutter, with breakpoints: click beside a line number (or the
 * number itself), or press F9, to add or remove one. Use instead of the basic
 * setup's line numbers and fold gutter, so the dots come first.
 */
export function debuggerExtensions(onBreakpoints: (lines: number[]) => void): Extension[] {
  let last = "";
  return [
    breakpoints,
    reached,
    gutter({
      class: "cm-breakpoint-gutter",
      markers: (view) => view.state.field(breakpoints),
      initialSpacer: () => dot,
      renderEmptyElements: true,
      domEventHandlers: { mousedown: (view, line) => toggleAt(view, line.from) },
    }),
    lineNumbers({ domEventHandlers: { mousedown: (view, line) => toggleAt(view, line.from) } }),
    foldGutter(),
    keymap.of([{ key: "F9", run: (view) => toggleAt(view, view.state.selection.main.head) }]),
    EditorView.updateListener.of((update) => {
      const lines = breakpointLines(update.state);
      if (lines.join() !== last) {
        last = lines.join();
        onBreakpoints(lines);
      }
    }),
  ];
}
