"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { search, type PaletteItem } from "@/lib/palette";

// Find any page, challenge or competition by typing a few letters (and for the
// teacher, any student, class or homework). Opens with Ctrl K (⌘K on a Mac) or
// the search button in the top bar. A card with a hairline border, like the
// other menus from the top bar, and no backdrop.

const isMac = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

export function CommandPalette({ pages }: { pages: { href: string; label: string; glyph: string }[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [found, setFound] = useState<PaletteItem[] | null>(null);
  const [failed, setFailed] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);

  const pageItems = useMemo<PaletteItem[]>(() => pages.map((p) => ({ group: "Pages", title: p.label, detail: p.href, href: p.href, icon: { text: p.glyph, color: "#8e8e93" } })), [pages]);
  const results = useMemo(() => {
    const everything = [...pageItems, ...(found ?? [])];
    // Before anything is typed: the pages, and whatever competitions and homework are coming up.
    if (!query.trim()) return everything.filter((item) => item.group === "Pages" || item.group === "Competitions" || item.group === "Homework").slice(0, 14);
    return search(everything, query);
  }, [pageItems, found, query]);

  const show = (next: boolean) => {
    setOpen(next);
    setQuery("");
    setActive(0);
  };

  // Ctrl K / ⌘K from anywhere, even inside the code editor.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (isMac() ? event.metaKey : event.ctrlKey) && !event.altKey && !event.shiftKey) {
        event.preventDefault();
        setOpen((now) => !now);
        setQuery("");
        setActive(0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // The list is fetched the first time the palette opens, and kept.
  useEffect(() => {
    if (!open || found) return;
    let cancelled = false;
    fetch("/api/palette")
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
      .then((data: { items: PaletteItem[] }) => !cancelled && setFound(data.items))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [open, found]);

  useEffect(() => {
    if (!open) return;
    field.current?.focus();
    const away = (event: PointerEvent) => {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  useEffect(() => {
    list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (item: PaletteItem | undefined) => {
    if (!item) return;
    setOpen(false);
    router.push(item.href);
  };

  return (
    <div ref={box}>
      <button type="button" onClick={() => show(!open)} aria-expanded={open} aria-label="Search" title={`Search (${isMac() ? "⌘K" : "Ctrl K"})`} className="round-button">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.6-3.6" />
        </svg>
      </button>
      {open && (
        <div className="palette rise" role="dialog" aria-label="Search">
          <div className="flex items-center gap-2.5 border-b border-line px-3 pb-2.5">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="shrink-0 text-muted" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.6-3.6" />
            </svg>
            <input
              ref={field}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                  event.preventDefault();
                  if (results.length) setActive((now) => (now + (event.key === "ArrowDown" ? 1 : results.length - 1)) % results.length);
                } else if (event.key === "Enter") {
                  event.preventDefault();
                  go(results[active]);
                } else if (event.key === "Escape") {
                  setOpen(false);
                }
              }}
              role="combobox"
              aria-expanded="true"
              aria-controls="palette-results"
              aria-activedescendant={results[active] ? `palette-${active}` : undefined}
              aria-label="Search for a page, challenge or competition"
              placeholder="Search challenges, pages and more"
              autoComplete="off"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent py-1 text-[15px] outline-none placeholder:text-muted"
            />
            <kbd className="hidden shrink-0 rounded-[6px] bg-paper px-1.5 py-0.5 font-sans text-[11px] text-muted sm:inline">esc</kbd>
          </div>
          <ul ref={list} id="palette-results" role="listbox" className="max-h-[min(26rem,60dvh)] overflow-y-auto px-1.5 pt-1.5">
            {results.map((item, index) => (
              <li key={`${item.group}:${item.href}`} role="presentation">
                {(index === 0 || results[index - 1].group !== item.group) && (
                  <p className="cap px-2 pb-1 pt-2" aria-hidden="true">
                    {item.group}
                  </p>
                )}
                <a
                  id={`palette-${index}`}
                  role="option"
                  aria-selected={index === active}
                  data-index={index}
                  href={item.href}
                  onClick={(event) => {
                    event.preventDefault();
                    go(item);
                  }}
                  onPointerMove={() => setActive(index)}
                  className="flex items-center gap-3 rounded-[12px] px-2 py-1.5 aria-selected:bg-paper"
                >
                  <span className="icon !size-8 !rounded-[9px] !text-[11px]" style={{ "--tone": item.icon.color } as React.CSSProperties} aria-hidden="true">
                    {item.icon.text}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-medium">{item.title}</span>
                    <span className="block truncate text-[13px] text-muted">{item.detail}</span>
                  </span>
                  {index === active && (
                    <span className="shrink-0 text-xs text-muted" aria-hidden="true">
                      ↵
                    </span>
                  )}
                </a>
              </li>
            ))}
            {results.length === 0 && (
              <li className="px-2 py-4 text-sm text-muted">{failed ? "Could not load the list. Check your connection and try again." : query ? "Nothing matches that." : "Loading…"}</li>
            )}
          </ul>
          {!found && !failed && query && <p className="px-3.5 pt-1 text-xs text-muted">Still loading challenges…</p>}
        </div>
      )}
    </div>
  );
}
