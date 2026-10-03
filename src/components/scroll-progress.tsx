"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * A thin line along the bottom of the top bar showing how far down a long
 * page you are (after Rare UI's scroll progress). Hidden on short pages and
 * at the top.
 */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const element = bar.current;
      if (!element) return;
      const room = document.documentElement.scrollHeight - window.innerHeight;
      const long = room > window.innerHeight * 0.75;
      element.style.opacity = long && window.scrollY > 24 ? "1" : "0";
      element.style.transform = `scaleX(${room > 0 ? Math.min(window.scrollY / room, 1) : 0})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);
  return <div ref={bar} className="scroll-progress" aria-hidden="true" />;
}
