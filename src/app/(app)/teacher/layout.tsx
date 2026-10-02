import { TeacherTabs } from "@/components/teacher-tabs";
import { requireTeacher } from "@/lib/session";

export const metadata = { title: "Teacher" };

export default async function TeacherLayout({ children }: LayoutProps<"/teacher">) {
  await requireTeacher();
  return (
    <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-12">
      <TeacherTabs />
      {children}
    </main>
  );
}
