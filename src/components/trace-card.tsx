"use client";

import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore, useTransition } from "react";
import { submitTrace, type TraceReveal } from "@/app/actions";
import { Markdown } from "@/components/markdown";
import { RewardLines } from "@/components/rewards";
import { SolvedDialog, type Celebration, type SolvedSummary } from "@/components/solved-dialog";
import { celebrate } from "@/lib/celebrate";
import { readDraft, subscribeToDrafts, writeDraft } from "@/lib/drafts";
import { noRewardsClient } from "@/lib/rewards-none";
import type { Rewards } from "@/lib/solve";
import { sameCell, type TraceSpec } from "@/lib/trace-table";

const plural = (n: number) => `${n} point${n === 1 ? "" : "s"}`;

/**
 * A trace table to fill in. Given cells are shown; the rest are boxes. Check
 * marks each box: wrong ones turn red (without saying what they should be),
 * and the student has one more go, for half points.
 */
export function TraceCard({
  userId,
  slug,
  spec,
  fullPoints,
  secondTryPoints,
  maxAttempts,
  wrongBefore,
  solved: initiallySolved,
  locked: initiallyLocked,
  reveal: initialReveal,
  celebration,
}: {
  userId: string;
  slug: string;
  spec: TraceSpec;
  fullPoints: number;
  secondTryPoints: number;
  maxAttempts: number;
  /** Wrong attempts made already. */
  wrongBefore: number;
  /** The finished table and explanation, once solved. */
  solved: { points: number; answer: string[][]; explanation: string | null } | null;
  locked: boolean;
  reveal: TraceReveal | null;
  celebration?: Celebration;
}) {
  const router = useRouter();
  const key = `trace:${userId}:${slug}`;
  const saved = useSyncExternalStore(
    subscribeToDrafts,
    () => readDraft(key),
    () => null,
  );
  const cells: string[][] = (() => {
    try {
      const value = JSON.parse(saved ?? "null");
      if (Array.isArray(value)) return spec.rows.map((row, r) => row.map((_, c) => String(value[r]?.[c] ?? "")));
    } catch {}
    return spec.rows.map((row) => row.map(() => ""));
  })();
  const write = (r: number, c: number, value: string) => {
    const next = cells.map((row) => [...row]);
    next[r][c] = value;
    writeDraft(key, JSON.stringify(next));
    // Editing a red cell clears its mark.
    setWrong((now) => now.filter(([wr, wc]) => wr !== r || wc !== c));
  };

  const [solved, setSolved] = useState(initiallySolved);
  const [locked, setLocked] = useState(initiallyLocked);
  const [reveal, setReveal] = useState(initialReveal);
  const [wrong, setWrong] = useState<[number, number][]>([]);
  // How many were wrong at the last check. Kept apart from the red marks so the
  // message stays put while the student fixes them.
  const [wrongCount, setWrongCount] = useState(0);
  const [attemptsUsed, setAttemptsUsed] = useState(wrongBefore);
  const [checked, setChecked] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [rewards, setRewards] = useState<Rewards>(noRewardsClient);
  const [popup, setPopup] = useState<SolvedSummary | null>(null);
  const [toCelebrate] = useState(celebration);
  const [pending, startTransition] = useTransition();
  const finished = Boolean(solved) || locked;
  // What to show in each box once it is over: the answer.
  const shown = solved?.answer ?? reveal?.answer ?? null;
  const explanation = solved?.explanation ?? reveal?.explanation ?? null;

  const check = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await submitTrace(slug, cells);
      if (!result.ok) return setMessage(result.message);
      setChecked(true);
      if (result.correct) {
        setSolved({ points: result.points, answer: cells, explanation: result.explanation });
        setRewards(result.rewards);
        setPopup({ points: result.points, attempts: result.attempts, rewards: result.rewards });
        celebrate();
      } else {
        setWrong(result.wrong);
        setWrongCount(result.wrong.length);
        setAttemptsUsed((n) => n + 1);
        if (result.attemptsLeft === 0) {
          setLocked(true);
          setReveal(result.reveal);
        }
      }
      router.refresh();
    });
  };

  const isWrong = (r: number, c: number) => wrong.some(([wr, wc]) => wr === r && wc === c);

  return (
    <section className="mt-7">
      <div className="overflow-x-auto rounded-[14px] border border-line">
        <table className="trace-sheet">
          <thead>
            <tr>
              {spec.columns.map((column) => (
                <th key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {spec.rows.map((row, r) => (
              <tr key={r}>
                {row.map((given, c) => {
                  const label = `${spec.columns[c]}, row ${r + 1}`;
                  if (given !== null) {
                    return (
                      <td key={c} className="trace-given">
                        {given}
                      </td>
                    );
                  }
                  if (finished && shown) {
                    const mine = cells[r][c];
                    // Once it is over the answer is here, so each box can be judged directly.
                    const right = solved !== null || sameCell(mine, shown[r]?.[c] ?? "");
                    return (
                      <td key={c} className={right ? "trace-right" : "trace-wrong"} aria-label={label}>
                        {shown[r]?.[c] ?? ""}
                        {!right && mine.trim() && <s className="ml-1.5 text-[12px] opacity-70">{mine}</s>}
                      </td>
                    );
                  }
                  return (
                    <td key={c} className={isWrong(r, c) ? "trace-wrong" : checked && !finished ? "trace-right" : ""}>
                      <input
                        value={cells[r][c]}
                        onChange={(event) => write(r, c, event.target.value)}
                        aria-label={label}
                        aria-invalid={isWrong(r, c) || undefined}
                        disabled={finished || pending}
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        className="trace-input"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!finished && <p className="mt-2 text-[13px] text-muted">Leave a box empty if nothing goes in it. Text needs no quote marks.</p>}

      {solved && (
        <div className="rise mt-6">
          <p>
            <span className="font-semibold text-pass">Correct.</span> +{plural(solved.points)}
            {solved.points !== fullPoints && " (second attempt)"}
          </p>
          <RewardLines rewards={rewards} />
        </div>
      )}
      {locked && !solved && (
        <div className="rise mt-6">
          <p>
            <span className="font-semibold text-fail">Locked.</span> No attempts left.
          </p>
          <p className="mt-1 text-muted">{reveal ? "The finished table is above, with your wrong answers crossed out." : "The answers will be shown here once the competition has finished."}</p>
        </div>
      )}
      {finished && explanation && (
        <div className="mt-4">
          <Markdown>{explanation}</Markdown>
        </div>
      )}

      {!finished && (
        <>
          {wrongCount > 0 && (
            <p role="alert" className="rise mt-5">
              <span className="font-semibold text-fail">
                {wrongCount} box{wrongCount === 1 ? " was" : "es were"} wrong.
              </span>{" "}
              They are marked in red. {maxAttempts - attemptsUsed} attempt left.
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <button type="button" onClick={check} disabled={pending} className="btn btn-primary">
              {pending ? "Checking…" : "Check table"}
            </button>
            <p className="text-sm text-muted">
              {attemptsUsed === 0
                ? `Worth ${plural(fullPoints)}, with a second attempt for ${plural(secondTryPoints)} if anything is wrong.`
                : `A correct table is now worth ${plural(secondTryPoints)}.`}
            </p>
          </div>
        </>
      )}
      {message && (
        <p role="alert" className="mt-4 text-sm text-fail">
          {message}
        </p>
      )}
      {toCelebrate && popup && <SolvedDialog celebration={toCelebrate} summary={popup} onClose={() => setPopup(null)} />}
    </section>
  );
}
