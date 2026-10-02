import Link from "next/link";
import { notFound } from "next/navigation";
import { ClassForm, DeleteClass, ResetClassPasswords } from "@/components/class-forms";
import { PageHeader, Tag, buttonStyle, formatDateTime, link, ordinal, signed, tone } from "@/components/ui";
import { YEAR_LABEL, classStandings, topicGrid } from "@/lib/classes";
import { db } from "@/lib/db";
import { duration, flagsByChallenge, mightBeFlagged, pasteFlag } from "@/lib/integrity";
import { daysAgo } from "@/lib/scoring";
import { getCurrentUser, requireTeacher } from "@/lib/session";

export async function generateMetadata({ params }: PageProps<"/teacher/classes/[id]">) {
  if ((await getCurrentUser())?.role !== "TEACHER") return { title: "Class" };
  const group = await db.class.findUnique({ where: { id: (await params).id } });
  return { title: group?.name ?? "Class" };
}

export default async function ClassPage({ params }: PageProps<"/teacher/classes/[id]">) {
  await requireTeacher();
  const { id } = await params;
  const group = await db.class.findUnique({ where: { id } });
  if (!group) notFound();

  const since = daysAgo(7);
  const [grid, standings, week, suspicious, homeworkSet] = await Promise.all([
    topicGrid(id),
    classStandings(),
    classStandings({ from: since }),
    db.submission.findMany({
      where: { user: { classId: id, role: "STUDENT" }, ...mightBeFlagged },
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        userId: true,
        problemId: true,
        code: true,
        pastedChars: true,
        largestPaste: true,
        typedChars: true,
        seconds: true,
        createdAt: true,
        user: { select: { id: true, name: true } },
        problem: { select: { title: true } },
      },
    }),
    db.homework.count({ where: { classId: id } }),
  ]);
  const standing = standings.find((c) => c.id === id);
  const thisWeek = week.find((c) => c.id === id);
  const flagged = flagsByChallenge(suspicious).slice(0, 15);
  const color = standing?.color ?? "#8e8e93";

  return (
    <>
      <PageHeader path={[{ label: "teacher" }, { label: "classes", href: "/teacher/classes" }, { label: group.name }]} title={group.name}>
        <Link href={`/teacher/classes/${id}/reports`} className={buttonStyle.secondary}>
          Print reports
        </Link>
      </PageHeader>
      <p className="-mt-3 mb-7">
        <Tag color={color}>{YEAR_LABEL[group.year]}</Tag>
      </p>

      <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
        <div>
          <p className="cap">Students</p>
          <p className="figure text-[2.1rem]">{grid.rows.length}</p>
          <p className="text-[13px] text-muted">{thisWeek?.active ?? 0} solved something this week</p>
        </div>
        <div>
          <p className="cap">Points each</p>
          <p className="figure text-[2.1rem]">{signed(standing?.averagePoints ?? 0)}</p>
          <p className="text-[13px] text-muted">{standing ? `${ordinal(standing.rank)} of ${standings.length} classes` : ""}</p>
        </div>
        <div>
          <p className="cap">This week</p>
          <p className="figure text-[2.1rem]">{signed(thisWeek?.averagePoints ?? 0)}</p>
          <p className="text-[13px] text-muted">{thisWeek ? `${ordinal(thisWeek.rank)} this week` : ""}</p>
        </div>
        <div>
          <p className="cap">Solved each</p>
          <p className="figure text-[2.1rem]">{standing?.averageSolved ?? 0}</p>
          <p className="text-[13px] text-muted">challenges, on average</p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Topics</h2>
        <p className="mt-1 mb-4 max-w-2xl text-sm text-muted">
          How much of each topic&apos;s practice each student has solved. A square fills with the topic&apos;s colour as they go, and is solid once the topic is finished.
        </p>
        {grid.rows.length === 0 ? (
          <p className="border-y border-line py-6 text-muted">
            Nobody is in this class yet. Move students in from the{" "}
            <Link href="/teacher" className={link}>
              Students
            </Link>{" "}
            page.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="tbl topic-grid">
              <thead>
                <tr>
                  <th>Student</th>
                  {grid.tracks.map((t) => (
                    <th key={t.id} className="text-center" title={`${t.title} (${t.total})`}>
                      <span className="icon mx-auto !h-7 !w-auto min-w-7 px-1.5 !text-[11px]" style={tone(t.color)}>
                        {t.glyph}
                      </span>
                      <span className="sr-only">{t.title}</span>
                    </th>
                  ))}
                  <th className="num">Solved</th>
                  <th className="num">Points</th>
                  <th className="num">Flags</th>
                </tr>
              </thead>
              <tbody>
                {grid.rows.map((row) => (
                  <tr key={row.id}>
                    <td className="whitespace-nowrap">
                      <Link href={`/teacher/students/${row.id}`} className={link}>
                        {row.name}
                      </Link>
                    </td>
                    {grid.tracks.map((t, i) => (
                      <td key={t.id} className="text-center">
                        <Cell solved={row.cells[i]} total={t.total} color={t.color} title={`${row.name}: ${row.cells[i]} of ${t.total} in ${t.title}`} />
                      </td>
                    ))}
                    <td className="num">{row.solved}</td>
                    <td className="num">{signed(row.points)}</td>
                    <td className="num">{row.flags > 0 ? <Tag color="var(--warn)">{row.flags}</Tag> : <span className="text-muted">0</span>}</td>
                  </tr>
                ))}
                <tr>
                  <td className="text-sm font-semibold text-muted">Class average</td>
                  {grid.tracks.map((t, i) => (
                    <td key={t.id} className="text-center">
                      <Cell solved={Math.round(grid.average[i] * 10) / 10} total={t.total} color={t.color} title={`Class average: ${grid.average[i].toFixed(1)} of ${t.total} in ${t.title}`} />
                    </td>
                  ))}
                  <td className="num">{standing?.averageSolved ?? 0}</td>
                  <td className="num">{signed(standing?.averagePoints ?? 0)}</td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Paste flags</h2>
        <p className="mt-1 mb-4 max-w-2xl text-sm text-muted">
          Challenges where a large piece of code was pasted in from outside the editor, with the latest flagged submission. A flag is a reason for a conversation, not proof: code can be retyped from
          another screen, and pasting your own work back is not counted.
        </p>
        {flagged.length === 0 ? (
          <p className="border-y border-line py-5 text-muted">Nothing flagged in this class.</p>
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {flagged.map((s) => (
              <li key={s.id} className="py-2.5">
                <p className="flex flex-wrap items-baseline gap-x-3">
                  <Link href={`/teacher/students/${s.user.id}`} className={link}>
                    {s.user.name}
                  </Link>
                  <span>{s.problem.title}</span>
                  <span className="ml-auto text-sm text-muted">{formatDateTime(s.createdAt)}</span>
                </p>
                <p className="text-sm">
                  <span className="text-warn">{pasteFlag(s)}.</span>{" "}
                  <span className="text-muted">
                    Typed {s.typedChars} characters · editor open {duration(s.seconds)}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10 border-t border-line pt-8">
        <h2 className="mb-4 text-lg font-semibold">Class details</h2>
        <ClassForm group={{ id: group.id, name: group.name, year: group.year }} />
      </section>

      <section className="mt-10 border-t border-line pt-8">
        <h2 className="text-lg font-semibold">Passwords</h2>
        <p className="mt-1 mb-4 max-w-2xl text-sm text-muted">
          Gives every student in {group.name} a new made-up password and shows the sheet to hand out. Use it at the start of a year, or if a class list has been shared.
        </p>
        <ResetClassPasswords id={group.id} name={group.name} students={grid.rows.length} />
      </section>

      <section className="mt-10 border-t border-line pt-8">
        <DeleteClass id={group.id} name={group.name} homework={homeworkSet} />
      </section>
    </>
  );
}

/** One square of the topic grid: empty, filling with the topic's colour, solid when finished. */
function Cell({ solved, total, color, title }: { solved: number; total: number; color: string; title: string }) {
  const share = total ? Math.min(solved / total, 1) : 0;
  return (
    <span
      title={title}
      className="cell"
      data-done={share >= 1 ? "" : undefined}
      data-strong={share >= 0.5 ? "" : undefined}
      style={{ "--tone": color, "--fill": `${Math.round(share * 85)}%` } as React.CSSProperties}
    >
      {solved > 0 ? solved : ""}
    </span>
  );
}
