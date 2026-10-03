"use client";

import { useEffect } from "react";

/**
 * Rings the item a link pointed at (the #part of the address), so it can be
 * found on arrival. CSS :target misses it when the page is reached without a
 * full load, so this marks it with `data-arrived` instead.
 */
export function ArrivalMark() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const element = id ? document.getElementById(id) : null;
    element?.setAttribute("data-arrived", "");
    return () => element?.removeAttribute("data-arrived");
  }, []);
  return null;
}
