import { getCurrentUser } from "@/lib/session";
import { studentSummaries } from "@/lib/students";

// Quote every field, and neutralise values a spreadsheet would run as a formula.
const cell = (value: string | number) => {
  const text = String(value);
  return `"${(/^[=+\-@]/.test(text) ? `'${text}` : text).replace(/"/g, '""')}"`;
};

export async function GET() {
  const user = await getCurrentUser();
  if (user?.role !== "TEACHER") return new Response("Forbidden", { status: 403 });

  const rows = [
    ["Name", "Class", "Username", "Points", "Solved", "Submissions", "Paste flags", "Last active"],
    ...(await studentSummaries()).map((s) => [s.name, s.className, s.username, s.points, s.solved, s.submissions, s.flags, s.lastActive?.toISOString() ?? ""]),
  ];
  return new Response(rows.map((row) => row.map(cell).join(",")).join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="students-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
