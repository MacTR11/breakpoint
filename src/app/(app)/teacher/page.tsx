import Link from "next/link";
import { PageHeader, buttonStyle, formatDateTime, link, signed } from "@/components/ui";
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
      <PageHeader path={[{ label: "teacher" }, { label: "students" }]} title="Students" intro="Everyone who has signed in. Select a student to read their submitted code.">
        <a href="/teacher/export" className={buttonStyle.secondary}>
          Download CSV
        </a>
      </PageHeader>

      <p className="mb-6 font-mono text-sm">
        {students.length} students · this week: {active} active, {weekSubmissions} submissions, {weekSolves} solved
      </p>

      {ranked.length === 0 ? (
        <p className="border-y border-line py-6 text-muted">No students have signed in yet. Share the site address with your class to get started.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
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
                  <td className="text-muted">{s.email}</td>
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
