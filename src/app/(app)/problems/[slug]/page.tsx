import Link from "next/link";
import { notFound } from "next/navigation";
import { CodeWorkspace } from "@/components/code-workspace";
import { Countdown } from "@/components/countdown";
import { HintPanel } from "@/components/hint-panel";
import { Markdown } from "@/components/markdown";
import { PuzzleCard } from "@/components/puzzle-card";
import { DifficultyBadge, KindBadge, backLink } from "@/components/ui";
import { db } from "@/lib/db";
import { hintWallet, parseHints } from "@/lib/hints";
import { findViewableProblem, isLive, MAX_PUZZLE_ATTEMPTS, parseBanned, parseOptions, parseTests, pointsFor, puzzlePenalty } from "@/lib/problems";
import { requireUser } from "@/lib/session";
import { trackTitle } from "@/lib/tracks";

export async function generateMetadata({ params }: PageProps<"/problems/[slug]">) {
  const { slug } = await params;
  const problem = await db.problem.findUnique({ where: { slug }, select: { title: true } });
  return { title: problem?.title ?? "Challenge" };
}

export default async function ProblemPage({ params }: PageProps<"/problems/[slug]">) {
  const user = await requireUser();
  const { slug } = await params;
  const isTeacher = user.role === "TEACHER";
  const problem = await findViewableProblem(slug, isTeacher);
  if (!problem) notFound();

  const liveContest = problem.contests.map((c) => c.contest).find((c) => isLive(c));
  const [solve, lastSubmission, wrong, unlockedCount, wallet] = await Promise.all([
    db.solve.findUnique({ where: { userId_problemId: { userId: user.id, problemId: problem.id } } }),
    db.submission.findFirst({ where: { userId: user.id, problemId: problem.id }, orderBy: { createdAt: "desc" } }),
    db.submission.findMany({ where: { userId: user.id, problemId: problem.id, status: "WRONG" }, select: { code: true } }),
    db.hintUnlock.count({ where: { userId: user.id, problemId: problem.id } }),
    hintWallet(user.id),
  ]);
  const locked = problem.kind === "PUZZLE" && !solve && wrong.length >= MAX_PUZZLE_ATTEMPTS;

  // Only hints the student has paid for are sent to the browser. Once the
  // challenge is over for them (solved or locked) the rest are free.
  const hints = parseHints(problem);
  const finished = Boolean(solve) || locked;
  const hintPanel = (
    <HintPanel
      slug={problem.slug}
      total={hints.length}
      unlocked={finished ? hints : hints.slice(0, unlockedCount)}
      balance={wallet.balance}
      untilNext={wallet.untilNext}
      free={isTeacher}
    />
  );

  const header = (
    <div>
      {liveContest ? (
        <Link href={`/contests/${liveContest.id}`} className={`inline-flex flex-wrap items-center gap-x-2 ${backLink}`}>
          ‹ {liveContest.title}
          <span className="text-muted">
            ends in <Countdown to={liveContest.endsAt!.toISOString()} className="font-mono" />
          </span>
        </Link>
      ) : (
        <Link href="/problems" className={backLink}>
          ‹ Practice
        </Link>
      )}
      <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">{problem.title}</h1>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <KindBadge kind={problem.kind} style={problem.style} />
        <DifficultyBadge difficulty={problem.difficulty} />
        <span className="text-sm text-muted">
          {problem.points} points · {trackTitle(problem.track)}
        </span>
        {!problem.published && <span className="badge bg-black/10">Unpublished</span>}
      </div>
    </div>
  );

  if (problem.kind === "CODE") {
    const tests = parseTests(problem);
    return (
      <CodeWorkspace
        userId={user.id}
        slug={problem.slug}
        functionName={problem.functionName ?? ""}
        starterCode={problem.starterCode ?? ""}
        savedCode={lastSubmission?.code ?? null}
        visibleTests={tests.filter((t) => !t.hidden)}
        hiddenCount={tests.filter((t) => t.hidden).length}
        banned={parseBanned(problem)}
        points={problem.points}
        isFix={problem.style === "FIX"}
        solved={Boolean(solve)}
        header={header}
        description={<Markdown>{problem.description}</Markdown>}
        hints={hintPanel}
        teacherNotes={
          isTeacher && problem.solution ? (
            <details className="mt-10 rounded-2xl border border-white/60 bg-white/45 p-5">
              <summary className="cursor-pointer text-sm font-medium">Reference solution (teachers only)</summary>
              <pre className="mt-4 overflow-x-auto rounded-xl bg-[#1c1c1e] p-4 text-sm text-[#f5f5f7] font-mono">{problem.solution}</pre>
            </details>
          ) : null
        }
      />
    );
  }

  // Once a puzzle is locked its answer is shown, unless a live competition is using it.
  const reveal = locked && !liveContest ? { answer: problem.answer ?? "", explanation: problem.explanation } : null;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-12">
      <div className="glass rounded-[2rem] p-6 sm:p-10">
        {header}
        <div className="mt-8">
          <Markdown>{problem.description}</Markdown>
        </div>
        <PuzzleCard
          slug={problem.slug}
          options={parseOptions(problem)}
          fullPoints={problem.points}
          secondTryPoints={pointsFor(problem, 1)}
          penalty={puzzlePenalty(problem)}
          maxAttempts={MAX_PUZZLE_ATTEMPTS}
          wrongAnswers={wrong.map((w) => w.code)}
          solved={solve ? { points: solve.points, answer: problem.answer ?? "", explanation: problem.explanation } : null}
          locked={locked}
          reveal={reveal}
        />
        {hintPanel}
      </div>
    </main>
  );
}
