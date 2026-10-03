import Link from "next/link";
import { PageHeader, link } from "@/components/ui";
import { LARGE_PASTE } from "@/lib/integrity";
import { teacherSessionHours } from "@/lib/config";
import { requireTeacher } from "@/lib/session";
import { pasteMode } from "@/lib/settings";
import { savePasteMode, signOutEverywhere } from "./actions";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireTeacher();
  const mode = await pasteMode();
  const hours = teacherSessionHours();
  return (
    <>
      <PageHeader path={[{ label: "teacher" }, { label: "settings" }]} title="Settings" />

      <section className="max-w-2xl">
        <h2 className="text-lg font-semibold">Pasting into the code editor</h2>
        <div className="mt-1 space-y-2 text-sm text-muted">
          <p>
            The editor counts what each student types and what they paste in from outside it, and keeps the counts with every submission. Moving their own code around inside the editor is not counted.
            A single paste of {LARGE_PASTE} characters or more, or a submission that is mostly pasted, is flagged on the{" "}
            <Link href="/teacher/classes" className={link}>
              class pages
            </Link>{" "}
            and the student&apos;s page.
          </p>
          <p>Neither setting can stop a student retyping an answer from another screen, so treat a flag as a reason for a conversation rather than proof. Teachers are never blocked.</p>
        </div>

        <form action={savePasteMode} className="mt-5 space-y-4">
          <fieldset>
            <legend className="sr-only">When a student pastes a large piece of code</legend>
            <div className="segmented">
              <label>
                <input type="radio" name="pasteMode" value="record" defaultChecked={mode === "record"} />
                Record large pastes
              </label>
              <label>
                <input type="radio" name="pasteMode" value="block" defaultChecked={mode === "block"} />
                Record and block them
              </label>
            </div>
          </fieldset>
          <p className="text-sm text-muted">Now: {mode === "block" ? "large pastes are refused, and the student is asked to type their solution." : "large pastes are allowed and noted for you."}</p>
          <button className="btn btn-primary">Save</button>
        </form>
      </section>

      <section className="mt-10 max-w-2xl border-t border-line pt-8">
        <h2 className="text-lg font-semibold">Backups</h2>
        <div className="mt-1 space-y-2 text-sm text-muted">
          <p>
            A copy of the whole site&apos;s data: every student, their work and their passwords (stored as one-way hashes, which cannot be read back). Download one every week, and before
            any big change, and keep it somewhere your college allows for student data.
          </p>
          <p>
            If the server&apos;s copy is ever lost, the database file can be replaced with the latest backup; see DEPLOYING.md. For a spreadsheet of results instead, use{" "}
            <a href="/teacher/export" className={link}>
              Download results
            </a>
            .
          </p>
        </div>
        <a href="/teacher/backup" className="btn btn-secondary mt-4" download>
          Download a backup
        </a>
      </section>

      <section className="mt-10 max-w-2xl border-t border-line pt-8">
        <h2 className="text-lg font-semibold">Your sign-in</h2>
        <div className="mt-1 space-y-2 text-sm text-muted">
          <p>
            Your account can see every student, so a teacher sign-in lasts {hours} hours and then asks again (set <code className="font-mono text-ink">TEACHER_SESSION_HOURS</code>{" "}
            to change it). Changing <code className="font-mono text-ink">TEACHER_USERNAME</code> or <code className="font-mono text-ink">TEACHER_PASSWORD</code> signs you out
            everywhere at once.
          </p>
          <p>Left signed in on a classroom computer? This signs you out on every device, this one included.</p>
        </div>
        <form action={signOutEverywhere} className="mt-4">
          <button className="btn btn-secondary">Sign out everywhere</button>
        </form>
      </section>
    </>
  );
}
