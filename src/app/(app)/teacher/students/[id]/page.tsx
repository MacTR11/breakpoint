import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, Card, DifficultyBadge, backLink, formatDateTime, signed } from "@/components/ui";
import { db } from "@/lib/db";
import { MAX_PUZZLE_ATTEMPTS, parseOptions } from "@/lib/problems";
import { resetAttempts } from "../../actions";

const statusStyle: Record<string, string> = {
  ACCEPTED: "bg-[#e3f6e8] text-[#1a7f37]",
  WRONG: "bg-[#ffe6e4] text-[#c4271b]",
  ERROR: "bg-[#ffe6e4] text-[#c4271b]",
  TIMEOUT: "bg-[#fff2d9] text-[#9a5b00]",
};
const statusLabel: Record<string, string> = { ACCEPTED: "Accepted", WRONG: "Wrong answer", ERROR: "Error", TIMEOUT: "Too slow" };

export default async function StudentPage({ params }: PageProps<"/teacher/students/[id]">) {
  const { id } = await params;
  const student = await db.user.findUnique({
    where: { id },
    include: {
      solves: { include: { problem: true }, orderBy: { solvedAt: "desc" } },
      submissions: { include: { problem: true }, orderBy: { createdAt: "desc" } },
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
      <Link href="/teacher" className={backLink}>
        ‹ All students
      </Link>
      <div className="mt-5 mb-10 flex items-center gap-5">
        <Avatar name={student.name} image={student.image} size={64} />
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">{student.name}</h1>
          <p className="mt-1 text-muted">
            {student.email} · {signed(points)} points{penalties > 0 ? ` (${penalties} lost to wrong puzzle answers)` : ""} · {student.solves.length} solved
          </p>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="space-y-10">
          {locked.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold tracking-tight mb-4">Locked puzzles</h2>
              <Card className="divide-y divide-line">
                {locked.map(([problemId, { title }]) => (
                  <form key={problemId} action={resetAttempts} className="flex items-center justify-between gap-3 px-6 py-3.5">
                    <input type="hidden" name="userId" value={student.id} />
                    <input type="hidden" name="problemId" value={problemId} />
                    <span className="font-medium">{title}</span>
                    <button className="text-sm text-link hover:underline cursor-pointer whitespace-nowrap">Give another go</button>
                  </form>
                ))}
              </Card>
              <p className="mt-3 text-sm text-muted">Reopening a puzzle clears the student&apos;s attempts on it and refunds the penalty.</p>
            </section>
          )}

          <section>
            <h2 className="text-xl font-semibold tracking-tight mb-4">Solved</h2>
            <Card className="overflow-hidden">
              {student.solves.length === 0 ? (
                <p className="p-6 text-muted">Nothing solved yet.</p>
              ) : (
                <ul className="divide-y divide-line">
                  {student.solves.map((solve) => (
                    <li key={solve.id} className="px-6 py-3.5">
                      <div className="flex items-center justify-between gap-3">
                        <Link href={`/problems/${solve.problem.slug}`} className="font-medium hover:underline">
                          {solve.problem.title}
                        </Link>
                        <DifficultyBadge difficulty={solve.problem.difficulty} />
                      </div>
                      <p className="text-sm text-muted">
                        {solve.points} pts · {solve.attempts} attempt{solve.attempts === 1 ? "" : "s"} · {formatDateTime(solve.solvedAt)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </section>
        </div>

        <section className="lg:col-span-2">
          <h2 className="text-xl font-semibold tracking-tight mb-4">Recent submissions</h2>
          {student.submissions.length === 0 ? (
            <Card className="p-6 text-muted">No submissions yet.</Card>
          ) : (
            <div className="space-y-3">
              {student.submissions.slice(0, 50).map((submission) => {
                const isPuzzle = submission.problem.kind === "PUZZLE";
                const options = isPuzzle ? parseOptions(submission.problem) : [];
                return (
                  <Card key={submission.id} className="overflow-hidden">
                    <details>
                      <summary className="flex cursor-pointer flex-wrap items-center gap-3 px-6 py-3.5">
                        <span className="font-medium">{submission.problem.title}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle[submission.status] ?? ""}`}>
                          {statusLabel[submission.status] ?? submission.status}
                        </span>
                        {!isPuzzle && (
                          <span className="text-sm text-muted tabular-nums">
                            {submission.passed}/{submission.total} tests
                          </span>
                        )}
                        {submission.penalty > 0 && <span className="text-sm text-[#c4271b] tabular-nums">−{submission.penalty} pts</span>}
                        <span className="ml-auto text-sm text-muted">{formatDateTime(submission.createdAt)}</span>
                      </summary>
                      {isPuzzle ? (
                        <p className="border-t border-line px-6 py-3.5 text-sm">Answered: {options[Number(submission.code)] ?? submission.code}</p>
                      ) : (
                        <pre className="overflow-x-auto bg-[#181a22] p-5 font-mono text-sm text-[#f5f5f7]">{submission.code}</pre>
                      )}
                    </details>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
