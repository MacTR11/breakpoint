"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { AfterSolve } from "@/lib/after-solve";
import type { Rewards } from "@/lib/solve";

/** What the pop-up needs to know about the challenge it is congratulating. */
export type Celebration = { title: string; firstName: string; after: AfterSolve };

export type SolvedSummary = { points: number; attempts: number; rewards: Rewards };

const PRAISE = ["Well done", "Nicely done", "Great work", "Brilliant"];

/**
 * Shown over a blurred page the moment a challenge is solved, so the obvious
 * next step is to go back to the list (or straight on to the next one) rather
 * than staying put. Escape or "Stay on this page" closes it.
 */
export function SolvedDialog({ celebration, summary, onClose }: { celebration: Celebration; summary: SolvedSummary; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const { title, firstName, after } = celebration;
  const { points, attempts, rewards } = summary;
  // The same challenge always gets the same word, so it does not flicker between renders.
  const praise = PRAISE[title.length % PRAISE.length];

  // Opened as a modal so the page behind is blurred and cannot be clicked. No
  // clean-up: closing here would fire onClose, and removing the element from
  // the page is enough to dismiss it.
  useEffect(() => {
    const element = dialog.current;
    if (element && !element.open) element.showModal();
  }, []);

  const lines: [string, string][] = [
    [`+${points}`, `point${points === 1 ? "" : "s"}`],
    attempts <= 1 ? ["First try", "right first time"] : [`${attempts} tries`, "and you got there"],
    ...(rewards.hints > 0 ? [[`+${rewards.hints}`, `hint${rewards.hints === 1 ? "" : "s"} to spend`] as [string, string]] : []),
    ...(rewards.dailyBonus ? [["Daily", "challenge done, +1 hint"] as [string, string]] : []),
  ];

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      // A click on the blurred backdrop (outside the card) closes it too.
      onClick={(event) => {
        if (event.target === dialog.current) dialog.current?.close();
      }}
      aria-labelledby="solved-title"
      className="solved-dialog"
    >
      <div className="card w-[min(92vw,26rem)] px-6 py-7 text-center sm:px-8">
        <div className="solved-tick mx-auto grid h-16 w-16 place-items-center rounded-full bg-pass text-white" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </div>
        <h2 id="solved-title" className="mt-4 font-display text-3xl font-extrabold tracking-tight">
          {praise}, {firstName}!
        </h2>
        <p className="mt-1 text-muted">
          You solved <span className="font-semibold text-ink">{title}</span>.
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-2.5 text-left">
          {lines.map(([figure, label]) => (
            <div key={label} className="rounded-[14px] bg-paper px-3.5 py-2.5">
              <dt className="figure text-xl">{figure}</dt>
              <dd className="text-[13px] text-muted">{label}</dd>
            </div>
          ))}
        </dl>
        {rewards.awards.length > 0 && (
          <p className="mt-3 rounded-[14px] bg-paper px-3.5 py-2.5 text-left text-sm">
            <span className="font-semibold text-hint">New award{rewards.awards.length === 1 ? "" : "s"}:</span> {rewards.awards.join(", ")}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-2.5">
          <Link href={after.back.href} className="btn btn-primary py-2.5 text-base" autoFocus>
            {after.back.label}
          </Link>
          {after.next && (
            <Link href={after.next.href} className="btn btn-secondary flex-col gap-0 py-2.5">
              <span>Next: {after.next.title}</span>
              <span className="text-xs font-medium text-muted">{after.next.detail}</span>
            </Link>
          )}
          <button type="button" onClick={() => dialog.current?.close()} className="mt-1 cursor-pointer text-sm text-muted hover:text-ink">
            Stay on this page
          </button>
        </div>
      </div>
    </dialog>
  );
}
