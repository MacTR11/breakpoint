import Link from "next/link";
import { ButtonLink, PageHeader, Tag, formatDateTime, link } from "@/components/ui";
import { homeworkSummaries } from "@/lib/homework";
import { requireTeacher } from "@/lib/session";

export const metadata = { title: "Homework" };

export default async function TeacherHomeworkPage() {
  await requireTeacher();
  const sets = await homeworkSummaries();
  const now = new Date();
  const upcoming = sets.filter((h) => h.dueAt > now).reverse();
  const past = sets.filter((h) => h.dueAt <= now);

  const table = (rows: typeof sets) => (
    <div className="overflow-x-auto">
      <table className="tbl">
        <thead>
          <tr>
            <th>Homework</th>
            <th>For</th>
            <th>Due</th>
            <th className="num">Challenges</th>
            <th>Finished</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((h) => (
            <tr key={h.id}>
              <td>
                <Link href={`/teacher/homework/${h.id}`} className={link}>
                  {h.title}
                </Link>
              </td>
              <td>{h.className ?? "Every class"}</td>
              <td className="whitespace-nowrap text-muted">{formatDateTime(h.dueAt)}</td>
              <td className="num">{h.challenges}</td>
              <td>
                <span className="flex items-center gap-3">
                  <span className="meter w-24" style={{ "--tone": "var(--pass)" } as React.CSSProperties} aria-hidden="true">
                    <span style={{ width: `${h.students ? (h.finished / h.students) * 100 : 0}%` }} />
                  </span>
                  <span className="whitespace-nowrap text-sm tabular-nums text-muted">
                    {h.finished} of {h.students}
                  </span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <PageHeader
        path={[{ label: "teacher" }, { label: "homework" }]}
        title="Homework"
        intro="Practice challenges set for a class, or for everyone, by a date. Students see it on their Home page with a tick beside each challenge they have solved."
      >
        <ButtonLink href="/teacher/homework/new">Set homework</ButtonLink>
      </PageHeader>

      <section>
        <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold">
          Coming up {upcoming.length > 0 && <Tag color="var(--accent)">{upcoming.length}</Tag>}
        </h2>
        {upcoming.length === 0 ? <p className="border-y border-line py-5 text-muted">Nothing set at the moment.</p> : table(upcoming)}
      </section>
      {past.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-2 text-lg font-semibold">Past</h2>
          {table(past)}
        </section>
      )}
    </>
  );
}
