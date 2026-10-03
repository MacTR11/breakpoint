import { notFound } from "next/navigation";
import { ContestForm } from "@/components/contest-form";
import { PageHeader } from "@/components/ui";
import { contestProblemOptions } from "@/lib/contest-options";
import { db } from "@/lib/db";
import { dateToLondonInput } from "@/lib/london";
import { requireTeacher } from "@/lib/session";

export default async function EditContestPage({ params }: PageProps<"/teacher/contests/[id]">) {
  await requireTeacher();
  const { id } = await params;
  const contest = await db.contest.findUnique({ where: { id }, include: { problems: true } });
  if (!contest) notFound();

  return (
    <>
      <PageHeader
        path={[{ label: "teacher" }, { label: "competitions", href: "/teacher/contests" }, { label: contest.title }]}
        title={contest.startsAt ? "Edit competition" : "Schedule competition"}
      />
      <ContestForm
        values={{
          id: contest.id,
          title: contest.title,
          description: contest.description,
          startsAt: contest.startsAt ? dateToLondonInput(contest.startsAt) : "",
          endsAt: contest.endsAt ? dateToLondonInput(contest.endsAt) : "",
          problemIds: contest.problems.map((p) => p.problemId),
        }}
        problems={await contestProblemOptions(contest.id)}
      />
    </>
  );
}
