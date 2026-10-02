// A line-by-line comparison of two versions of some code, for showing what a fix
// changed. Lines that only differ in trailing spaces count as the same.

export type DiffRow = {
  kind: "same" | "removed" | "added";
  text: string;
  /** For a line changed in place: the part that differs, as [start, end). */
  change?: [number, number];
};

const lines = (code: string) => code.replace(/\r\n/g, "\n").replace(/\n+$/, "").split("\n");
const same = (a: string, b: string) => a.trimEnd() === b.trimEnd();

/** Too big to compare line by line in a reasonable time: shown as all old, then all new. */
const MAX_CELLS = 400_000;

export function diffLines(before: string, after: string): DiffRow[] {
  const a = lines(before);
  const b = lines(after);
  const n = a.length;
  const m = b.length;
  if (n * m > MAX_CELLS) return [...a.map((text) => ({ kind: "removed" as const, text })), ...b.map((text) => ({ kind: "added" as const, text }))];
  // The length of the longest common run of lines from (i, j) to the end.
  const width = m + 1;
  const common = new Uint32Array((n + 1) * width);
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      common[i * width + j] = same(a[i], b[j]) ? common[(i + 1) * width + j + 1] + 1 : Math.max(common[(i + 1) * width + j], common[i * width + j + 1]);
    }
  }
  const rows: DiffRow[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (same(a[i], b[j])) {
      rows.push({ kind: "same", text: b[j] });
      i++;
      j++;
    } else if (common[(i + 1) * width + j] >= common[i * width + j + 1]) {
      rows.push({ kind: "removed", text: a[i++] });
    } else {
      rows.push({ kind: "added", text: b[j++] });
    }
  }
  while (i < n) rows.push({ kind: "removed", text: a[i++] });
  while (j < m) rows.push({ kind: "added", text: b[j++] });
  return markChanges(rows);
}

/**
 * Where a run of removed lines is followed by as many added ones, each pair is
 * one line changed in place: mark just the part that differs, when most of the
 * line stayed the same.
 */
function markChanges(rows: DiffRow[]) {
  for (let start = 0; start < rows.length; ) {
    let end = start;
    while (end < rows.length && rows[end].kind === "removed") end++;
    let after = end;
    while (after < rows.length && rows[after].kind === "added") after++;
    const removed = end - start;
    if (removed > 0 && after - end === removed) {
      for (let k = 0; k < removed; k++) {
        const old = rows[start + k];
        const now = rows[end + k];
        let prefix = 0;
        while (prefix < old.text.length && prefix < now.text.length && old.text[prefix] === now.text[prefix]) prefix++;
        let suffix = 0;
        while (suffix < old.text.length - prefix && suffix < now.text.length - prefix && old.text[old.text.length - 1 - suffix] === now.text[now.text.length - 1 - suffix]) suffix++;
        if ((prefix + suffix) * 2 >= Math.max(old.text.length, now.text.length)) {
          old.change = [prefix, old.text.length - suffix];
          now.change = [prefix, now.text.length - suffix];
        }
      }
    }
    start = Math.max(after, start + 1);
  }
  return rows;
}

/** How many lines were taken out and put in. */
export function diffSize(rows: DiffRow[]) {
  return { removed: rows.filter((r) => r.kind === "removed").length, added: rows.filter((r) => r.kind === "added").length };
}

/** Long runs of unchanged lines are folded down to a little context either side. */
export function folded(rows: DiffRow[], context = 2): (DiffRow | { kind: "fold"; count: number })[] {
  const out: (DiffRow | { kind: "fold"; count: number })[] = [];
  for (let i = 0; i < rows.length; ) {
    if (rows[i].kind !== "same") {
      out.push(rows[i++]);
      continue;
    }
    let end = i;
    while (end < rows.length && rows[end].kind === "same") end++;
    const keepStart = i === 0 ? 0 : context;
    const keepEnd = end === rows.length ? 0 : context;
    if (end - i > keepStart + keepEnd + 1) {
      out.push(...rows.slice(i, i + keepStart), { kind: "fold", count: end - i - keepStart - keepEnd }, ...rows.slice(end - keepEnd, end));
    } else {
      out.push(...rows.slice(i, end));
    }
    i = end;
  }
  return out;
}
