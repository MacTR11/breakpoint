import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, formatDateTime, link, signed } from "@/components/ui";
import { db } from "@/lib/db";
import { MAX_PUZZLE_ATTEMPTS, parseOptions } from "@/lib/problems";
import { resetAttempts } from "../../actions";

const statusWord: Record<string, [string, string]> = { ACCEPTED: ["PASS", "text-pass"], WRONG: ["FAIL", "text-fail"], ERROR: ["ERR ", "text-fail"], TIMEOUT: ["SLOW", "text-warn"] };

export default async function StudentPage({ params }: PageProps<"/teacher/students/[id]">) {
  const { id } = await params;
  const student = await db.user.findUnique({
    where: { id },
    include: {
      solves: { include: { problem: true }, orderBy: { solvedAt: "desc" } },
      submissions: { include: { problem: true }, orderBy: { createdAt: "desc" } },
      _count: { select: { hintUnlocks: true } },
    },
  });
  if (!student) notFound();

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
      <PageHeader path={[{ label: "teacher" }, { label: "students", href: "/teacher" }, { label: student.email }]} title={student.name} />
      <p className="-mt-4 mb-10 font-mono text-sm">
        {signed(points)} pts · {student.solves.length} solved · {penalties} lost to wrong puzzle answers · {student._count.hintUnlocks} hints used
      </p>

      <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
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
                return (
                  <li key={submission.id}>
                    <details>
                      <summary className="flex cursor-pointer flex-wrap items-baseline gap-x-3 py-2.5">
                        <span className={`font-mono text-[13px] font-semibold ${color}`}>{word}</span>
                        <span>{submission.problem.title}</span>
                        <span className="font-mono text-[13px] text-muted">
                          {!isPuzzle && `${submission.passed}/${submission.total}`}
                          {submission.penalty > 0 && ` −${submission.penalty} pts`}
                        </span>
                        <span className="ml-auto text-sm text-muted">{formatDateTime(submission.createdAt)}</span>
                      </summary>
                      {isPuzzle ? (
                        <p className="pb-3 text-sm">Answered: {options[Number(submission.code)] ?? submission.code}</p>
                      ) : (
                        <pre className="mb-3 overflow-x-auto rounded-md border border-line bg-paper p-4 font-mono text-sm">{submission.code}</pre>
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
