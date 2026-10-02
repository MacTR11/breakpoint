import { SolveCalendar } from "@/components/solve-calendar";
import { Progress, Tag, TopicName, ordinal, signed } from "@/components/ui";
import { activity } from "@/lib/activity";
import { awardsFor } from "@/lib/awards";
import { siteName } from "@/lib/config";
import { db } from "@/lib/db";
import { homeworkFor, homeworkStateLabel } from "@/lib/homework";
import { papersOf } from "@/lib/mock";
import { practiceFilter } from "@/lib/problems";
import { studentSummaries } from "@/lib/students";
import { TRACKS, trackColor } from "@/lib/tracks";

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" });

/**
 * One student's progress on a page of its own, for parents' evenings and
 * reviews. Paste flags are left off: they are for a conversation, not a report.
 */
export async function StudentReport({ studentId, summaries }: { studentId: string; summaries?: Awaited<ReturnType<typeof studentSummaries>> }) {
  const student = await db.user.findUnique({ where: { id: studentId }, include: { class: true, solves: { select: { problemId: true } }, _count: { select: { hintUnlocks: true } } } });
  if (!student) return null;
  const [practice, everyone, history, awards, homework, papers] = await Promise.all([
    db.problem.findMany({ where: practiceFilter(), select: { id: true, track: true } }),
    summaries ?? studentSummaries(),
    activity(studentId),
    awardsFor(studentId),
    homeworkFor(student),
    papersOf(studentId),
  ]);
  const me = everyone.find((s) => s.id === studentId);
  const classmates = everyone.filter((s) => s.classId && s.classId === student.classId).sort((a, b) => b.points - a.points);
  const rank = me && classmates.length > 0 ? classmates.filter((s) => s.points > me.points).length + 1 : null;
  const solved = new Set(student.solves.map((s) => s.problemId));
  const topics = TRACKS.map((t) => {
    const ids = practice.filter((p) => p.track === t.id).map((p) => p.id);
    return { id: t.id, total: ids.length, solved: ids.filter((id) => solved.has(id)).length };
  }).filter((t) => t.total > 0);
  const earned = awards.filter((a) => a.earned);

  return (
    <article className="report">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
        <div>
          <p className="cap">{siteName} progress report</p>
          <h2 className="font-display text-4xl font-extrabold tracking-tight">{student.name}</h2>
        </div>
        <p className="text-right text-sm text-muted">
          {student.class ? `${student.class.name} · ` : ""}
          {dateFormat.format(new Date())}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-5">
        <Figure label="Points" value={signed(me?.points ?? 0)} note={rank ? `${ordinal(rank)} of ${classmates.length} in ${student.class?.name}` : ""} />
        <Figure label="Solved" value={String(student.solves.length)} note={`${topics.reduce((sum, t) => sum + t.solved, 0)} of ${practice.length} in practice`} />
        <Figure label="Best streak" value={String(history.best)} note={`day${history.best === 1 ? "" : "s"} in a row`} />
        <Figure label="Hints used" value={String(student._count.hintUnlocks)} note="" />
        <Figure label="Awards" value={String(earned.length)} note={`of ${awards.filter((a) => !a.secret).length}, plus secrets`} />
      </div>

      <div className="mt-7 grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2">
        <section>
          <h3 className="cap mb-2">Topics</h3>
          <ul className="space-y-1.5">
            {topics.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 text-sm">
                <TopicName track={t.id} className="font-medium" />
                <Progress value={t.solved} total={t.total} color={trackColor(t.id)} />
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-7">
          <section>
            <h3 className="cap mb-2">The last {history.grid.length} weeks</h3>
            <SolveCalendar grid={history.grid} />
            <p className="mt-1.5 text-[13px] text-muted">{history.inGrid} challenges solved in this time</p>
          </section>

          {homework.length > 0 && (
            <section>
              <h3 className="cap mb-1">Homework</h3>
              <ul className="divide-y divide-line text-sm">
                {homework.map((h) => (
                  <li key={h.id} className="flex items-baseline justify-between gap-3 py-1.5">
                    <span>{h.title}</span>
                    <Tag color={homeworkStateLabel[h.state][1]}>{homeworkStateLabel[h.state][0]}</Tag>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {papers.length > 0 && (
            <section>
              <h3 className="cap mb-1">Mock papers</h3>
              <ul className="divide-y divide-line text-sm">
                {papers.slice(0, 5).map(({ paper, result }) => (
                  <li key={paper.id} className="flex items-baseline justify-between gap-3 py-1.5">
                    <span>{dateFormat.format(paper.startedAt)}</span>
                    <span className="tabular-nums">
                      <span className="font-semibold">
                        {result.scored} / {result.marks}
                      </span>{" "}
                      <span className="text-muted">({result.percent}%)</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {earned.length > 0 && (
            <section>
              <h3 className="cap mb-2">Awards</h3>
              <p className="flex flex-wrap gap-1.5">
                {earned.map((a) => (
                  <Tag key={a.id} color={a.color}>
                    {a.title}
                  </Tag>
                ))}
              </p>
            </section>
          )}
        </div>
      </div>

      <section className="mt-8">
        <h3 className="cap">Comment</h3>
        <div className="mt-1 space-y-7 pt-6" aria-hidden="true">
          {[0, 1, 2, 3].map((line) => (
            <div key={line} className="border-b border-line" />
          ))}
        </div>
      </section>
    </article>
  );
}

function Figure({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div>
      <p className="cap">{label}</p>
      <p className="figure text-[1.9rem]">{value}</p>
      <p className="text-[13px] text-muted">{note}</p>
    </div>
  );
}
