"use client";

import { useEffect, useState } from "react";

/** Fills the screen with the page, for a projector. */
export function FullscreenButton() {
  const [full, setFull] = useState(false);
  useEffect(() => {
    const update = () => setFull(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);
  return (
    <button
      type="button"
      onClick={() => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {})}
      className="cursor-pointer hover:text-ink"
    >
      {full ? "Leave full screen" : "Full screen"}
    </button>
  );
}
