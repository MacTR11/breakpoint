"use client";

import { useEffect, useState } from "react";
import { PASS_EVENT } from "@/lib/celebrate";

/** The breakpoint dot. It turns green for a moment whenever a challenge is solved. */
export function BrandDot() {
  // Counting the celebrations gives each one a fresh element, which restarts the animation.
  const [passes, setPasses] = useState(0);
  useEffect(() => {
    const onPass = () => setPasses((n) => n + 1);
    window.addEventListener(PASS_EVENT, onPass);
    return () => window.removeEventListener(PASS_EVENT, onPass);
  }, []);
  return <span key={passes} aria-hidden="true" className={`brand-dot relative inline-block h-[0.62em] w-[0.62em] rounded-full bg-brand ${passes > 0 ? "dot-pass" : ""}`} />;
}
