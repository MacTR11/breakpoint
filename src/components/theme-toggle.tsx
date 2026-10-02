"use client";

import { useEffect } from "react";

/** Switches between light and dark, and remembers the choice in this browser. */
export function ThemeToggle() {
  // Until a choice has been made, keep following the device as it changes.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const follow = () => {
      try {
        if (localStorage.getItem("theme")) return;
      } catch {}
      document.documentElement.classList.toggle("dark", media.matches);
    };
    media.addEventListener("change", follow);
    return () => media.removeEventListener("change", follow);
  }, []);

  const toggle = () => {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {}
  };

  return (
    <button type="button" onClick={toggle} className="cursor-pointer whitespace-nowrap text-sm text-muted hover:text-ink" aria-label="Switch between light and dark">
      <span className="when-light">Dark</span>
      <span className="when-dark">Light</span>
    </button>
  );
}
