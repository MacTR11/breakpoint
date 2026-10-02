import { TeacherTabs } from "@/components/teacher-tabs";
import { Sheet } from "@/components/ui";
import { siteName } from "@/lib/config";
import { requireTeacher } from "@/lib/session";

export const metadata = { title: { default: "Teacher", template: `%s · ${siteName}` } };

export default async function TeacherLayout({ children }: LayoutProps<"/teacher">) {
  await requireTeacher();
  return (
    <Sheet>
      <TeacherTabs />
      {children}
    </Sheet>
  );
}
