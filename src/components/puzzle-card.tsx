"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { submitPuzzle, type PuzzleReveal } from "@/app/actions";
import { Markdown } from "@/components/markdown";
import { RewardLines } from "@/components/rewards";
import { SolvedDialog, type Celebration, type SolvedSummary } from "@/components/solved-dialog";
import { celebrate } from "@/lib/celebrate";
import { noRewardsClient } from "@/lib/rewards-none";
import type { Rewards } from "@/lib/solve";

type Solved = { points: number; answer: string; explanation: string | null };

const plural = (n: number) => `${n} point${n === 1 ? "" : "s"}`;

export function PuzzleCard({
  slug,
  options,
  fullPoints,
  secondTryPoints,
  penalty,
  maxAttempts,
  wrongAnswers,
  solved: initiallySolved,
  locked: initiallyLocked,
  reveal: initialReveal,
  celebration,
}: {
  slug: string;
  options: string[];
  fullPoints: number;
  secondTryPoints: number;
  penalty: number;
  maxAttempts: number;
  wrongAnswers: string[];
  solved: Solved | null;
  locked: boolean;
  reveal: PuzzleReveal | null;
  /** When set, a correct answer opens the solved pop-up. */
  celebration?: Celebration;
}) {
  const router = useRouter();
  const [solved, setSolved] = useState(initiallySolved);
  const [locked, setLocked] = useState(initiallyLocked);
  const [reveal, setReveal] = useState(initialReveal);
  const [choice, setChoice] = useState("");
  const [wrong, setWrong] = useState(wrongAnswers);
  const [message, setMessage] = useState<string | null>(null);
  const [rewards, setRewards] = useState<Rewards>(noRewardsClient);
  const [popup, setPopup] = useState<SolvedSummary | null>(null);
  // Kept from the first render: the refresh after a solve stops the page sending it.
  const [toCelebrate] = useState(celebration);
  const [pending, startTransition] = useTransition();
  const isChoice = options.length > 0;
  const finished = Boolean(solved) || locked;
  const correctAnswer = solved?.answer ?? reveal?.answer;
  const explanation = solved?.explanation ?? reveal?.explanation;

  const submit = () => {
    if (!choice.trim()) return;
    setMessage(null);
    startTransition(async () => {
      const result = await submitPuzzle(slug, choice);
      if (!result.ok) return setMessage(result.message);
      if (result.correct) {
        setSolved({ points: result.points, answer: choice, explanation: result.explanation });
        setRewards(result.rewards);
        setPopup({ points: result.points, attempts: result.attempts, rewards: result.rewards });
        celebrate();
      } else {
        setWrong((w) => [...w, choice]);
        setChoice("");
        if (result.attemptsLeft === 0) {
          setLocked(true);
          setReveal(result.reveal);
        }
      }
      router.refresh();
    });
  };

  return (
    <section className="mt-8">
      {isChoice ? (
        <div role="radiogroup" aria-label="Answers" className="space-y-2">
          {options.map((option, index) => {
            const value = String(index);
            const isCorrect = correctAnswer === value;
            const isWrong = wrong.includes(value);
            const selected = choice === value;
            let style = "border-transparent bg-paper enabled:hover:border-line";
            if (isCorrect) style = "border-pass bg-pass/10 font-semibold text-pass";
            else if (isWrong) style = "border-transparent bg-fail/10 text-fail";
            else if (selected) style = "border-accent bg-accent/10 font-semibold";
            else if (finished) style = "border-transparent bg-paper text-muted";
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={selected || isCorrect}
                disabled={finished || isWrong || pending}
                onClick={() => setChoice(value)}
                className={`flex w-full items-center gap-3.5 rounded-[14px] border-2 px-3.5 py-3 text-left transition-colors duration-150 enabled:cursor-pointer ${style}`}
              >
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-[8px] font-display text-sm font-extrabold ${selected && !finished ? "bg-accent text-white" : "bg-card"}`}>{String.fromCharCode(65 + index)}</span>
                <span className={`flex-1 ${isWrong ? "line-through" : ""}`}>{option}</span>
                {isCorrect && <span className="whitespace-nowrap text-sm font-medium">✓ Correct</span>}
                {isWrong && <span className="whitespace-nowrap text-sm font-medium">✗ Wrong</span>}
              </button>
            );
          })}
        </div>
      ) : finished ? (
        correctAnswer !== undefined && <p className="font-medium text-pass">Answer: {correctAnswer}</p>
      ) : (
        <input
          value={choice}
          onChange={(event) => setChoice(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && submit()}
          placeholder="Type your answer"
          aria-label="Your answer"
          className="field"
        />
      )}

      {solved && (
        <div className="rise mt-7">
          <p>
            <span className="font-semibold text-pass">Correct.</span> +{plural(solved.points)}
            {solved.points !== fullPoints && " (second attempt)"}
          </p>
          <RewardLines rewards={rewards} />
          {explanation && (
            <div className="mt-4">
              <Markdown>{explanation}</Markdown>
            </div>
          )}
        </div>
      )}

      {locked && !solved && (
        <div className="rise mt-7">
          <p>
            <span className="font-semibold text-fail">Locked.</span> No attempts left, −{plural(penalty * maxAttempts)}.
          </p>
          <p className="mt-2 text-muted">{reveal ? "Here is how it works, so the next one goes better." : "The answer will be shown here once the competition has finished."}</p>
          {explanation && (
            <div className="mt-4">
              <Markdown>{explanation}</Markdown>
            </div>
          )}
        </div>
      )}

      {!finished && (
        <>
          {wrong.length > 0 && (
            <p key={wrong.length} role="alert" className="rise mt-5">
              <span className="font-semibold text-fail">Not right.</span> −{plural(penalty)}, {maxAttempts - wrong.length} attempt left.
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <button type="button" onClick={submit} disabled={!choice.trim() || pending} className="btn btn-primary">
              {pending ? "Checking…" : "Check answer"}
            </button>
            <p className="text-sm text-muted">
              {wrong.length === 0
                ? `Worth ${plural(fullPoints)}. A wrong answer costs ${plural(penalty)}, and you only get ${maxAttempts} attempts.`
                : `A correct answer is now worth ${plural(secondTryPoints)}. Another wrong one costs ${plural(penalty)} more, so reason it through.`}
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
