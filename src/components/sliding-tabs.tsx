"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { Icon, type IconName } from "@/components/icons";

export type SlidingItem = { href: string; label: string; active: boolean; icon?: IconName; level?: number };

/** One, two or three rising bars: how hard a level is. */
function LevelBars({ level }: { level: number }) {
  return (
    <span className="level-bars" data-level={level} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

/**
 * A row of links in a grey track, the chosen one on a raised pill that slides
 * to the next choice. On a narrow screen the row scrolls sideways rather than
 * wrapping, with the chosen one brought into view.
 */
export function SlidingTabs({
  items,
  label,
  current = "true",
  keepScroll = false,
  className = "",
}: {
  items: SlidingItem[];
  label?: string;
  current?: "page" | "true";
  /** For filters: stay at the same place on the page when one is chosen. */
  keepScroll?: boolean;
  className?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const active = items.find((item) => item.active)?.href ?? null;
  const placed = useRef(false);

  useLayoutEffect(() => {
    const place = () => {
      const target = active ? track.current?.querySelector<HTMLElement>(`[data-href="${CSS.escape(active)}"]`) : null;
      if (!pill.current) return;
      if (!target) {
        pill.current.style.opacity = "0";
        return;
      }
      pill.current.style.width = `${target.offsetWidth}px`;
      pill.current.style.transform = `translateX(${target.offsetLeft}px)`;
      pill.current.style.opacity = "1";
    };
    place();
    // Bring the choice into view in a row that scrolls; smoothly once the row has been seen.
    const target = active ? track.current?.querySelector<HTMLElement>(`[data-href="${CSS.escape(active)}"]`) : null;
    if (target && track.current && track.current.scrollWidth > track.current.clientWidth) {
      track.current.scrollTo({ left: target.offsetLeft - (track.current.clientWidth - target.offsetWidth) / 2, behavior: placed.current ? "smooth" : "instant" });
    }
    const ready = requestAnimationFrame(() => {
      pill.current?.setAttribute("data-ready", "");
      placed.current = true;
    });
    const observer = new ResizeObserver(place);
    if (track.current) observer.observe(track.current);
    return () => {
      cancelAnimationFrame(ready);
      observer.disconnect();
    };
  }, [active]);

  return (
    <div ref={track} className={`slide-track ${className}`} role={label ? "group" : undefined} aria-label={label}>
      <span ref={pill} className="slide-pill" aria-hidden="true" />
      {items.map((item) => (
        <Link key={item.href} href={item.href} data-href={item.href} aria-current={item.active ? current : undefined} scroll={keepScroll ? false : undefined}>
          {item.icon && <Icon name={item.icon} filled={item.active} />}
          {item.level && <LevelBars level={item.level} />}
          {item.label}
        </Link>
      ))}
    </div>
  );
}

/** Topic chips on one row that scrolls sideways on a phone, opened with the chosen one in view. */
export function ChipRow({ label, children }: { label: string; children: React.ReactNode }) {
  const row = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = row.current;
    const chosen = element?.querySelector<HTMLElement>("[aria-current]");
    if (element && chosen && element.scrollWidth > element.clientWidth) element.scrollLeft = chosen.offsetLeft - (element.clientWidth - chosen.offsetWidth) / 2;
  });
  return (
    <div ref={row} className="chip-row" role="group" aria-label={label}>
      {children}
    </div>
  );
}
