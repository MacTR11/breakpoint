"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function format(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return days > 0 ? `${days}d ${pad(hours)}h ${pad(minutes)}m` : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/** Counts down to a moment, then refreshes the page so its state catches up. */
export function Countdown({ to, className }: { to: string; className?: string }) {
  const router = useRouter();
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date(to).getTime();
    const tick = () => {
      const left = target - Date.now();
      setRemaining(left);
      if (left <= 0) {
        clearInterval(interval);
        router.refresh();
      }
    };
    const interval = setInterval(tick, 1000);
    tick();
    return () => clearInterval(interval);
  }, [to, router]);

  // The server cannot know the viewer's clock, so the first paint is a placeholder.
  return (
    <span className={className} suppressHydrationWarning>
      {remaining === null ? "…" : format(remaining)}
    </span>
  );
}

/** Re-fetches the page on a timer, used to keep a live leaderboard current. */
export function AutoRefresh({ seconds }: { seconds: number }) {
  const router = useRouter();
  useEffect(() => {
    const interval = setInterval(() => router.refresh(), seconds * 1000);
    return () => clearInterval(interval);
  }, [seconds, router]);
  return null;
}
