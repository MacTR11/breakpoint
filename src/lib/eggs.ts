// Client-side: the events the Easter eggs listen for (src/components/easter-eggs.tsx).
export const ANTIGRAVITY_EVENT = "breakpoint:antigravity";
export const TOAST_EVENT = "breakpoint:toast";

/** A short message near the bottom of the screen for a few seconds. */
export const toast = (text: string) => window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: text }));

/** Python's oldest joke: `import antigravity` opens a comic about flying. Here the letters fly instead. */
export const usesAntigravity = (code: string) => /^\s*import\s+antigravity\b/m.test(code);
