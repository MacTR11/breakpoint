"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { submitPuzzle, type PuzzleReveal } from "@/app/actions";
import { Markdown } from "@/components/markdown";

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
}) {
  const router = useRouter();
  const [solved, setSolved] = useState(initiallySolved);
  const [locked, setLocked] = useState(initiallyLocked);
  const [reveal, setReveal] = useState(initialReveal);
  const [choice, setChoice] = useState("");
  const [wrong, setWrong] = useState(wrongAnswers);
  const [message, setMessage] = useState<string | null>(null);
  const [hintEarned, setHintEarned] = useState(false);
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
        setHintEarned(result.hintEarned);
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
        <div role="radiogroup" aria-label="Answers" className="border-y border-line divide-y divide-line">
          {options.map((option, index) => {
            const value = String(index);
            const isCorrect = correctAnswer === value;
            const isWrong = wrong.includes(value);
            const selected = choice === value;
            let style = "hover:bg-paper";
            if (isCorrect) style = "font-medium text-pass";
            else if (isWrong) style = "text-fail";
            else if (selected) style = "bg-paper font-medium";
            else if (finished) style = "text-muted";
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={selected || isCorrect}
                disabled={finished || isWrong || pending}
                onClick={() => setChoice(value)}
                className={`flex w-full items-baseline gap-4 px-2 py-3 text-left enabled:cursor-pointer ${style}`}
              >
                <span className="w-8 shrink-0 font-mono text-[13px]">{selected ? `(${String.fromCharCode(65 + index)})` : ` ${String.fromCharCode(65 + index)}`}</span>
                <span className={`flex-1 ${isWrong ? "line-through" : ""}`}>{option}</span>
                {isCorrect && <span className="font-mono text-[13px] font-semibold">PASS</span>}
                {isWrong && <span className="font-mono text-[13px] font-semibold">FAIL</span>}
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
        <div className="mt-7">
          <p className="font-mono text-sm">
            <span className="font-semibold text-pass">PASS</span> +{plural(solved.points)}
            {solved.points !== fullPoints && " (second attempt)"}
            {hintEarned && <span className="text-warn"> · you earned a hint</span>}
          </p>
          {explanation && (
            <div className="mt-4">
              <Markdown>{explanation}</Markdown>
            </div>
          )}
        </div>
      )}

      {locked && !solved && (
        <div className="mt-7">
          <p className="font-mono text-sm">
            <span className="font-semibold text-fail">LOCK</span> no attempts left, −{plural(penalty * maxAttempts)}
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
            <p role="alert" className="mt-5 font-mono text-sm">
              <span className="font-semibold text-fail">FAIL</span> −{plural(penalty)}, {maxAttempts - wrong.length} attempt left
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
    </section>
  );
}
