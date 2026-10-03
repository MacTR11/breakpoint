import Link from "next/link";
import { notFound } from "next/navigation";
import { ProblemForm } from "@/components/problem-form";
import { PageHeader, link } from "@/components/ui";
import { db } from "@/lib/db";
import { parseHints } from "@/lib/hints";
import { parseBanned, parseOptions, parseTests } from "@/lib/problems";
import { requireTeacher } from "@/lib/session";

// One test per line keeps the JSON readable in the form.
const formatTests = (tests: unknown[]) => (tests.length ? `[\n${tests.map((t) => `  ${JSON.stringify(t)}`).join(",\n")}\n]` : "");

export default async function EditProblemPage({ params }: PageProps<"/teacher/problems/[id]">) {
  await requireTeacher();
  const { id } = await params;
  const problem = await db.problem.findUnique({ where: { id } });
  if (!problem) notFound();
  if (problem.style === "ORDER" || problem.style === "TRACE") {
    return (
      <>
        <PageHeader path={[{ label: "teacher" }, { label: "problems", href: "/teacher/problems" }, { label: problem.slug }]} title="Edit problem" />
        <div className="card max-w-2xl px-6 py-6">
          <p>
            {problem.style === "ORDER" ? "Put-in-order" : "Trace-table"} challenges cannot be edited here. Change the file for it in <code className="font-mono text-sm">content/problems</code>, then run{" "}
            <code className="font-mono text-sm">npm run verify</code> and <code className="font-mono text-sm">npm run db:seed</code>.
          </p>
          <p className="mt-3">
            <Link href={`/problems/${problem.slug}`} className={link}>
              Open the challenge
            </Link>
          </p>
        </div>
      </>
    );
  }
  const options = parseOptions(problem);

  return (
    <>
      <PageHeader path={[{ label: "teacher" }, { label: "problems", href: "/teacher/problems" }, { label: problem.slug }]} title="Edit problem" />
      <ProblemForm
        values={{
          id: problem.id,
          title: problem.title,
          slug: problem.slug,
          kind: problem.kind,
          difficulty: problem.difficulty,
          topic: problem.topic,
          track: problem.track,
          style: problem.style,
          hints: parseHints(problem).join("\n"),
          specRef: problem.specRef,
          points: problem.points,
          description: problem.description,
          published: problem.published,
          functionName: problem.functionName ?? "",
          starterCode: problem.starterCode ?? "",
          tests: formatTests(parseTests(problem)),
          solution: problem.solution ?? "",
          banned: parseBanned(problem).join(", "),
          options: options.join("\n"),
          answer: options.length ? (options[Number(problem.answer)] ?? "") : (problem.answer ?? ""),
          explanation: problem.explanation ?? "",
        }}
      />
    </>
  );
}
