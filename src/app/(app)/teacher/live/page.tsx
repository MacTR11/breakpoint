import Link from "next/link";
import { AutoRefresh } from "@/components/countdown";
import { field, label as labelStyle } from "@/components/form-bits";
import { PageHeader, Tag, kindLabel, levelLabel, link } from "@/components/ui";
import { allClasses } from "@/lib/classes";
import { homeworkChallenges } from "@/lib/homework";
import { currentLesson, lessonBoard, LESSON_HOURS, type LiveRow, type LiveState } from "@/lib/live";
import { requireTeacher } from "@/lib/session";
import { TRACKS } from "@/lib/tracks";
import { endLive, startLive } from "./actions";

export const metadata = { title: "Live lesson" };

const minutes = (from: Date, to: Date) => {
  const n = Math.max(0, Math.round((to.getTime() - from.getTime()) / 60_000));
  return n < 1 ? "under a minute" : `${n} min`;
};

const STATES: { state: LiveState; label: string; color: string }[] = [
  { state: "solved", label: "Solved", color: "var(--pass)" },
  { state: "trying", label: "Trying", color: "var(--warn)" },
  { state: "opened", label: "Opened", color: "var(--link)" },
  { state: "waiting", label: "Not opened yet", color: "var(--muted)" },
  { state: "solved-before", label: "Solved before", color: "var(--pass)" },
];

function detail(row: LiveRow, startedAt: Date) {
  switch (row.state) {
    case "solved":
      return `Solved in ${minutes(startedAt, row.at!)}${row.tries > 1 ? `, ${row.tries} tries` : ""}`;
    case "solved-before":
      return null;
    case "trying":
      return `${row.tries} ${row.tries === 1 ? "try" : "tries"}${row.best ? `, best ${row.best.passed}/${row.best.total} tests` : ""}`;
    case "opened":
      return "Nothing handed in yet";
    case "waiting":
      return null;
  }
}

export default async function LiveLessonPage({ searchParams }: PageProps<"/teacher/live">) {
  await requireTeacher();
  const lesson = await currentLesson();

  if (!lesson) {
    const { problem: chosen, error } = await searchParams;
    const [classes, challenges] = await Promise.all([allClasses(), homeworkChallenges()]);
    return (
      <>
        <PageHeader
          path={[{ label: "teacher" }, { label: "live" }]}
          title="Live lesson"
          intro={`Put one challenge on every student's screen, then watch who has opened it, who is trying and who has solved it. It runs until you end it, or for ${LESSON_HOURS} hours.`}
        />
        {error && (
          <p role="alert" className="mb-4 text-fail">
            {error === "class" ? "That class no longer exists." : "Choose a challenge that is in Practice."}
          </p>
        )}
        <form action={startLive} className="max-w-3xl space-y-5">
          <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
            <label className={labelStyle}>
              For
              <select name="classId" defaultValue="" className={field}>
                <option value="">Every class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className={labelStyle}>
              Challenge
              <select name="problemId" required defaultValue={typeof chosen === "string" ? chosen : ""} className={field}>
                <option value="" disabled>
                  Choose a challenge
                </option>
                {TRACKS.map((track) => {
                  const inTrack = challenges.filter((c) => c.track === track.id);
                  return (
                    inTrack.length > 0 && (
                      <optgroup key={track.id} label={track.title}>
                        {inTrack.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title} · {kindLabel(c.kind, c.style)} · {levelLabel(c.difficulty)}
                          </option>
                        ))}
                      </optgroup>
                    )
                  );
                })}
              </select>
            </label>
          </div>
          <p className="text-sm text-muted">Students who are signed in are taken to it straight away (unless they are sitting a mock paper). Anyone who signs in later sees a link to it.</p>
          <button type="submit" className="btn btn-primary">
            Start the lesson
          </button>
        </form>
      </>
    );
  }

  const rows = await lessonBoard(lesson);
  const now = new Date();
  const count = (state: LiveState) => rows.filter((row) => row.state === state).length;

  return (
    <>
      <AutoRefresh seconds={5} />
      <PageHeader path={[{ label: "teacher" }, { label: "live" }]} title="Live lesson" />
      <section aria-label="The challenge">
        <div className="flex flex-wrap items-start gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted">
              {lesson.class?.name ?? "Every class"} · started {minutes(lesson.startedAt, now)} ago
            </p>
            <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight">
              <Link href={`/problems/${lesson.problem.slug}`} className="hover:underline">
                {lesson.problem.title}
              </Link>
            </h2>
            <p className="mt-1 text-sm text-muted">{kindLabel(lesson.problem.kind, lesson.problem.style)}</p>
          </div>
          <form action={endLive}>
            <button type="submit" className="btn btn-secondary">
              End the lesson
            </button>
          </form>
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {/* Solved before the lesson counts as solved here. */}
          {STATES.slice(0, 4).map(({ state, label, color }) => (
              <div key={state} className="rounded-[14px] bg-paper px-4 py-3">
                <dt className="text-sm text-muted">{label}</dt>
                <dd className="font-display text-3xl font-extrabold tabular-nums" style={{ color }}>
                  {state === "solved" ? count("solved") + count("solved-before") : count(state)}
                </dd>
              </div>
            ))}
        </dl>
      </section>

      {rows.length === 0 ? (
        <p className="mt-6 text-muted">
          There are no students in {lesson.class?.name ?? "any class"} yet.{" "}
          <Link href="/teacher/students/new" className={link}>
            Add students
          </Link>
        </p>
      ) : (
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" aria-label="Students">
          {rows.map((row) => {
            const { label, color } = STATES.find((s) => s.state === row.state)!;
            return (
              <li key={row.id} className="live-tile" data-state={row.state}>
                <Link href={`/teacher/students/${row.id}`} className="font-semibold hover:underline">
                  {row.name}
                </Link>
                {!lesson.classId && row.className && <span className="text-[13px] text-muted"> · {row.className}</span>}
                <p className="mt-1.5">
                  <Tag color={color}>{label}</Tag>
                </p>
                {detail(row, lesson.startedAt) && <p className="text-[13px] text-muted">{detail(row, lesson.startedAt)}</p>}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
