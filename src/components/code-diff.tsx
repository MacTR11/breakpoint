import { diffLines, diffSize, folded, type DiffRow } from "@/lib/diff";
import { highlight } from "@/lib/highlight";

/** One line, syntax-coloured, with the changed part of it (if marked) washed more strongly. */
function DiffText({ row }: { row: DiffRow }) {
  const [from, to] = row.change ?? [0, 0];
  const out: React.ReactNode[] = [];
  let at = 0;
  for (const [text, className] of highlight(row.text)) {
    // Split each token where the changed part starts and ends.
    for (const [start, end] of [
      [at, Math.min(at + text.length, Math.max(at, from))],
      [Math.max(at, from), Math.min(at + text.length, to)],
      [Math.max(at, to), at + text.length],
    ]) {
      if (end <= start) continue;
      const piece = text.slice(start - at, end - at);
      const inChange = start >= from && end <= to && to > from;
      const styled = className ? <span className={className}>{piece}</span> : piece;
      out.push(inChange ? <mark key={out.length}>{styled}</mark> : <span key={out.length}>{styled}</span>);
    }
    at += text.length;
  }
  return <>{out}</>;
}

/**
 * What changed between two versions of some code, a line at a time: lines
 * taken out on a red wash, lines put in on a green one, and within a line
 * changed in place, the part that differs washed more strongly.
 */
export function CodeDiff({ before, after, fileName }: { before: string; after: string; fileName: string }) {
  const rows = diffLines(before, after);
  const { removed, added } = diffSize(rows);
  return (
    <div className="overflow-hidden rounded-[14px] border border-line">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-paper px-3 py-1.5">
        <span className="font-mono text-[13px] text-muted">{fileName}</span>
        <span className="text-xs text-muted">{removed === 0 && added === 0 ? "No lines changed" : `${removed} line${removed === 1 ? "" : "s"} out, ${added} in`}</span>
      </div>
      <pre className="overflow-x-auto py-3 font-mono text-sm leading-6">
        {folded(rows).map((row, index) =>
          row.kind === "fold" ? (
            <span key={index} className="diff-line text-muted" data-kind="fold">
              <span className="diff-mark" aria-hidden="true">
                ⋯
              </span>
              {row.count} unchanged line{row.count === 1 ? "" : "s"}
            </span>
          ) : (
            <span key={index} className="diff-line" data-kind={row.kind}>
              <span className="diff-mark" aria-hidden="true">
                {row.kind === "removed" ? "−" : row.kind === "added" ? "+" : ""}
              </span>
              <span className="sr-only">{row.kind === "removed" ? "Taken out: " : row.kind === "added" ? "Put in: " : ""}</span>
              <DiffText row={row} />
              {row.text === "" && "​"}
            </span>
          ),
        )}
      </pre>
    </div>
  );
}
