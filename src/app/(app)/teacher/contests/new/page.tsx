import Link from "next/link";
import { ContestForm } from "@/components/contest-form";
import { backLink } from "@/components/ui";
import { contestProblemOptions } from "@/lib/contest-options";

export default async function NewContestPage() {
  return (
    <>
      <Link href="/teacher/contests" className={backLink}>
        ‹ Competitions
      </Link>
      <h1 className="mt-4 mb-10 text-4xl font-semibold tracking-tight">New competition</h1>
      <ContestForm values={{ title: "", description: "", startsAt: "", endsAt: "", problemIds: [] }} problems={await contestProblemOptions()} />
    </>
  );
}
