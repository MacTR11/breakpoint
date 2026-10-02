import Link from "next/link";
import { ClassForm } from "@/components/class-forms";
import { PageHeader, Tag, buttonStyle, link, signed, tone } from "@/components/ui";
import { YEAR_LABEL, classStandings } from "@/lib/classes";
import { daysAgo } from "@/lib/scoring";
import { requireTeacher } from "@/lib/session";
import { studentSummaries } from "@/lib/students";

export const metadata = { title: "Classes" };

export default async function ClassesPage() {
  await requireTeacher();
  const [allTime, week, students] = await Promise.all([classStandings(), classStandings({ from: daysAgo(7) }), studentSummaries()]);
  const weekOf = new Map(week.map((c) => [c.id, c]));
  const flagsOf = (classId: string) => students.filter((s) => s.classId === classId).reduce((sum, s) => sum + s.flags, 0);
  const unassigned = students.filter((s) => !s.classId).length;
  const top = Math.max(...allTime.map((c) => c.averagePoints), 1);

  return (
    <>
      <PageHeader
        path={[{ label: "teacher" }, { label: "classes" }]}
        title="Classes"
        intro="Classes are compared on their average points per student, counting everyone in the class, so a class climbs by getting every student solving."
      >
        <Link href="/present" className={buttonStyle.secondary}>
          Projector view
        </Link>
      </PageHeader>

      {allTime.length === 0 ? (
        <p className="border-y border-line py-6 text-muted">
          No classes yet. Add them below (for example 12A and 12B in the lower sixth, 13A and 13B in the upper sixth), or include a <code className="font-mono text-ink">class</code> column when you
          import students.
        </p>
      ) : (
        <>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {allTime.map((c) => (
              <li key={c.id} className="grid">
                <Link href={`/teacher/classes/${c.id}`} className="tile flex min-h-[9.5rem] flex-col justify-between p-4" style={tone(c.color)}>
                  <span className="glyph text-[1.75rem]" aria-hidden="true">
                    #{c.rank}
                  </span>
                  <span>
                    <span className="block font-display text-2xl font-extrabold leading-tight">{c.name}</span>
                    <span className="text-sm opacity-90">{YEAR_LABEL[c.year]}</span>
                  </span>
                  <span>
                    <span className="figure text-[1.6rem]">{c.averagePoints}</span> <span className="text-sm opacity-90">points each</span>
                    <span className="meter mt-1.5 block" aria-hidden="true">
                      <span style={{ width: `${Math.max(0, (c.averagePoints / top) * 100)}%` }} />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 overflow-x-auto">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Class</th>
                  <th className="num">Students</th>
                  <th className="num">Points each</th>
                  <th className="num">This week</th>
                  <th className="num">Solved each</th>
                  <th className="num">Active this week</th>
                  <th className="num">Paste flags</th>
                </tr>
              </thead>
              <tbody>
                {allTime.map((c) => {
                  const flags = flagsOf(c.id);
                  return (
                    <tr key={c.id}>
                      <td>
                        <Link href={`/teacher/classes/${c.id}`} className={link}>
                          {c.name}
                        </Link>{" "}
                        <span className="text-sm text-muted">{YEAR_LABEL[c.year]}</span>
                      </td>
                      <td className="num">{c.students}</td>
                      <td className="num">{signed(c.averagePoints)}</td>
                      <td className="num">{signed(weekOf.get(c.id)?.averagePoints ?? 0)}</td>
                      <td className="num">{c.averageSolved}</td>
                      <td className="num">
                        {weekOf.get(c.id)?.active ?? 0} of {c.students}
                      </td>
                      <td className="num">{flags > 0 ? <Tag color="var(--warn)">{flags}</Tag> : <span className="text-muted">0</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {unassigned > 0 && (
        <p className="mt-5 text-sm text-muted">
          {unassigned} student{unassigned === 1 ? " has" : "s have"} no class.{" "}
          <Link href="/teacher?class=none" className={link}>
            Choose a class for them
          </Link>
          .
        </p>
      )}

      <section className="mt-10 border-t border-line pt-8">
        <h2 className="mb-4 text-lg font-semibold">Add a class</h2>
        <ClassForm />
      </section>
    </>
  );
}
