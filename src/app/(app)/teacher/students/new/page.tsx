import { AddStudent, ImportStudents } from "@/components/student-forms";
import { PageHeader } from "@/components/ui";
import { MAX_IMPORT, MIN_PASSWORD } from "@/lib/accounts";
import { allClasses } from "@/lib/classes";
import { requireTeacher } from "@/lib/session";

export const metadata = { title: "Add students" };

export default async function NewStudentsPage() {
  await requireTeacher();
  const classes = await allClasses();
  return (
    <>
      <PageHeader
        path={[{ label: "teacher" }, { label: "students", href: "/teacher" }, { label: "add" }]}
        title="Add students"
        intro="Students cannot sign themselves up. You create their accounts here, then hand out the usernames and passwords."
      />

      <section>
        <h2 className="text-lg font-semibold">Import a class</h2>
        <div className="mt-2 mb-5 max-w-2xl space-y-2 text-sm text-muted">
          <p>
            One student per row, with a heading row naming the columns: <code className="font-mono text-ink">name</code> (or <code className="font-mono text-ink">first name</code> and{" "}
            <code className="font-mono text-ink">surname</code>), and optionally <code className="font-mono text-ink">class</code>, <code className="font-mono text-ink">username</code> and{" "}
            <code className="font-mono text-ink">password</code>.
          </p>
          <p>A class that does not exist yet is made for you: names with 13 or U6 in them go in the upper sixth, the rest in the lower sixth (you can change that on the Classes page).</p>
          <p>
            A missing username is made from the name (Ada Lovelace becomes <code className="font-mono text-ink">alovelace</code>). A missing password is made up for you. Passwords need at least{" "}
            {MIN_PASSWORD} characters. Up to {MAX_IMPORT} rows at a time.
          </p>
          <p>
            A row whose username already exists updates that student instead: their name, and their password if the row gives one. That is how to change many passwords at once. If any row has a
            problem, nothing is imported.
          </p>
        </div>
        <ImportStudents />
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="mb-4 text-lg font-semibold">Add one student</h2>
        <AddStudent classes={classes} />
      </section>
    </>
  );
}
