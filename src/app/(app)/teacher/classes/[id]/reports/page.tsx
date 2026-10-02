import { notFound } from "next/navigation";
import { PrintButton } from "@/components/print-button";
import { StudentReport } from "@/components/student-report";
import { Path } from "@/components/ui";
import { db } from "@/lib/db";
import { studentSummaries } from "@/lib/students";

export const metadata = { title: "Reports" };

/** A report for every student in a class, one to a printed page. */
export default async function ClassReportsPage({ params }: PageProps<"/teacher/classes/[id]/reports">) {
  const { id } = await params;
  const group = await db.class.findUnique({ where: { id }, include: { students: { where: { role: "STUDENT" }, orderBy: { name: "asc" }, select: { id: true } } } });
  if (!group) notFound();
  const summaries = await studentSummaries();
  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 print:hidden">
        <div>
          <Path parts={[{ label: "teacher" }, { label: "classes", href: "/teacher/classes" }, { label: group.name, href: `/teacher/classes/${id}` }, { label: "reports" }]} />
          <p className="text-sm text-muted">
            {group.students.length} report{group.students.length === 1 ? "" : "s"}, each printed on a page of its own.
          </p>
        </div>
        <PrintButton />
      </div>
      {group.students.length === 0 && <p className="text-muted">Nobody is in {group.name} yet.</p>}
      <div className="space-y-16">
        {group.students.map((s) => (
          <StudentReport key={s.id} studentId={s.id} summaries={summaries} />
        ))}
      </div>
    </>
  );
}
