import Link from "next/link";
import { ProblemForm } from "@/components/problem-form";
import { backLink } from "@/components/ui";

export default function NewProblemPage() {
  return (
    <>
      <Link href="/teacher/problems" className={backLink}>
        ‹ Problems
      </Link>
      <h1 className="mt-4 mb-10 text-4xl font-semibold tracking-tight">New problem</h1>
      <ProblemForm
        values={{
          title: "",
          slug: "",
          kind: "CODE",
          difficulty: "EASY",
          topic: "",
          track: "basics",
          style: "WRITE",
          hints: "",
          specRef: "2.2.1",
          points: 10,
          description: "",
          published: true,
          functionName: "",
          starterCode: "",
          tests: "",
          solution: "",
          banned: "",
          options: "",
          answer: "",
          explanation: "",
        }}
      />
    </>
  );
}
