"use client";

import { useActionState, useState } from "react";
import { deleteProblem, saveProblem } from "@/app/(app)/teacher/actions";
import { FormErrors, field, hint, label as labelStyle } from "@/components/form-bits";
import { difficultyLabel } from "@/lib/problems";
import { COMPONENTS, SUBSECTIONS, componentOf } from "@/lib/spec";
import { TRACKS } from "@/lib/tracks";
import { DIFFICULTIES } from "@/lib/types";

export type ProblemFormValues = {
  id?: string;
  title: string;
  slug: string;
  kind: string;
  difficulty: string;
  topic: string;
  track: string;
  style: string;
  hints: string;
  specRef: string;
  points: number;
  description: string;
  published: boolean;
  functionName: string;
  starterCode: string;
  tests: string;
  solution: string;
  banned: string;
  options: string;
  answer: string;
  explanation: string;
};

const TESTS_EXAMPLE = `[
  { "args": [[1, 2, 3]], "expected": 6 },
  { "args": [[]], "expected": 0 },
  { "args": [[-5, 5]], "expected": 0, "hidden": true }
]`;

export function ProblemForm({ values: saved }: { values: ProblemFormValues }) {
  const [state, action, pending] = useActionState(saveProblem, null);
  const [kind, setKind] = useState(saved.kind);
  // After a failed save, refill the form with what the teacher typed.
  const values: ProblemFormValues = state
    ? { ...saved, ...state.values, points: Number(state.values.points), published: state.values.published === "on" }
    : saved;
  const mono = `${field} font-mono text-sm`;

  return (
    <>
      <form action={action} className="max-w-3xl space-y-6">
        {values.id && <input type="hidden" name="id" value={values.id} />}
        <input type="hidden" name="slug" value={values.slug} />

        <fieldset>
          <legend className={labelStyle}>Type</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {[
              ["CODE", "Python challenge", "Students write or repair a function or class; it is marked automatically."],
              ["PUZZLE", "Puzzle", "A question with one answer. Wrong answers cost points."],
            ].map(([value, name, text]) => (
              <label key={value} className={`cursor-pointer rounded-md border p-4 ${kind === value ? "border-accent outline outline-2 outline-accent/25" : "border-line"}`}>
                <input type="radio" name="kind" value={value} checked={kind === value} onChange={() => setKind(value)} className="sr-only" />
                <span className="block font-semibold">{name}</span>
                <span className="block text-sm text-muted">{text}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className={labelStyle}>
          Title
          <input name="title" required defaultValue={values.title} className={field} />
        </label>

        <label className={labelStyle}>
          Course map topic
          <span className={hint}>Which strand of the course map this appears under.</span>
          <select name="track" defaultValue={values.track} className={field}>
            {TRACKS.map((track) => (
              <option key={track.id} value={track.id}>
                {track.title}
              </option>
            ))}
          </select>
        </label>

        <label className={labelStyle}>
          Specification reference
          <span className={hint}>Where this sits in OCR H446, for your own records.</span>
          <select name="specRef" defaultValue={values.specRef} className={field}>
            {COMPONENTS.map((component) => (
              <optgroup key={component.id} label={`Component ${component.code}: ${component.title}`}>
                {Object.entries(SUBSECTIONS)
                  .filter(([ref]) => componentOf(ref) === component.id)
                  .map(([ref, title]) => (
                    <option key={ref} value={ref}>
                      {ref} {title}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className={labelStyle}>
            Difficulty
            <select name="difficulty" defaultValue={values.difficulty} className={field}>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {difficultyLabel[d]}
                </option>
              ))}
            </select>
          </label>
          <label className={labelStyle}>
            Topic
            <input name="topic" required defaultValue={values.topic} placeholder="e.g. Strings" className={field} />
          </label>
          <label className={labelStyle}>
            Points
            <input name="points" type="number" min={0} max={1000} required defaultValue={values.points} className={field} />
          </label>
        </div>

        <label className={labelStyle}>
          Question
          <span className={hint}>Markdown is supported: **bold**, `code`, tables and ``` code blocks.</span>
          <textarea name="description" required rows={10} defaultValue={values.description} className={mono} />
        </label>

        <label className={labelStyle}>
          Hints
          <span className={hint}>
            One per line, gentlest first. A student spends one hint token to reveal each, in order. Markdown works: `code`, **bold**.
          </span>
          <textarea name="hints" rows={4} defaultValue={values.hints} className={field} />
        </label>

        {kind === "CODE" ? (
          <>
            <label className={labelStyle}>
              Task
              <select name="style" defaultValue={values.style} className={field}>
                <option value="WRITE">Write code: students start from a skeleton</option>
                <option value="FIX">Fix the bug: the starter code is broken on purpose</option>
              </select>
            </label>
            <label className={labelStyle}>
              Function or class name
              <span className={hint}>What students must write. Tests call it directly.</span>
              <input name="functionName" defaultValue={values.functionName} placeholder="sum_list" className={mono} />
            </label>
            <label className={labelStyle}>
              Starter code
              <span className={hint}>What students see in the editor to begin with. For a fix-the-bug task, this is the broken code.</span>
              <textarea name="starterCode" rows={5} spellCheck={false} defaultValue={values.starterCode} placeholder={"def sum_list(numbers):\n    # Write your code here\n    pass"} className={mono} />
            </label>
            <label className={labelStyle}>
              Tests
              <span className={hint}>
                A JSON list. <code>args</code> holds the arguments in order, so a function taking one list needs <code>[[1, 2, 3]]</code>. For a class, use{" "}
                <code>{`"steps": [["Stack"], ["push", 3], ["pop"]]`}</code> with <code>{`"expected": [null, 3]`}</code>: one value per method call. Tests marked{" "}
                <code>&quot;hidden&quot;: true</code> are only used when a student submits. Write <code>true</code>, <code>false</code> and <code>null</code> for
                Python&apos;s True, False and None.
              </span>
              <textarea name="tests" rows={9} spellCheck={false} defaultValue={values.tests} placeholder={TESTS_EXAMPLE} className={mono} />
            </label>
            <label className={labelStyle}>
              Reference solution
              <span className={hint}>Never shown to students. Saving runs it against your tests, so a mistake in a test is caught now.</span>
              <textarea name="solution" rows={8} spellCheck={false} defaultValue={values.solution} className={mono} />
            </label>
            <label className={labelStyle}>
              Not allowed
              <span className={hint}>
                Optional. Text the student&apos;s code may not contain, separated by commas, for when the algorithm must be written by hand. For a sorting
                problem: <code>sorted(, .sort(</code>
              </span>
              <input name="banned" defaultValue={values.banned} className={mono} />
            </label>
          </>
        ) : (
          <>
            <label className={labelStyle}>
              Answer options
              <span className={hint}>One per line. Leave empty if students should type their answer instead.</span>
              <textarea name="options" rows={4} defaultValue={values.options} className={field} />
            </label>
            <label className={labelStyle}>
              Correct answer
              <span className={hint}>Exactly as written in the options above (or the answer students should type).</span>
              <input name="answer" defaultValue={values.answer} className={field} />
            </label>
            <label className={labelStyle}>
              Explanation
              <span className={hint}>Shown once a student has answered correctly or run out of attempts. Markdown is supported.</span>
              <textarea name="explanation" rows={6} defaultValue={values.explanation} className={mono} />
            </label>
          </>
        )}

        <label className="flex items-center gap-3 font-medium">
          <input type="checkbox" name="published" defaultChecked={values.published} className="h-4 w-4" />
          Published
          <span className="font-normal text-muted">Unpublished problems are only visible to teachers.</span>
        </label>

        <FormErrors state={state} />

        <button disabled={pending} className="btn btn-primary">
          {pending ? (kind === "CODE" ? "Checking tests…" : "Saving…") : "Save problem"}
        </button>
      </form>

      {values.id && (
        <form
          action={deleteProblem}
          onSubmit={(event) => {
            if (!window.confirm("Delete this problem? Students' submissions and points for it are deleted too. This cannot be undone.")) event.preventDefault();
          }}
          className="mt-12 max-w-3xl border-t border-line pt-6"
        >
          <input type="hidden" name="id" value={values.id} />
          <button className="cursor-pointer text-sm text-fail hover:underline">Delete this problem</button>
        </form>
      )}
    </>
  );
}
