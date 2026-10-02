import { ProblemForm } from "@/components/problem-form";
import { PageHeader } from "@/components/ui";
import { requireTeacher } from "@/lib/session";

export default async function NewProblemPage() {
  await requireTeacher();
  return (
    <>
      <PageHeader path={[{ label: "teacher" }, { label: "problems", href: "/teacher/problems" }, { label: "new" }]} title="New problem" />
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
