import Link from "next/link";
import { ButtonLink, PageHeader, buttonStyle, formatDateTime, link, signed } from "@/components/ui";
import { db } from "@/lib/db";
import { daysAgo } from "@/lib/scoring";
import { studentSummaries } from "@/lib/students";

export default async function TeacherStudentsPage() {
  const since = daysAgo(7);
  const [students, weekSubmissions, weekSolves] = await Promise.all([
    studentSummaries(),
    db.submission.count({ where: { createdAt: { gte: since }, user: { role: "STUDENT" } } }),
    db.solve.count({ where: { solvedAt: { gte: since }, user: { role: "STUDENT" } } }),
  ]);
  const active = students.filter((s) => s.lastActive && s.lastActive >= since).length;
  const ranked = [...students].sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));

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

      {ranked.length === 0 ? (
        <p className="border-y border-line py-6 text-muted">There are no students yet. Choose Add students to import your class from a CSV file.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th>Student</th>
                <th>Username</th>
                <th className="num">Points</th>
                <th className="num">Solved</th>
                <th className="num">Submissions</th>
                <th>Last active</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((s) => (
                <tr key={s.id}>
                  <td>
                    <Link href={`/teacher/students/${s.id}`} className={link}>
                      {s.name}
                    </Link>
                  </td>
                  <td className="font-mono text-sm text-muted">{s.username}</td>
                  <td className="num">{signed(s.points)}</td>
                  <td className="num">{s.solved}</td>
                  <td className="num">{s.submissions}</td>
                  <td className="whitespace-nowrap text-muted">{s.lastActive ? formatDateTime(s.lastActive) : "Never"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
