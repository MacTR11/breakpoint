// Trace tables: a program, and a table of what its variables hold as it
// runs, which the student fills in. The blank cells are marked one by one.

/** The table as the student first sees it: headings, and cells that are given or left blank (null). */
export type TraceSpec = { columns: string[]; rows: (string | null)[][] };

export function parseTraceSpec(raw: string | null): TraceSpec | null {
  try {
    const spec = JSON.parse(raw ?? "null");
    return spec && Array.isArray(spec.columns) && Array.isArray(spec.rows) ? spec : null;
  } catch {
    return null;
  }
}

export function parseTraceAnswer(raw: string | null): string[][] {
  try {
    const answer = JSON.parse(raw ?? "[]");
    return Array.isArray(answer) ? answer.map((row: unknown) => (Array.isArray(row) ? row.map(String) : [])) : [];
  } catch {
    return [];
  }
}

const number = /^-?\d+(\.\d+)?$/;

/**
 * Whether what was written in a cell matches the answer. Spaces at the ends
 * do not matter, nor do quotes around a string, nor True written as true;
 * numbers compare by value, so 5 and 5.0 are the same; and a list may be
 * written with or without spaces, with either kind of quote. An empty answer
 * means the cell should be left empty.
 */
export function sameCell(written: string, expected: string) {
  const tidy = (text: string) => text.trim().replace(/^(["'])(.*)\1$/, "$2");
  const a = tidy(written);
  const b = tidy(expected);
  if (/^[[(]/.test(b)) {
    const squash = (text: string) => text.replace(/\s+/g, "").replace(/"/g, "'");
    return squash(a) === squash(b);
  }
  if (number.test(a) && number.test(b)) return Number(a) === Number(b);
  if (/^(true|false|none)$/i.test(b)) return a.toLowerCase() === b.toLowerCase();
  return a === b;
}

/** The positions [row, column] of blank cells filled in wrongly (or left empty when they should not be). */
export function wrongCells(spec: TraceSpec, answer: string[][], written: string[][]): [number, number][] {
  const wrong: [number, number][] = [];
  spec.rows.forEach((row, r) =>
    row.forEach((given, c) => {
      if (given !== null) return;
      if (!sameCell(String(written[r]?.[c] ?? ""), answer[r]?.[c] ?? "")) wrong.push([r, c]);
    }),
  );
  return wrong;
}
