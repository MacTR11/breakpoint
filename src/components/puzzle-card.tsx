"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { submitPuzzle, type PuzzleReveal } from "@/app/actions";
import { HintCoin } from "@/components/brand";
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
    <section className="mt-10">
      {isChoice ? (
        <div role="radiogroup" aria-label="Answers" className="grid gap-3 sm:grid-cols-2">
          {options.map((option, index) => {
            const value = String(index);
            const isCorrect = correctAnswer === value;
            const isWrong = wrong.includes(value);
            const selected = choice === value;
            let style = "border border-white/65 bg-white/50 hover:bg-white/80";
            if (isCorrect) style = "bg-[#30d158]/20 ring-2 ring-[#30d158]";
            else if (isWrong) style = "bg-[#ff453a]/14 text-[#c4271b] line-through";
            else if (selected) style = "bg-white ring-2 ring-accent";
            else if (finished) style = "border border-white/50 bg-white/35 opacity-55";
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={selected || isCorrect}
                disabled={finished || isWrong || pending}
                onClick={() => setChoice(value)}
                className={`flex items-center gap-3 rounded-2xl px-5 py-4 text-left font-medium transition-colors enabled:cursor-pointer ${style}`}
              >
                <span className="font-mono text-sm text-muted">{String.fromCharCode(65 + index)}</span>
                {option}
                {isCorrect && <span className="ml-auto text-[#1a7f37]">✓</span>}
              </button>
            );
          })}
        </div>
      ) : finished ? (
        correctAnswer !== undefined && <p className="rounded-2xl bg-[#e3f6e8] px-5 py-4 font-medium">Answer: {correctAnswer}</p>
      ) : (
        <input
          value={choice}
          onChange={(event) => setChoice(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && submit()}
          placeholder="Type your answer"
          aria-label="Your answer"
          className="field py-4 font-medium"
        />
      )}

      {solved && (
        <div className="mt-8 rounded-2xl border border-[#30d158]/35 bg-[#30d158]/15 p-6">
          <p className="text-lg font-semibold text-[#14632b]">
            Correct. {solved.points === fullPoints ? `+${plural(solved.points)}` : `+${plural(solved.points)} on your second attempt`}
          </p>
          {hintEarned && (
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-[#7a4a00]">
              <HintCoin size={18} /> You earned a hint.
            </p>
          )}
          {explanation && (
            <div className="mt-4">
              <Markdown>{explanation}</Markdown>
            </div>
          )}
        </div>
      )}

      {locked && !solved && (
        <div className="mt-8 rounded-2xl border border-white/60 bg-white/45 p-6">
          <p className="text-lg font-semibold">No attempts left</p>
          <p className="mt-1 text-muted">
            Two wrong answers cost you {plural(penalty * maxAttempts)} on this puzzle.{" "}
            {reveal ? "Here is how it works, so the next one goes better." : "The answer will be shown here once the competition has finished."}
          </p>
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
            <p role="alert" className="mt-6 rounded-2xl border border-[#ff453a]/30 bg-[#ff453a]/12 px-5 py-4 text-[#a51d13]">
              <strong>Not quite: −{plural(penalty)}.</strong> You have {maxAttempts - wrong.length} attempt left, so reason it through before you answer again.
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <button type="button" onClick={submit} disabled={!choice.trim() || pending} className="btn btn-primary px-6 py-2.5 text-base">
              {pending ? "Checking…" : "Check answer"}
            </button>
            <p className="text-sm text-muted">
              {wrong.length === 0
                ? `Worth ${plural(fullPoints)}. A wrong answer costs ${plural(penalty)}, and you only get ${maxAttempts} attempts.`
                : `A correct answer is now worth ${plural(secondTryPoints)}. Another wrong one costs ${plural(penalty)} more.`}
            </p>
          </div>
        </>
      )}

      {message && (
        <p role="alert" className="mt-4 rounded-2xl border border-[#ff453a]/30 bg-[#ff453a]/12 px-5 py-4 text-sm text-[#a51d13]">
          {message}
        </p>
      )}
    </section>
  );
}
