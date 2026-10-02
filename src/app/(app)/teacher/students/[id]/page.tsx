import Link from "next/link";
import { notFound } from "next/navigation";
import { CodeBlock } from "@/components/code-block";
import { EditStudent } from "@/components/student-forms";
import { PageHeader, Tag, buttonStyle, formatDateTime, link, signed } from "@/components/ui";
import { allClasses } from "@/lib/classes";
import { db } from "@/lib/db";
import { homeworkFor, homeworkStateLabel } from "@/lib/homework";
import { duration, flagsByChallenge, pasteFlag } from "@/lib/integrity";
import { papersOf } from "@/lib/mock";
import { MAX_PUZZLE_ATTEMPTS, parseOptions } from "@/lib/problems";
import { requireTeacher } from "@/lib/session";
import { resetAttempts } from "../../actions";

const statusWord: Record<string, [string, string]> = { ACCEPTED: ["Passed", "text-pass"], WRONG: ["Failed", "text-fail"], ERROR: ["Error", "text-fail"], TIMEOUT: ["Too slow", "text-warn"] };

export default async function StudentPage({ params }: PageProps<"/teacher/students/[id]">) {
  await requireTeacher();
  const { id } = await params;
  const student = await db.user.findUnique({
    where: { id },
    include: {
      solves: { include: { problem: true }, orderBy: { solvedAt: "desc" } },
      submissions: { include: { problem: true }, orderBy: { createdAt: "desc" } },
      _count: { select: { hintUnlocks: true } },
      class: true,
    },
  });
  if (!student || student.role !== "STUDENT") notFound();
  const [classes, homework, papers] = await Promise.all([allClasses(), homeworkFor(student), papersOf(student.id)]);
  const flags = flagsByChallenge(student.submissions.filter((s) => s.problem.kind === "CODE")).length;

  const penalties = student.submissions.reduce((sum, s) => sum + s.penalty, 0);
  const points = student.solves.reduce((sum, s) => sum + s.points, 0) - penalties;
  const solvedIds = new Set(student.solves.map((s) => s.problemId));

  // Puzzles the student has run out of attempts on, which a teacher can reopen.
  const wrongByPuzzle = new Map<string, { title: string; count: number }>();
  for (const s of student.submissions) {
    if (s.problem.kind !== "PUZZLE" || s.status !== "WRONG" || solvedIds.has(s.problemId)) continue;
    const entry = wrongByPuzzle.get(s.problemId) ?? { title: s.problem.title, count: 0 };
    wrongByPuzzle.set(s.problemId, { ...entry, count: entry.count + 1 });
  }
  const locked = [...wrongByPuzzle].filter(([, v]) => v.count >= MAX_PUZZLE_ATTEMPTS);

  return (
    <>
      <PageHeader
        path={[
          { label: "teacher" },
          { label: "students", href: "/teacher" },
          ...(student.class ? [{ label: student.class.name, href: `/teacher/classes/${student.class.id}` }] : []),
          { label: student.username },
        ]}
        title={student.name}
      >
        <Link href={`/teacher/students/${student.id}/report`} className={buttonStyle.secondary}>
          Printable report
        </Link>
      </PageHeader>
      <p className="-mt-3 mb-9 text-sm text-muted">
        {student.class ? `${student.class.name} · ` : "No class · "}
        {signed(points)} pts · {student.solves.length} solved · {penalties} lost to wrong puzzle answers · {student._count.hintUnlocks} hints used
        {flags > 0 && (
          <>
            {" · "}
            <span className="font-semibold text-warn">
              {flags} paste flag{flags === 1 ? "" : "s"}
            </span>
          </>
        )}
      </p>

      <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="space-y-10">
          {locked.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Locked puzzles</h2>
              <ul className="border-y border-line divide-y divide-line">
                {locked.map(([problemId, { title }]) => (
                  <li key={problemId}>
                    <form action={resetAttempts} className="flex items-baseline justify-between gap-3 py-2.5">
                      <input type="hidden" name="userId" value={student.id} />
                      <input type="hidden" name="problemId" value={problemId} />
                      <span>{title}</span>
                      <button className={`cursor-pointer whitespace-nowrap text-sm ${link}`}>Give another go</button>
                    </form>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-muted">Reopening a puzzle clears the student&apos;s attempts on it and refunds the penalty.</p>
            </section>
          )}

          <section>
            <h2 className="mb-3 text-lg font-semibold">Account</h2>
            <EditStudent student={{ id: student.id, name: student.name, username: student.username, classId: student.classId ?? "" }} classes={classes} />
            <p className="mt-3 text-sm text-muted">Last signed in: {student.lastSeenAt ? formatDateTime(student.lastSeenAt) : "never"}.</p>
          </section>

          {homework.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Homework</h2>
              <ul className="border-y border-line divide-y divide-line">
                {homework.map((set) => (
                  <li key={set.id} className="flex items-baseline justify-between gap-3 py-2.5">
                    <span>
                      <Link href={`/teacher/homework/${set.id}`} className={link}>
                        {set.title}
                      </Link>
                      <span className="block text-sm text-muted">
                        {set.done} of {set.problems.length} · due {formatDateTime(set.dueAt)}
                      </span>
                    </span>
                    <Tag color={homeworkStateLabel[set.state][1]}>{homeworkStateLabel[set.state][0]}</Tag>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {papers.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Mock papers</h2>
              <ul className="border-y border-line divide-y divide-line">
                {papers.map(({ paper, result }) => (
                  <li key={paper.id} className="flex items-baseline justify-between gap-3 py-2.5">
                    <Link href={`/mock/${paper.id}`} className={link}>
                      {formatDateTime(paper.startedAt)}
                    </Link>
                    <span className="text-sm tabular-nums">
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

          <section>
            <h2 className="mb-3 text-lg font-semibold">Solved</h2>
            {student.solves.length === 0 ? (
              <p className="border-y border-line py-6 text-muted">Nothing solved yet.</p>
            ) : (
              <ul className="border-y border-line divide-y divide-line">
                {student.solves.map((solve) => (
                  <li key={solve.id} className="py-2.5">
                    <Link href={`/problems/${solve.problem.slug}`} className={link}>
                      {solve.problem.title}
                    </Link>
                    <p className="text-sm text-muted">
                      {solve.points} pts · {solve.attempts} attempt{solve.attempts === 1 ? "" : "s"} · {formatDateTime(solve.solvedAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Recent submissions</h2>
          {student.submissions.length === 0 ? (
            <p className="border-y border-line py-6 text-muted">No submissions yet.</p>
          ) : (
            <ul className="border-y border-line divide-y divide-line">
              {student.submissions.slice(0, 50).map((submission) => {
                const isPuzzle = submission.problem.kind === "PUZZLE";
                const options = isPuzzle ? parseOptions(submission.problem) : [];
                const [word, color] = statusWord[submission.status] ?? [submission.status, "text-muted"];
                const flag = isPuzzle ? null : pasteFlag(submission);
                return (
                  <li key={submission.id}>
                    <details>
                      <summary className="flex cursor-pointer flex-wrap items-baseline gap-x-3 py-2.5">
                        <span className={`w-16 text-sm font-medium ${color}`}>{word}</span>
                        <span>{submission.problem.title}</span>
                        <span className="text-[13px] tabular-nums text-muted">
                          {!isPuzzle && `${submission.passed}/${submission.total}`}
                          {submission.penalty > 0 && ` −${submission.penalty} pts`}
                        </span>
                        {flag && <Tag color="var(--warn)">Large paste</Tag>}
                        <span className="ml-auto text-sm text-muted">{formatDateTime(submission.createdAt)}</span>
                      </summary>
                      {!isPuzzle && (submission.typedChars > 0 || submission.pastedChars > 0) && (
                        <p className={`pb-2 text-sm ${flag ? "text-warn" : "text-muted"}`}>
                          {flag ? `${flag}. ` : ""}Typed {submission.typedChars} characters, pasted {submission.pastedChars}
                          {submission.seconds > 0 && `, editor open ${duration(submission.seconds)}`}.
                        </p>
                      )}
                      {isPuzzle ? (
                        <p className="pb-3 text-sm">Answered: {options[Number(submission.code)] ?? submission.code}</p>
                      ) : (
                        <div className="mb-3">
                          <CodeBlock code={submission.code} fileName={`${submission.problem.functionName ?? "answer"}.py`} copy />
                        </div>
                      )}
                    </details>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
