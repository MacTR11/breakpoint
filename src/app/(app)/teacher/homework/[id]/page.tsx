import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteHomework, HomeworkForm } from "@/components/homework-form";
import { KindIcon, PageHeader, Tag, formatDateTime, link } from "@/components/ui";
import { allClasses } from "@/lib/classes";
import { homeworkChallenges, homeworkProgress, homeworkStateLabel } from "@/lib/homework";
import { dateToLondonInput } from "@/lib/london";
import { getCurrentUser, requireTeacher } from "@/lib/session";

export async function generateMetadata({ params }: PageProps<"/teacher/homework/[id]">) {
  if ((await getCurrentUser())?.role !== "TEACHER") return { title: "Homework" };
  const progress = await homeworkProgress((await params).id);
  return { title: progress?.set.title ?? "Homework" };
}

export default async function HomeworkPage({ params }: PageProps<"/teacher/homework/[id]">) {
  await requireTeacher();
  const { id } = await params;
  const [progress, classes, challenges] = await Promise.all([homeworkProgress(id), allClasses(), homeworkChallenges()]);
  if (!progress) notFound();
  const { set, problems, rows } = progress;
  const counts = { done: 0, late: 0, open: 0, overdue: 0 };
  for (const row of rows) counts[row.state]++;
  // Challenges since held back for a competition still need to be offered, so the form can keep them.
  const options = [...challenges, ...problems.filter((p) => !challenges.some((c) => c.id === p.id))];

  return (
    <>
      <PageHeader path={[{ label: "teacher" }, { label: "homework", href: "/teacher/homework" }, { label: set.title }]} title={set.title} />
      <p className="-mt-3 mb-6 text-sm text-muted">
        For {set.class?.name ?? "every class"} · due {formatDateTime(set.dueAt)} · {problems.length} challenge{problems.length === 1 ? "" : "s"}
      </p>

      <p className="mb-4 flex flex-wrap gap-2">
        {(Object.keys(counts) as (keyof typeof counts)[])
          .filter((state) => counts[state] > 0)
          .map((state) => (
            <Tag key={state} color={homeworkStateLabel[state][1]}>
              {counts[state]} {homeworkStateLabel[state][0].toLowerCase()}
            </Tag>
          ))}
      </p>

      {rows.length === 0 ? (
        <p className="border-y border-line py-6 text-muted">Nobody is in {set.class?.name ?? "any class"} yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="tbl topic-grid">
            <thead>
              <tr>
                <th>Student</th>
                {problems.map((p, i) => (
                  <th key={p.id} className="text-center" title={p.title}>
                    <span className="inline-block">
                      <KindIcon kind={p.kind} style={p.style} track={p.track} />
                    </span>
                    <span className="block text-xs tabular-nums" aria-hidden="true">
                      {i + 1}
                    </span>
                    <span className="sr-only">{p.title}</span>
                  </th>
                ))}
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="whitespace-nowrap">
                    <Link href={`/teacher/students/${row.id}`} className={link}>
                      {row.name}
                    </Link>
                  </td>
                  {row.times.map((at, i) => {
                    const late = at && at > set.dueAt;
                    return (
                      <td key={problems[i].id} className="text-center">
                        <span
                          className="cell"
                          data-done={at ? "" : undefined}
                          data-strong={at ? "" : undefined}
                          style={{ "--tone": late ? "var(--warn)" : "var(--pass)", "--fill": "0%" } as React.CSSProperties}
                          title={at ? `${problems[i].title}: solved ${formatDateTime(at)}${late ? " (late)" : ""}` : `${problems[i].title}: not solved`}
                        >
                          {at ? (late ? "late" : "✓") : ""}
                        </span>
                      </td>
                    );
                  })}
                  <td>
                    <Tag color={homeworkStateLabel[row.state][1]}>{homeworkStateLabel[row.state][0]}</Tag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ol className="mt-4 space-y-1 text-sm text-muted">
        {problems.map((p, i) => (
          <li key={p.id}>
            {i + 1}.{" "}
            <Link href={`/problems/${p.slug}`} className={link}>
              {p.title}
            </Link>
          </li>
        ))}
      </ol>

      <section className="mt-10 border-t border-line pt-8">
        <h2 className="mb-4 text-lg font-semibold">Change it</h2>
        <HomeworkForm
          values={{ id: set.id, title: set.title, note: set.note, classId: set.classId ?? "", dueAt: dateToLondonInput(set.dueAt), problemIds: problems.map((p) => p.id) }}
          classes={classes.map((c) => ({ id: c.id, name: c.name }))}
          challenges={options}
        />
      </section>

      <section className="mt-10 border-t border-line pt-8">
        <DeleteHomework id={set.id} />
      </section>
    </>
  );
}
