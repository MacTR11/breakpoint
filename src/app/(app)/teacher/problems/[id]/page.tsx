import { notFound } from "next/navigation";
import { ProblemForm } from "@/components/problem-form";
import { PageHeader } from "@/components/ui";
import { db } from "@/lib/db";
import { parseHints } from "@/lib/hints";
import { parseBanned, parseOptions, parseTests } from "@/lib/problems";

// One test per line keeps the JSON readable in the form.
const formatTests = (tests: unknown[]) => (tests.length ? `[\n${tests.map((t) => `  ${JSON.stringify(t)}`).join(",\n")}\n]` : "");

export default async function EditProblemPage({ params }: PageProps<"/teacher/problems/[id]">) {
  const { id } = await params;
  const problem = await db.problem.findUnique({ where: { id } });
  if (!problem) notFound();
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
