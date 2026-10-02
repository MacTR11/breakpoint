"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { signOutAction } from "@/app/actions";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Notice } from "@/lib/notifications";

export type NavLink = { href: string; label: string; short: string; glyph: string };

const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

/**
 * The links on a wide screen: a grey track with the current page raised, as
 * in a segmented control. The raised pill slides to the new page when it
 * changes (a nod to Rare UI's gooey nav, in solid colour).
 */
export function TopLinks({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  const track = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const active = links.find((l) => isActive(pathname, l.href))?.href ?? null;

  useLayoutEffect(() => {
    const place = () => {
      const target = active ? track.current?.querySelector<HTMLElement>(`[data-href="${active}"]`) : null;
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
    // Only slide once it has a place to slide from.
    const ready = requestAnimationFrame(() => pill.current?.setAttribute("data-ready", ""));
    const observer = new ResizeObserver(place);
    if (track.current) observer.observe(track.current);
    return () => {
      cancelAnimationFrame(ready);
      observer.disconnect();
    };
  }, [active]);

  return (
    <nav aria-label="Main">
      <div ref={track} className="nav-track">
        <span ref={pill} className="nav-pill" aria-hidden="true" />
        {links.map((link) => (
          <Link key={link.href} href={link.href} data-href={link.href} aria-current={link.href === active ? "page" : undefined}>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

/** The bar along the bottom of a phone or tablet: five places, each with a word of code for an icon. */
export function TabBar({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="tab-bar lg:hidden">
      {links.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined}>
            <span className="tab-glyph" aria-hidden="true">
              {link.glyph}
            </span>
            {link.short}
          </Link>
        );
      })}
    </nav>
  );
}

/** Open and close a small menu: closes on a click elsewhere, on Escape, and when a link in it is followed. */
function useMenu() {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const away = (event: PointerEvent) => {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  return { open, setOpen, box };
}

// When the viewer last opened the bell, kept in this browser.
const SEEN_EVENT = "breakpoint:seen";
const seenKey = (userId: string) => `seen:${userId}`;
function readSeen(userId: string) {
  try {
    return localStorage.getItem(seenKey(userId)) ?? "";
  } catch {
    return "";
  }
}
function subscribeSeen(onChange: () => void) {
  window.addEventListener(SEEN_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(SEEN_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** A bell with a count of what is new since it was last opened (after Rare UI's notification bell). */
export function Bell({ userId, notices }: { userId: string; notices: Notice[] }) {
  const { open, setOpen, box } = useMenu();
  const seen = useSyncExternalStore(
    subscribeSeen,
    () => readSeen(userId),
    () => null,
  );
  const unread = seen === null ? 0 : notices.filter((n) => n.at > seen).length;
  const toggle = () => {
    if (!open) {
      try {
        localStorage.setItem(seenKey(userId), new Date().toISOString());
      } catch {}
      window.dispatchEvent(new Event(SEEN_EVENT));
    }
    setOpen(!open);
  };

  return (
    <div ref={box} className="relative">
      <button type="button" onClick={toggle} aria-expanded={open} aria-label={unread ? `Notifications, ${unread} new` : "Notifications"} className="round-button" data-ring={unread > 0 ? "" : undefined}>
        <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {unread > 0 && <span className="bell-count">{unread}</span>}
      </button>
      {open && (
        <div className="menu-card rise right-0 w-80" role="dialog" aria-label="Notifications">
          <p className="cap px-2 pb-1">Notifications</p>
          {notices.length === 0 ? (
            <p className="px-2 py-3 text-sm text-muted">Nothing new. You are all caught up.</p>
          ) : (
            <ul>
              {notices.map((n) => (
                <li key={n.id}>
                  <Link href={n.href} onClick={() => setOpen(false)} className="flex gap-3 rounded-[12px] px-2 py-2 hover:bg-paper">
                    <span className="mt-1.5 size-2 shrink-0 rounded-full" style={{ background: n.tone }} aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{n.title}</span>
                      <span className="block text-[13px] text-muted">{n.detail}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/** The round button with the viewer's initials: who is signed in, the theme, and the way out. */
export function AccountMenu({ name, detail, links }: { name: string; detail: string; links: { href: string; label: string }[] }) {
  const { open, setOpen, box } = useMenu();
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div ref={box} className="relative">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Account" className="round-button avatar">
        {initials || "?"}
      </button>
      {open && (
        <div className="menu-card rise right-0 w-60">
          <div className="px-2 pb-2">
            <p className="font-semibold">{name}</p>
            <p className="text-[13px] text-muted">{detail}</p>
          </div>
          <ul className="border-t border-line pt-1.5">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setOpen(false)} className="block rounded-[10px] px-2 py-1.5 text-[15px] hover:bg-paper">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-1.5 flex items-center justify-between border-t border-line px-2 pt-2.5">
            <ThemeToggle />
            <form action={signOutAction}>
              <button className="cursor-pointer text-sm font-medium text-fail hover:underline">Sign out</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
