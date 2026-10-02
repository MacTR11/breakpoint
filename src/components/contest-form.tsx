"use client";

import { useActionState } from "react";
import { deleteContest, saveContest } from "@/app/(app)/teacher/actions";
import { FormErrors, field, hint, label as labelStyle } from "@/components/form-bits";
import { kindLabel, levelLabel } from "@/components/ui";
import { trackTitle } from "@/lib/tracks";

type ProblemOption = { id: string; title: string; kind: string; style: string; track: string; difficulty: string; points: number; specRef: string; note: string | null };

/** `startsAt` and `endsAt` are datetime-local strings in UK time, or empty for an unscheduled pack. */
export type ContestFormValues = { id?: string; title: string; description: string; startsAt: string; endsAt: string; problemIds: string[] };

export function ContestForm({ values: saved, problems }: { values: ContestFormValues; problems: ProblemOption[] }) {
  const [state, action, pending] = useActionState(saveContest, null);
  // After a failed save, refill the form with what the teacher typed.
  const values: ContestFormValues = state
    ? { ...saved, ...state.values, problemIds: state.values.problemIds ? state.values.problemIds.split(",") : [] }
    : saved;

  return (
    <>
      <form action={action} className="max-w-3xl space-y-6">
        {values.id && <input type="hidden" name="id" value={values.id} />}

        <label className={labelStyle}>
          Title
          <input name="title" required defaultValue={values.title} className={field} />
        </label>
        <label className={labelStyle}>
          Description
          <textarea name="description" rows={3} defaultValue={values.description} className={field} />
        </label>

        <div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelStyle}>
              Starts (UK time)
              <input type="datetime-local" name="startsAt" defaultValue={values.startsAt} className={field} />
            </label>
            <label className={labelStyle}>
              Ends (UK time)
              <input type="datetime-local" name="endsAt" defaultValue={values.endsAt} className={field} />
            </label>
          </div>
          <p className="mt-2 text-sm text-muted">Leave both empty to keep this as a pack to schedule later. Students cannot see it until it has dates.</p>
        </div>

        <fieldset>
          <legend className={labelStyle}>Problems</legend>
          <p className={hint}>
            Chosen problems are hidden from students until the competition starts, and join Practice when it ends. For a fair contest, pick problems students
            have not seen: any they have already solved will not score again.
          </p>
          <ul className="mt-3 border-y border-line divide-y divide-line">
            {problems.map((p) => (
              <li key={p.id}>
                <label className="flex cursor-pointer items-baseline gap-3 py-2.5">
                  <input type="checkbox" name="problemIds" value={p.id} defaultChecked={values.problemIds.includes(p.id)} className="h-4 w-4 self-center" />
                  <span className="flex-1 min-w-0">
                    <span className="font-medium">{p.title}</span>
                    <span className="ml-2 text-sm text-muted">
                      {trackTitle(p.track)}
                      {p.note && ` · ${p.note}`}
                    </span>
                  </span>
                  <span className="hidden whitespace-nowrap text-sm text-muted sm:inline">
                    {kindLabel(p.kind, p.style)} · {levelLabel(p.difficulty)}
                  </span>
                  <span className="w-8 text-right text-sm font-semibold tabular-nums text-muted">{p.points}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        <FormErrors state={state} />

        <button disabled={pending} className="btn btn-primary">
          {pending ? "Saving…" : "Save competition"}
        </button>
      </form>

      {values.id && (
        <form
          action={deleteContest}
          onSubmit={(event) => {
            if (!window.confirm("Delete this competition? Its problems and students' points are kept.")) event.preventDefault();
          }}
          className="mt-12 max-w-3xl border-t border-line pt-6"
        >
          <input type="hidden" name="id" value={values.id} />
          <button className="cursor-pointer text-sm text-fail hover:underline">Delete this competition</button>
        </form>
      )}
    </>
  );
}
