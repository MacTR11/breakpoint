import Link from "next/link";
import { notFound } from "next/navigation";
import { ContestForm } from "@/components/contest-form";
import { backLink } from "@/components/ui";
import { contestProblemOptions } from "@/lib/contest-options";
import { db } from "@/lib/db";
import { dateToLondonInput } from "@/lib/london";

export default async function EditContestPage({ params }: PageProps<"/teacher/contests/[id]">) {
  const { id } = await params;
  const contest = await db.contest.findUnique({ where: { id }, include: { problems: true } });
  if (!contest) notFound();

  return (
    <>
      <Link href="/teacher/contests" className={backLink}>
        ‹ Competitions
      </Link>
      <h1 className="mt-4 mb-10 text-4xl font-semibold tracking-tight">{contest.startsAt ? "Edit competition" : "Schedule competition"}</h1>
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
