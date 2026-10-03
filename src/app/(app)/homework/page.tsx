import { HomeworkTasks } from "@/components/homework-list";
import { PageHeader, Sheet } from "@/components/ui";
import { homeworkFor } from "@/lib/homework";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Homework" };

export default async function HomeworkPage() {
  const user = await requireUser();
  const sets = await homeworkFor(user);
  const now = new Date();
  const toDo = sets.filter((h) => h.state === "open" || h.state === "overdue");
  const finished = sets.filter((h) => h.state === "done" || h.state === "late").reverse();

  return (
    <Sheet width="max-w-3xl">
      <PageHeader path={[{ label: "homework" }]} title="Homework" intro="Challenges your teacher has set, with a date to finish them by. Anything you solved before it was set already counts." />
      {sets.length === 0 && <p className="border-y border-line py-6 text-muted">No homework has been set yet.</p>}
      {toDo.length > 0 && (
        <section>
          <h2 className="cap mb-1">To do</h2>
          <ul className="divide-y divide-line">
            {toDo.map((set) => (
              <li key={set.id} className="py-4">
                <HomeworkTasks set={set} />
              </li>
            ))}
          </ul>
        </section>
      )}
      {finished.length > 0 && (
        <section className={toDo.length > 0 ? "mt-8" : ""}>
          <h2 className="cap mb-1">Finished</h2>
          <ul className="divide-y divide-line">
            {finished.map((set) => (
              <li key={set.id} className="py-4">
                <HomeworkTasks set={set} compact={set.dueAt < now} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </Sheet>
  );
}
