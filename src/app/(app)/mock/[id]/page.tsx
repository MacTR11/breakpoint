import Link from "next/link";
import { notFound } from "next/navigation";
import { Countdown } from "@/components/countdown";
import { PageHeader, Sheet, Tag, formatDateTime, link } from "@/components/ui";
import { db } from "@/lib/db";
import { isRunning, paperEnd, paperResults } from "@/lib/mock";
import { requireUser } from "@/lib/session";
import { finishMock } from "../actions";

export const metadata = { title: "Mock paper" };

export default async function MockPaperPage({ params }: PageProps<"/mock/[id]">) {
  const user = await requireUser();
  const { id } = await params;
  const paper = await db.mockPaper.findUnique({ where: { id }, include: { user: { select: { name: true } } } });
  // Students see their own papers; the teacher sees anyone's.
  if (!paper || (paper.userId !== user.id && user.role !== "TEACHER")) notFound();
  const result = await paperResults(paper);
  const running = isRunning(paper);
  const mine = paper.userId === user.id;
  const taken = Math.round((paperEnd(paper).getTime() - paper.startedAt.getTime()) / 60_000);

  return (
    <Sheet width="max-w-3xl">
      <PageHeader path={[{ label: "mock papers", href: mine ? "/mock" : undefined }, { label: "paper" }]} title={running ? "Mock paper" : `${result.scored} of ${result.marks} marks`} />
      {running ? (
        <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <p>
            <span className="cap block">Time left</span>
            <Countdown to={paper.endsAt.toISOString()} className="figure text-[2.4rem] tabular-nums" />
          </p>
          <p>
            <span className="cap block">Marks</span>
            <span className="figure text-[2.4rem]">{result.marks}</span>
          </p>
          {mine && (
            <form action={finishMock} className="ml-auto">
              <input type="hidden" name="id" value={paper.id} />
              <button className="btn btn-secondary">Hand in now</button>
            </form>
          )}
        </div>
      ) : (
        <p className="-mt-3 mb-6 text-muted">
          {mine ? "" : `${paper.user.name} · `}
          {result.percent}% · sat {formatDateTime(paper.startedAt)} · {taken} of {paper.minutes} minutes used
        </p>
      )}

      <ol className="divide-y divide-line border-y border-line">
        {result.parts.map((part) => (
          <li key={part.id} className="flex items-center gap-3 py-3">
            <span className="min-w-0 flex-1">
              <Link href={`/problems/${part.slug}`} className="font-semibold hover:underline">
                {part.title}
              </Link>
              <span className="block text-[13px] text-muted">
                {!part.attempted ? "Not attempted" : part.scored === part.marks ? "Every test passed" : `Best attempt passed ${part.passed} of ${part.total} tests`}
              </span>
            </span>
            {running ? (
              part.scored === part.marks && part.attempted ? <Tag color="var(--pass)">Done</Tag> : part.attempted ? <Tag color="var(--warn)">Started</Tag> : null
            ) : (
              <span className="text-sm font-semibold tabular-nums">
                {part.scored} / {part.marks}
              </span>
            )}
            {running && <span className="w-16 text-right text-sm font-semibold tabular-nums text-muted">[{part.marks}]</span>}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-sm text-muted">
        {running
          ? "Open a question to answer it; the clock keeps running while you work. Each submission is marked straight away."
          : "Marks are estimated from the tests your code passed: full marks once every test passes, and a share of them otherwise. Open a question you solved to read its mark scheme."}
      </p>
      {!running && mine && (
        <Link href="/mock" className={`mt-6 inline-block font-medium ${link}`}>
          Sit another paper
        </Link>
      )}
    </Sheet>
  );
}
