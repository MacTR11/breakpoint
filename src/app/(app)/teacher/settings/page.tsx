import Link from "next/link";
import { PageHeader, link } from "@/components/ui";
import { LARGE_PASTE } from "@/lib/integrity";
import { requireTeacher } from "@/lib/session";
import { pasteMode } from "@/lib/settings";
import { savePasteMode } from "../classes/actions";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireTeacher();
  const mode = await pasteMode();
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
    </>
  );
}
