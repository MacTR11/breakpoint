"use client";

import { useEffect, useState } from "react";
import { ANTIGRAVITY_EVENT, TOAST_EVENT, toast } from "@/lib/eggs";

// A few things to find. None of them changes a score.
//
// - Tap the name in the top bar five times quickly: the letters fall.
// - Run code containing `import antigravity`: the letters float away.
// - Type the Konami code (up up down down left right left right B A) on a
//   keyboard: terminal mode, for this tab, until the code is typed again.
// - Open the browser's console.

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

const calm = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Sends each letter of the name in the top bar on a short trip, then brings it home. */
function moveLetters(kind: "fall" | "float") {
  const letters = [...document.querySelectorAll<HTMLElement>("header [data-wordmark] .letter")];
  if (letters.length === 0 || calm() || letters[0].dataset.moving) return;
  // Land on the tab bar when there is one showing, otherwise the bottom of the window.
  const bar = document.querySelector<HTMLElement>(".tab-bar");
  const floor = bar && bar.offsetParent !== null ? bar.getBoundingClientRect().top : window.innerHeight;
  for (const [index, letter] of letters.entries()) {
    const top = letter.getBoundingClientRect().top;
    const distance = kind === "fall" ? floor - top - 34 : -(top + 80);
    letter.style.setProperty("--drop", `${Math.round(distance)}px`);
    letter.style.setProperty("--drift", `${Math.round((Math.random() - 0.5) * 160)}px`);
    letter.style.setProperty("--spin", `${Math.round((Math.random() - 0.5) * 120)}deg`);
    letter.style.animationDelay = `${index * 45}ms`;
    letter.dataset.moving = kind;
    letter.addEventListener("animationend", () => delete letter.dataset.moving, { once: true });
  }
}

export function EasterEggs() {
  const [note, setNote] = useState<{ id: number; text: string } | null>(null);

  useEffect(() => {
    // A quiet hello for anyone who opens the developer tools.
    try {
      if (!sessionStorage.getItem("said-hello")) {
        sessionStorage.setItem("said-hello", "1");
        console.log(
          "%c● Breakpoint hit%c\n\nLooking under the hood? Good: that is how programmers learn.\nThere are a few things hidden on this site. One of them needs a keyboard and a very old cheat code.",
          "color:#ff3b30;font:800 16px ui-rounded,system-ui,sans-serif",
          "color:inherit;font:13px ui-monospace,monospace",
        );
      }
    } catch {}

    let typed: string[] = [];
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true'], .cm-editor")) return;
      typed = [...typed, event.key.length === 1 ? event.key.toLowerCase() : event.key].slice(-KONAMI.length);
      if (typed.join() !== KONAMI.join()) return;
      typed = [];
      const on = document.documentElement.classList.toggle("terminal");
      try {
        if (on) sessionStorage.setItem("terminal", "1");
        else sessionStorage.removeItem("terminal");
      } catch {}
      toast(on ? "Cheat code accepted. Terminal mode on. Type it again to leave." : "Terminal mode off. Welcome back.");
    };

    // Five taps on the name within two seconds.
    let taps: number[] = [];
    const onClick = (event: MouseEvent) => {
      if (!(event.target as HTMLElement | null)?.closest("header [data-wordmark], header .brand-dot")) return;
      const now = Date.now();
      taps = [...taps.filter((t) => now - t < 2000), now];
      if (taps.length < 5) return;
      taps = [];
      moveLetters("fall");
      toast(calm() ? "Gravity works. You will have to take our word for it." : "Gravity works.");
    };

    // Flipping light and dark eight times in five seconds.
    let flips: number[] = [];
    const onFlip = (event: MouseEvent) => {
      if (!(event.target as HTMLElement | null)?.closest('[aria-label="Switch between light and dark"]')) return;
      const now = Date.now();
      flips = [...flips.filter((t) => now - t < 5000), now];
      if (flips.length < 8) return;
      flips = [];
      toast("Make up your mind. (They're both lovely.)");
    };

    // A hidden tab is paused, as a debugger would put it.
    let title = document.title;
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        title = document.title;
        document.title = "Paused on a breakpoint";
      } else if (document.title === "Paused on a breakpoint") {
        document.title = title;
      }
    };

    const onAntigravity = () => {
      moveLetters("float");
      toast("import antigravity: you are flying! (Python has had that joke since 2008.)");
    };
    const onToast = (event: Event) => setNote({ id: Date.now(), text: (event as CustomEvent<string>).detail });

    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    document.addEventListener("click", onFlip);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener(ANTIGRAVITY_EVENT, onAntigravity);
    window.addEventListener(TOAST_EVENT, onToast);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
      document.removeEventListener("click", onFlip);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener(ANTIGRAVITY_EVENT, onAntigravity);
      window.removeEventListener(TOAST_EVENT, onToast);
    };
  }, []);

  useEffect(() => {
    if (!note) return;
    const timer = setTimeout(() => setNote(null), 4000);
    return () => clearTimeout(timer);
  }, [note]);

  if (!note) return null;
  return (
    <div role="status" key={note.id} className="toast rise">
      {note.text}
    </div>
  );
}
