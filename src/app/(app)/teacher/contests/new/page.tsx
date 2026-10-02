import { ContestForm } from "@/components/contest-form";
import { PageHeader } from "@/components/ui";
import { contestProblemOptions } from "@/lib/contest-options";
import { requireTeacher } from "@/lib/session";

export default async function NewContestPage() {
  await requireTeacher();
  return (
    <>
      <PageHeader path={[{ label: "teacher" }, { label: "competitions", href: "/teacher/contests" }, { label: "new" }]} title="New competition" />
      <ContestForm values={{ title: "", description: "", startsAt: "", endsAt: "", problemIds: [] }} problems={await contestProblemOptions()} />
    </>
  );
}
