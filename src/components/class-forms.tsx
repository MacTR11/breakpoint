"use client";

import { useActionState } from "react";
import { deleteClass, resetClassPasswords, saveClass } from "@/app/(app)/teacher/classes/actions";
import { FormErrors, field, label as labelStyle } from "@/components/form-bits";
import { HoldButton } from "@/components/hold-button";
import { SignInSheet } from "@/components/student-forms";

/** Lower or upper sixth, as a segmented control. */
function YearChoice({ value }: { value: string }) {
  return (
    <fieldset>
      <legend className={labelStyle}>Year</legend>
      <div className="segmented mt-1.5" key={value}>
        <label>
          <input type="radio" name="year" value="LOWER" defaultChecked={value !== "UPPER"} />
          Lower sixth
        </label>
        <label>
          <input type="radio" name="year" value="UPPER" defaultChecked={value === "UPPER"} />
          Upper sixth
        </label>
      </div>
    </fieldset>
  );
}

/** Add a class, or with `group`, rename one or change its year. */
export function ClassForm({ group }: { group?: { id: string; name: string; year: string } }) {
  const [state, action, pending] = useActionState(saveClass, null);
  const values = state?.values ?? group ?? { name: "", year: "LOWER" };
  return (
    <form action={action} className="space-y-4">
      {group && <input type="hidden" name="id" value={group.id} />}
      <div className="flex flex-wrap items-end gap-4">
        <label className={`${labelStyle} w-40`}>
          Name
          <input name="name" required maxLength={40} defaultValue={values.name} placeholder="12A" autoComplete="off" className={field} />
        </label>
        <YearChoice value={values.year} />
        <button disabled={pending} className={`btn ${group ? "btn-primary" : "btn-secondary"}`}>
          {pending ? "Saving…" : group ? "Save" : "Add class"}
        </button>
        {state?.saved && (
          <span role="status" className="rise pb-2 text-sm font-medium text-pass">
            {group ? "Saved" : "Added"}
          </span>
        )}
      </div>
      <FormErrors state={state} />
    </form>
  );
}

/** New passwords for the whole class at once, with the sheet to hand out. */
export function ResetClassPasswords({ id, name, students }: { id: string; name: string; students: number }) {
  const [state, action, pending] = useActionState(resetClassPasswords, null);
  return (
    <div>
      <form
        action={action}
        onSubmit={(event) => {
          if (!window.confirm(`Give all ${students} students in ${name} new passwords? Their old passwords stop working at once and they are signed out.`)) event.preventDefault();
        }}
      >
        <input type="hidden" name="id" value={id} />
        <button disabled={pending || students === 0} className="btn btn-secondary">
          {pending ? "Making passwords…" : "New passwords for the class"}
        </button>
      </form>
      <FormErrors state={state} />
      {state && <SignInSheet logins={state.logins} />}
    </div>
  );
}

/** `homework`: how many pieces of homework were set for this class, which go with it. */
export function DeleteClass({ id, name, homework }: { id: string; name: string; homework: number }) {
  return (
    <form action={deleteClass} className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <input type="hidden" name="id" value={id} />
      <HoldButton>Hold to delete {name}</HoldButton>
      <span className="max-w-xl text-sm text-muted">
        The students stay, without a class, and keep everything they have solved.
        {homework > 0 && (
          <>
            {" "}
            <span className="font-semibold text-fail">
              The {homework === 1 ? "piece" : `${homework} pieces`} of homework set for {name} {homework === 1 ? "is" : "are"} deleted too.
            </span>
          </>
        )}
      </span>
    </form>
  );
}
