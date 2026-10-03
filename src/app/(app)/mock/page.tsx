import Link from "next/link";
import { Countdown } from "@/components/countdown";
import { MockBuilder } from "@/components/mock-builder";
import { PageHeader, Sheet, formatDateTime, link } from "@/components/ui";
import { db } from "@/lib/db";
import { examScenarios, isRunning, papersOf } from "@/lib/mock";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Mock papers" };

export default async function MockPapersPage() {
  const user = await requireUser();
  const [scenarios, papers, solves] = await Promise.all([examScenarios(), papersOf(user.id), db.solve.findMany({ where: { userId: user.id }, select: { problemId: true } })]);
  const solved = new Set(solves.map((s) => s.problemId));
  const running = papers.find(({ paper }) => isRunning(paper));
  const finished = papers.filter(({ paper }) => !isRunning(paper));

  return (
    <Sheet width="max-w-3xl">
      <PageHeader
        path={[{ label: "mock papers" }]}
        title="Mock papers"
        intro="Sit exam-style questions against the clock. Hints and model answers are off until you finish, and your marks are worked out from the tests your code passes."
      />

      {running ? (
        <div className="mb-8 rounded-[18px] bg-paper p-5">
          <p className="font-semibold">You are sitting a paper</p>
          <p className="text-sm text-muted">
            <Countdown to={running.paper.endsAt.toISOString()} className="font-semibold tabular-nums text-ink" /> left · {running.result.marks} marks
          </p>
          <Link href={`/mock/${running.paper.id}`} className="btn btn-primary mt-3">
            Back to the paper
          </Link>
        </div>
      ) : scenarios.length === 0 ? (
        <p className="border-y border-line py-6 text-muted">There are no exam-style questions in Practice at the moment.</p>
      ) : (
        <MockBuilder scenarios={scenarios.map((s) => ({ key: s.key, name: s.name, marks: s.marks, parts: s.parts.length, solved: s.parts.filter((p) => solved.has(p.id)).length }))} />
      )}

      {finished.length > 0 && (
        <section className="mt-10 border-t border-line pt-6">
          <h2 className="mb-2 text-lg font-semibold">Your papers</h2>
          <table className="tbl">
            <thead>
              <tr>
                <th>Sat</th>
                <th className="num">Marks</th>
                <th className="num">Score</th>
              </tr>
            </thead>
            <tbody>
              {finished.map(({ paper, result }) => (
                <tr key={paper.id}>
                  <td>
                    <Link href={`/mock/${paper.id}`} className={link}>
                      {formatDateTime(paper.startedAt)}
                    </Link>
                    <span className="ml-2 text-sm text-muted">{paper.minutes} min</span>
                  </td>
                  <td className="num">
                    {result.scored} / {result.marks}
                  </td>
                  <td className="num">{result.percent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </Sheet>
  );
}
