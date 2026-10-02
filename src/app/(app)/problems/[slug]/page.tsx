import Link from "next/link";
import { notFound } from "next/navigation";
import { CodeBlock } from "@/components/code-block";
import { CodeWorkspace } from "@/components/code-workspace";
import { Countdown } from "@/components/countdown";
import { HintPanel } from "@/components/hint-panel";
import { Markdown } from "@/components/markdown";
import { PuzzleCard } from "@/components/puzzle-card";
import { KindIcon, Path, Sheet, TopicName, kindLabel, levelLabel, link } from "@/components/ui";
import { db } from "@/lib/db";
import { hintWallet, parseHints } from "@/lib/hints";
import { paperUsing } from "@/lib/mock";
import { findViewableProblem, isLive, MAX_PUZZLE_ATTEMPTS, parseBanned, parseOptions, parseTests, pointsFor, puzzlePenalty } from "@/lib/problems";
import { requireUser } from "@/lib/session";
import { pasteMode } from "@/lib/settings";
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
  // While a mock paper uses this question, it starts from a clean editor with no hints or answers.
  const paper = isTeacher || problem.kind !== "CODE" ? null : await paperUsing(user.id, problem.id);
  const [solve, lastSubmission, wrong, unlockedCount, wallet] = await Promise.all([
    db.solve.findUnique({ where: { userId_problemId: { userId: user.id, problemId: problem.id } } }),
    db.submission.findFirst({ where: { userId: user.id, problemId: problem.id, ...(paper ? { createdAt: { gte: paper.startedAt } } : {}) }, orderBy: { createdAt: "desc" } }),
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
  const hintPanel = paper ? (
    <p className="mt-8 border-t border-line pt-5 text-sm text-muted">Hints are off during a mock paper.</p>
  ) : (
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
      {paper && (
        <p className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-[14px] bg-paper px-3.5 py-2 text-sm">
          <span className="font-semibold">Mock paper</span>
          <span>
            <Countdown to={paper.endsAt.toISOString()} className="font-semibold tabular-nums" /> left
          </span>
          <Link href={`/mock/${paper.id}`} className={`ml-auto font-medium ${link}`}>
            Back to the paper
          </Link>
        </p>
      )}
      <Path
        parts={
          liveContest
            ? [{ label: "competitions", href: "/contests" }, { label: liveContest.title, href: `/contests/${liveContest.id}` }, { label: fileName }]
            : [{ label: "practice", href: "/problems" }, { label: trackTitle(problem.track), href: `/problems?track=${problem.track}` }, { label: fileName }]
        }
      />
      <div className="flex items-center gap-3">
        <KindIcon kind={problem.kind} style={problem.style} track={problem.track} />
        <h1 className="font-display text-3xl font-extrabold tracking-tight">{problem.title}</h1>
      </div>
      <p className="mt-2 text-sm text-muted">
        {kindLabel(problem.kind, problem.style)} · {levelLabel(problem.difficulty)} · {problem.points} points · <TopicName track={problem.track} />
        {!problem.published && " · unpublished"}
        {liveContest && (
          <>
            {" · "}competition ends in <Countdown to={liveContest.endsAt!.toISOString()} className="font-semibold tabular-nums text-ink" />
          </>
        )}
      </p>
    </div>
  );

  if (problem.kind === "CODE") {
    const tests = parseTests(problem);
    // The mark scheme and a model answer appear once the challenge is solved,
    // and never while a live competition is using it. Teachers always see them.
    const showAnswer = isTeacher || (Boolean(solve) && !liveContest && !paper);
    const modelAnswer =
      showAnswer && (problem.explanation || problem.solution) ? (
        <section className="mt-9 border-t border-line pt-5" aria-label="Mark scheme and model answer">
          {problem.explanation && (
            <>
              <h2 className="cap">Mark scheme</h2>
              <div className="mt-3">
                <Markdown>{problem.explanation}</Markdown>
              </div>
            </>
          )}
          {problem.solution && (
            <details className={problem.explanation ? "mt-5" : ""}>
              <summary className="cursor-pointer text-sm font-semibold text-link">Compare with a model answer{isTeacher && !solve ? " (teachers see this before solving)" : ""}</summary>
              <div className="mt-3">
                <CodeBlock code={problem.solution} fileName={`model_${fileName}`} copy={isTeacher} />
              </div>
              <p className="mt-2 text-sm text-muted">There is more than one right answer. If yours passed every test, it is correct too.</p>
            </details>
          )}
        </section>
      ) : null;
    return (
      <CodeWorkspace
        // A fresh editor for each draft, so undo cannot carry a mock paper's code into practice when the paper ends.
        key={paper ? `mock-${paper.id}` : "practice"}
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
        blockPastes={!isTeacher && (await pasteMode()) === "block"}
        draftScope={paper ? `mock-${paper.id}` : ""}
        solved={Boolean(solve) && !paper}
        header={header}
        description={<Markdown>{problem.description}</Markdown>}
        hints={hintPanel}
        teacherNotes={modelAnswer}
      />
    );
  }

  // Once a puzzle is locked its answer is shown, unless a live competition is using it.
  const reveal = locked && !liveContest ? { answer: problem.answer ?? "", explanation: problem.explanation } : null;

  return (
    <Sheet width="max-w-3xl">
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
    </Sheet>
  );
}
