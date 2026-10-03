// Client-side: the events the Easter eggs listen for (src/components/easter-eggs.tsx).
export const ANTIGRAVITY_EVENT = "breakpoint:antigravity";
export const TOAST_EVENT = "breakpoint:toast";

/** A short message near the bottom of the screen for a few seconds. */
export const toast = (text: string) => window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: text }));

/** Python's oldest joke: `import antigravity` opens a comic about flying. Here the letters fly instead. */
export const usesAntigravity = (code: string) => /^\s*import\s+antigravity\b/m.test(code);

// A few lines from the Zen of Python, the poem `import this` prints.
const ZEN = [
  "Beautiful is better than ugly.",
  "Simple is better than complex.",
  "Readability counts.",
  "Errors should never pass silently.",
  "Now is better than never.",
  "If the implementation is hard to explain, it's a bad idea.",
];

/** What running this code earns, beyond its results: Python's own jokes, noticed. */
export function codeEgg(code: string): string | null {
  if (/^\s*import\s+this\b/m.test(code)) return `The Zen of Python says: ${ZEN[Math.floor(Math.random() * ZEN.length)]}`;
  if (/^\s*from\s+__future__\s+import\s+braces\b/m.test(code)) return "Python will never use braces for blocks. It says so itself: not a chance.";
  if (/^\s*import\s+__hello__\b/m.test(code)) return "Hello world! Python keeps that one in its standard library, just in case.";
  if (/\bspam\b/.test(code) && /\beggs\b/.test(code)) return "Spam and eggs: Python is named after Monty Python, not the snake, and its examples have been full of spam ever since.";
  if (/while\s+True\s*:\s*\n\s*pass\b/.test(code)) return "A loop that runs for ever and does nothing. Some would call it the purest program there is.";
  return null;
}

/** Switches light or dark, and remembers it, as the button in the account menu does. */
export function setTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  try {
    localStorage.setItem("theme", dark ? "dark" : "light");
  } catch {}
}

// Words typed into the search box that do something other than search. A few
// also switch the theme.
type Secret = { text: string; theme?: "dark" | "light" };
const SECRET_WORDS: [RegExp, string | Secret][] = [
  [/^sudo\b/, "Nice try. You are not in the sudoers file. This incident will be reported."],
  [/^xyzzy$/, "Nothing happens."],
  [/^hello,? world!?$/, "Hello. It's every programmer's first program, and it never gets old."],
  [/^42$/, "The answer. Now, what was the question?"],
  [/^rm -rf\b/, "Nothing was deleted. Nothing ever will be, from in here."],
  [/^(coffee|make coffee|tea|make tea)$/, "418: I'm a teapot."],
  [/^ls$/, "awards/  homework/  practice/  secrets.txt (permission denied)"],
  [/^(exit|quit|:q!?)$/, "There is no escape. Try Escape."],
  [/^konami$/, "You'll need the arrow keys for that one. And a B. And an A."],
  [/^hack( the planet)?$/, "Access granted. (It always was: you're signed in.)"],
  [/^(the )?dark side$/, { text: "Welcome to the dark side.", theme: "dark" }],
  [/^(the )?light side$/, { text: "Back in the light.", theme: "light" }],
  [/^git push (-f|--force)\b/, "Somewhere, someone just lost an afternoon's work."],
  [/^seg(mentation )?fault$/, "Python doesn't do those. One of its kindnesses."],
  [/^help$/, "Stuck? Try a hint, step through it in the Debugger, or explain it to the duck: quack() in the Console."],
  [/^please$/, "Since you asked nicely: you're doing better than you think."],
];

/** The joke for a secret word typed into the search box, if it is one, and any theme it switches to. */
export function secretWord(query: string): Secret | null {
  const found = SECRET_WORDS.find(([pattern]) => pattern.test(query.trim().toLowerCase()))?.[1];
  if (!found) return null;
  return typeof found === "string" ? { text: found } : found;
}

/** In the console, `quack()` calls a rubber duck, the oldest debugging tool there is. */
export const isQuack = (source: string) => /^quack\(\s*\)$/.test(source.trim());
export const QUACK = "Quack. Explain your code to me, one line at a time. Most bugs give themselves up halfway through.";
