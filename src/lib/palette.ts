// The command palette (Ctrl K, or ⌘K on a Mac): what it can find, and how a
// search is scored. No database here, so `npm run check` can test it.

export type PaletteGroup = "Pages" | "Challenges" | "Competitions" | "Homework" | "Students" | "Classes";

export type PaletteItem = {
  group: PaletteGroup;
  title: string;
  /** A second line: the topic and status of a challenge, a student's class, and so on. */
  detail: string;
  href: string;
  /** The small coloured square in front: a word of code (or initials) on a colour. */
  icon: { text: string; color: string };
};

/** The order groups are listed in. */
export const PALETTE_GROUPS: PaletteGroup[] = ["Pages", "Challenges", "Competitions", "Homework", "Students", "Classes"];

const wordStart = (text: string, at: number) => at === 0 || /[^a-z0-9]/.test(text[at - 1]);

/**
 * How well `text` matches `query`: higher is better, null for no match. The
 * whole query appearing in the text beats every word appearing, which beats
 * the letters appearing in order (so "lsrch" finds "Linear search"). Matches
 * at the start of a word count for more.
 */
export function matchScore(query: string, text: string): number | null {
  const q = query.toLowerCase().trim().replace(/\s+/g, " ");
  const t = text.toLowerCase();
  if (!q) return 0;
  const at = t.indexOf(q);
  if (at >= 0) return 3000 + (wordStart(t, at) ? 500 : 0) - at - t.length / 100;
  const words = q.split(" ");
  if (words.length > 1 && words.every((word) => t.includes(word))) return 2000 - t.length / 100;
  let from = 0;
  let score = 1000;
  let previous = -2;
  for (const letter of q.replace(/ /g, "")) {
    const found = t.indexOf(letter, from);
    if (found < 0) return null;
    score += (found === previous + 1 ? 8 : 0) + (wordStart(t, found) ? 12 : 0) - Math.min(found - from, 12);
    previous = found;
    from = found + 1;
  }
  return score;
}

/**
 * The best matches for a query, at most `perGroup` from each group. Groups come
 * in the order of their best match, so a student called Ada comes before a
 * page that only has the letters a, d, a in order. Once anything contains the
 * query itself, letters-in-order matches are left out.
 */
export function search(items: PaletteItem[], query: string, perGroup = 6) {
  const scored = items
    .map((item) => {
      const title = matchScore(query, item.title);
      const detail = matchScore(query, item.detail);
      // A match in the second line counts, but for less than one in the title.
      const score = Math.max(title ?? -Infinity, detail === null ? -Infinity : detail - 1000);
      return { item, score };
    })
    .filter(({ score }) => score > -Infinity)
    .sort((a, b) => b.score - a.score);
  const floor = (scored[0]?.score ?? 0) >= 3000 ? 2000 : -Infinity;
  const kept = scored.filter(({ score }) => score >= floor);
  return PALETTE_GROUPS.map((group) => kept.filter(({ item }) => item.group === group).slice(0, perGroup))
    .filter((list) => list.length > 0)
    .sort((a, b) => b[0].score - a[0].score)
    .flatMap((list) => list.map(({ item }) => item));
}
