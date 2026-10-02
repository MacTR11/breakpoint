"use client";

import { useActionState, useMemo, useState } from "react";
import { deleteHomework, saveHomework } from "@/app/(app)/teacher/homework/actions";
import { FormErrors, field, hint, label as labelStyle } from "@/components/form-bits";
import { HoldButton } from "@/components/hold-button";
import { KindIcon, kindLabel, levelLabel, tone } from "@/components/ui";
import { TRACKS } from "@/lib/tracks";

/** `held`: already in this homework, but since put into a competition, so it cannot be added anew. */
type ChallengeOption = { id: string; title: string; kind: string; style: string; track: string; difficulty: string; points: number; held?: boolean };

/** `dueAt` is a datetime-local string in UK time; `classId` is empty for every student. */
export type HomeworkFormValues = { id?: string; title: string; note: string; classId: string; dueAt: string; problemIds: string[] };

export function HomeworkForm({ values: saved, classes, challenges }: { values: HomeworkFormValues; classes: { id: string; name: string }[]; challenges: ChallengeOption[] }) {
  const [state, action, pending] = useActionState(saveHomework, null);
  // After a failed save, refill the form with what the teacher typed.
  const values: HomeworkFormValues = state ? { ...saved, ...state.values, problemIds: state.values.problemIds ? state.values.problemIds.split(",") : [] } : saved;
  const [chosen, setChosen] = useState(() => new Set(values.problemIds));
  // The homework's own challenges first, in its order, then everything else.
  const listed = useMemo(() => {
    const order = new Map(saved.problemIds.map((id, index) => [id, index]));
    return [...challenges].sort((a, b) => (order.get(a.id) ?? Infinity) - (order.get(b.id) ?? Infinity));
  }, [challenges, saved.problemIds]);
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("");
  const shows = (c: ChallengeOption) => chosen.has(c.id) || ((!topic || c.track === topic) && c.title.toLowerCase().includes(search.trim().toLowerCase()));
  const topics = TRACKS.filter((t) => challenges.some((c) => c.track === t.id));
  const total = challenges.filter((c) => chosen.has(c.id)).reduce((sum, c) => sum + c.points, 0);

  return (
    <form action={action} className="max-w-3xl space-y-6">
      {values.id && <input type="hidden" name="id" value={values.id} />}
      <div className="grid gap-4 sm:grid-cols-[2fr_1fr_1fr]">
        <label className={labelStyle}>
          Title
          <input name="title" required maxLength={100} defaultValue={values.title} placeholder="Recursion practice" className={field} />
        </label>
        <label className={labelStyle}>
          For
          <select name="classId" defaultValue={values.classId} className={field}>
            <option value="">Every class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className={labelStyle}>
          Due (UK time)
          <input type="datetime-local" name="dueAt" required defaultValue={values.dueAt} className={field} />
        </label>
      </div>
      <label className={labelStyle}>
        Note for students
        <span className={hint}>Optional. Shown above the list of challenges.</span>
        <textarea name="note" rows={2} maxLength={2000} defaultValue={values.note} className={field} />
      </label>

      <fieldset>
        <legend className={labelStyle}>Challenges</legend>
        <p className={hint}>
          From Practice only. {chosen.size} chosen{chosen.size > 0 && `, worth ${total} points`}. Challenges a student solved before count as done.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search titles" aria-label="Search challenges" className="field !mt-0 !w-56 !py-1.5" />
          <button type="button" onClick={() => setTopic("")} aria-current={topic === "" ? "true" : undefined} className="chip" style={tone("#8e8e93")}>
            All topics
          </button>
          {topics.map((t) => (
            <button key={t.id} type="button" onClick={() => setTopic(topic === t.id ? "" : t.id)} aria-current={topic === t.id ? "true" : undefined} className="chip" style={tone(t.color)}>
              {t.title}
            </button>
          ))}
        </div>
        <ul className="mt-3 max-h-[28rem] overflow-y-auto border-y border-line divide-y divide-line">
          {listed.map((c) => (
            <li key={c.id} hidden={!shows(c)}>
              <label className="flex cursor-pointer items-center gap-3 py-2">
                <input
                  type="checkbox"
                  name="problemIds"
                  value={c.id}
                  checked={chosen.has(c.id)}
                  onChange={() =>
                    setChosen((now) => {
                      const next = new Set(now);
                      if (next.has(c.id)) next.delete(c.id);
                      else next.add(c.id);
                      return next;
                    })
                  }
                  className="size-4 accent-[var(--accent)]"
                />
                <KindIcon kind={c.kind} style={c.style} track={c.track} />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{c.title}</span>
                  <span className="block text-[13px] text-muted">
                    {kindLabel(c.kind, c.style)} · {levelLabel(c.difficulty)}
                    {c.held && " · held for a competition: it stays if left ticked, but cannot be added again once removed"}
                  </span>
                </span>
                <span className="text-sm font-semibold tabular-nums text-muted">{c.points}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <FormErrors state={state} />
      <button disabled={pending} className="btn btn-primary">
        {pending ? "Saving…" : values.id ? "Save changes" : "Set homework"}
      </button>
    </form>
  );
}

export function DeleteHomework({ id }: { id: string }) {
  return (
    <form action={deleteHomework} className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <input type="hidden" name="id" value={id} />
      <HoldButton>Hold to delete this homework</HoldButton>
      <span className="text-sm text-muted">Students keep anything they have solved.</span>
    </form>
  );
}
