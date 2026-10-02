import { notFound } from "next/navigation";
import { CodeWorkspace } from "@/components/code-workspace";
import { Countdown } from "@/components/countdown";
import { HintPanel } from "@/components/hint-panel";
import { Markdown } from "@/components/markdown";
import { PuzzleCard } from "@/components/puzzle-card";
import { Path, kindLabel, levelLabel } from "@/components/ui";
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
  const fileName = problem.kind === "CODE" ? `${problem.functionName}.py` : problem.slug;

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
      <Path
        parts={
          liveContest
            ? [{ label: "competitions", href: "/contests" }, { label: liveContest.title, href: `/contests/${liveContest.id}` }, { label: fileName }]
            : [{ label: "practice", href: "/problems" }, { label: problem.track, href: `/problems?track=${problem.track}` }, { label: fileName }]
        }
      />
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{problem.title}</h1>
      <p className="mt-2 text-sm text-muted">
        {kindLabel(problem.kind, problem.style)} · {levelLabel(problem.difficulty)} · {problem.points} points · {trackTitle(problem.track)}
        {!problem.published && " · unpublished"}
        {liveContest && (
          <>
            {" · "}competition ends in <Countdown to={liveContest.endsAt!.toISOString()} className="font-mono text-ink" />
          </>
        )}
      </p>
    </div>
  );

  if (problem.kind === "CODE") {
    const tests = parseTests(problem);
    return (
      <CodeWorkspace
        userId={user.id}
        slug={problem.slug}
        fileName={fileName}
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
            <details className="mt-10 border-t border-line pt-4">
              <summary className="cursor-pointer text-sm font-medium">Reference solution (teachers only)</summary>
              <pre className="mt-3 overflow-x-auto rounded-md border border-line bg-paper p-4 font-mono text-sm">{problem.solution}</pre>
            </details>
          ) : null
        }
      />
    );
  }

  // Once a puzzle is locked its answer is shown, unless a live competition is using it.
  const reveal = locked && !liveContest ? { answer: problem.answer ?? "", explanation: problem.explanation } : null;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      {header}
      <div className="mt-7">
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
    </main>
  );
}
