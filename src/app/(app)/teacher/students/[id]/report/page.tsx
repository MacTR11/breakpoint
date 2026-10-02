import { notFound } from "next/navigation";
import { PrintButton } from "@/components/print-button";
import { StudentReport } from "@/components/student-report";
import { Path } from "@/components/ui";
import { db } from "@/lib/db";

export const metadata = { title: "Report" };

export default async function StudentReportPage({ params }: PageProps<"/teacher/students/[id]/report">) {
  const { id } = await params;
  const student = await db.user.findUnique({ where: { id }, select: { id: true, role: true, username: true } });
  if (!student || student.role !== "STUDENT") notFound();
  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 print:hidden">
        <Path parts={[{ label: "teacher" }, { label: "students", href: "/teacher" }, { label: student.username, href: `/teacher/students/${id}` }, { label: "report" }]} />
        <PrintButton />
      </div>
      <StudentReport studentId={id} />
    </>
  );
}
