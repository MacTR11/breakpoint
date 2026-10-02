"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { unlockHint } from "@/app/actions";
import { Markdown } from "@/components/markdown";

/**
 * The hints for one challenge. Revealed hints are shown; the next one costs a
 * hint token. `free` is for teachers, who reveal hints without spending.
 */
export function HintPanel({ slug, total, unlocked, balance, untilNext, free }: { slug: string; total: number; unlocked: string[]; balance: number; untilNext: number; free: boolean }) {
  const router = useRouter();
  // Hints revealed in this visit, shown at once while the page catches up. The
  // server's list wins as soon as it is longer, e.g. when solving unlocks them all.
  const [revealed, setRevealed] = useState(unlocked);
  const hints = unlocked.length > revealed.length ? unlocked : revealed;
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  if (total === 0) return null;
  const remaining = total - hints.length;

  const reveal = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await unlockHint(slug);
      if (!result.ok) return setMessage(result.message);
      setRevealed([...hints, result.hint]);
      router.refresh();
    });
  };

  return (
    <section className="mt-10 border-t border-line pt-5" aria-label="Hints">
      <h2 className="font-semibold">Hints</h2>

      {hints.length > 0 && (
        <ol className="mt-3 space-y-3">
          {hints.map((hint, index) => (
            <li key={index} className="flex gap-4">
              <span className="w-10 shrink-0 pt-0.5 font-mono text-[13px] text-warn">
                {index + 1}/{total}
              </span>
              <Markdown>{hint}</Markdown>
            </li>
          ))}
        </ol>
      )}

      {remaining > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <button type="button" onClick={reveal} disabled={pending || (!free && balance <= 0)} className="btn btn-secondary">
            {pending ? "Revealing…" : hints.length === 0 ? "Use a hint" : "Use another hint"}
          </button>
          <p className="text-sm text-muted">
            {free
              ? `${remaining} more hint${remaining === 1 ? "" : "s"}. Teachers reveal hints for free.`
              : balance > 0
                ? `Costs 1 of your ${balance}. ${remaining} hint${remaining === 1 ? "" : "s"} left on this challenge.`
                : `You are out of hints. Solve ${untilNext} more challenge${untilNext === 1 ? "" : "s"} to earn one.`}
          </p>
        </div>
      )}
      {message && (
        <p role="alert" className="mt-3 text-sm text-fail">
          {message}
        </p>
      )}
    </section>
  );
}
