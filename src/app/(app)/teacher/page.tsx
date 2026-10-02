import Link from "next/link";
import { Avatar, Card, PageHeader, buttonStyle, formatDateTime, signed } from "@/components/ui";
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
      <PageHeader title="Students" intro="Everyone who has signed in. Select a student to read their submitted code.">
        <a href="/teacher/export" className={buttonStyle.secondary}>
          Download CSV
        </a>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-4 mb-10">
        {[
          ["Students", students.length],
          ["Active this week", active],
          ["Submissions this week", weekSubmissions],
          ["Solved this week", weekSolves],
        ].map(([label, value]) => (
          <Card key={label} className="p-6">
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-1 text-4xl font-semibold tracking-tight tabular-nums">{value}</p>
          </Card>
        ))}
      </div>

      {ranked.length === 0 ? (
        <Card className="p-10 text-center text-muted">No students have signed in yet. Share the site address with your class to get started.</Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-muted">
              <tr className="border-b border-line">
                <th className="px-6 py-3 font-medium">Student</th>
                <th className="px-6 py-3 font-medium text-right">Points</th>
                <th className="px-6 py-3 font-medium text-right">Solved</th>
                <th className="px-6 py-3 font-medium text-right">Submissions</th>
                <th className="px-6 py-3 font-medium">Last active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {ranked.map((s) => (
                <tr key={s.id} className="hover:bg-white/60">
                  <td className="px-6 py-3.5">
                    <Link href={`/teacher/students/${s.id}`} className="flex items-center gap-3">
                      <Avatar name={s.name} image={s.image} size={30} />
                      <span>
                        <span className="block font-medium text-base">{s.name}</span>
                        <span className="text-muted">{s.email}</span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-3.5 text-right tabular-nums font-semibold">{signed(s.points)}</td>
                  <td className="px-6 py-3.5 text-right tabular-nums">{s.solved}</td>
                  <td className="px-6 py-3.5 text-right tabular-nums">{s.submissions}</td>
                  <td className="px-6 py-3.5 text-muted whitespace-nowrap">{s.lastActive ? formatDateTime(s.lastActive) : "Never"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
