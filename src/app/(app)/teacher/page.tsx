import { StudentTable } from "@/components/student-table";
import { ButtonLink, FilterRow, PageHeader, buttonStyle, formatDateTime } from "@/components/ui";
import { allClasses } from "@/lib/classes";
import { db } from "@/lib/db";
import { daysAgo } from "@/lib/scoring";
import { studentSummaries } from "@/lib/students";

export default async function TeacherStudentsPage({ searchParams }: PageProps<"/teacher">) {
  const { class: classFilter } = await searchParams;
  const since = daysAgo(7);
  const [students, classes, weekSubmissions, weekSolves] = await Promise.all([
    studentSummaries(),
    allClasses(),
    db.submission.count({ where: { createdAt: { gte: since }, user: { role: "STUDENT" } } }),
    db.solve.count({ where: { solvedAt: { gte: since }, user: { role: "STUDENT" } } }),
  ]);
  const active = students.filter((s) => s.lastActive && s.lastActive >= since).length;
  const shown = students
    .filter((s) => (classFilter === "none" ? !s.classId : typeof classFilter === "string" ? s.classId === classFilter : true))
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
  const unassigned = students.filter((s) => !s.classId).length;

  return (
    <>
      <PageHeader path={[{ label: "teacher" }, { label: "students" }]} title="Students" intro="Everyone with an account. Select a student to read their submitted code or change their username and password.">
        <div className="flex flex-wrap gap-3">
          <a href="/teacher/export" className={buttonStyle.secondary}>
            Download results
          </a>
          <ButtonLink href="/teacher/students/new">Add students</ButtonLink>
        </div>
      </PageHeader>

      <p className="mb-5 text-sm text-muted">
        {students.length} student{students.length === 1 ? "" : "s"} · this week: {active} active, {weekSubmissions} submissions, {weekSolves} solved
      </p>

      {classes.length > 0 && (
        <div className="mb-4">
          <FilterRow
            label="class"
            options={[
              { label: "Everyone", href: "/teacher", active: !classFilter },
              ...classes.map((c) => ({ label: c.name, href: `/teacher?class=${c.id}`, active: classFilter === c.id })),
              ...(unassigned > 0 || classFilter === "none" ? [{ label: `No class (${unassigned})`, href: "/teacher?class=none", active: classFilter === "none" }] : []),
            ]}
          />
        </div>
      )}

      {students.length === 0 ? (
        <p className="border-y border-line py-6 text-muted">There are no students yet. Choose Add students to import your class from a CSV file.</p>
      ) : shown.length === 0 ? (
        <p className="border-y border-line py-6 text-muted">Nobody here.</p>
      ) : (
        <StudentTable
          key={String(classFilter)}
          classes={classes.map((c) => ({ id: c.id, name: c.name }))}
          rows={shown.map((s) => ({
            id: s.id,
            name: s.name,
            username: s.username,
            className: s.className,
            points: s.points,
            solved: s.solved,
            submissions: s.submissions,
            flags: s.flags,
            lastActive: s.lastActive ? formatDateTime(s.lastActive) : "Never",
          }))}
        />
      )}
    </>
  );
}
