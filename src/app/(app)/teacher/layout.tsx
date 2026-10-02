import { TeacherTabs } from "@/components/teacher-tabs";
import { requireTeacher } from "@/lib/session";

export const metadata = { title: "Teacher" };

export default async function TeacherLayout({ children }: LayoutProps<"/teacher">) {
  await requireTeacher();
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <TeacherTabs />
      {children}
    </main>
  );
}
