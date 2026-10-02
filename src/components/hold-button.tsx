"use client";

import { useRef, useState } from "react";

const HOLD_MS = 900;

/**
 * A button that has to be held down to act: for deleting things that cannot
 * be brought back. It fills with red while held and submits its form when
 * full. Works with Space or Enter held down too.
 */
export function HoldButton({ children, pendingLabel = "Deleting…" }: { children: React.ReactNode; pendingLabel?: string }) {
  const button = useRef<HTMLButtonElement>(null);
  const timer = useRef<number | null>(null);
  const [state, setState] = useState<"idle" | "holding" | "done">("idle");

  const start = () => {
    if (state !== "idle") return;
    setState("holding");
    timer.current = window.setTimeout(() => {
      setState("done");
      button.current?.form?.requestSubmit();
    }, HOLD_MS);
  };
  const stop = () => {
    if (state !== "holding") return;
    if (timer.current) window.clearTimeout(timer.current);
    setState("idle");
  };

  return (
    <button
      ref={button}
      type="button"
      className="hold btn"
      data-holding={state !== "idle" ? "" : undefined}
      disabled={state === "done"}
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onKeyDown={(event) => {
        if ((event.key === " " || event.key === "Enter") && !event.repeat) {
          event.preventDefault();
          start();
        }
      }}
      onKeyUp={stop}
      onContextMenu={(event) => event.preventDefault()}
    >
      <span className="hold-fill" aria-hidden="true" />
      <span className="relative">{state === "done" ? pendingLabel : state === "holding" ? "Keep holding…" : children}</span>
    </button>
  );
}
