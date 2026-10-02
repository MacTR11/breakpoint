import { HomeworkForm } from "@/components/homework-form";
import { PageHeader } from "@/components/ui";
import { allClasses } from "@/lib/classes";
import { homeworkChallenges } from "@/lib/homework";
import { londonDay, shiftDay } from "@/lib/london";

export const metadata = { title: "Set homework" };

export default async function NewHomeworkPage({ searchParams }: PageProps<"/teacher/homework/new">) {
  const { class: classId } = await searchParams;
  const [classes, challenges] = await Promise.all([allClasses(), homeworkChallenges()]);
  // A week today, first thing in the morning.
  const dueAt = `${shiftDay(londonDay(), 7)}T08:30`;
  return (
    <>
      <PageHeader path={[{ label: "teacher" }, { label: "homework", href: "/teacher/homework" }, { label: "new" }]} title="Set homework" />
      <HomeworkForm
        values={{ title: "", note: "", classId: typeof classId === "string" ? classId : "", dueAt, problemIds: [] }}
        classes={classes.map((c) => ({ id: c.id, name: c.name }))}
        challenges={challenges}
      />
    </>
  );
}
