"use client";

import { useActionState } from "react";
import { addStudent, deleteStudent, importStudents, updateStudent, type Login } from "@/app/(app)/teacher/students/actions";
import { FormErrors, field, hint, label as labelStyle } from "@/components/form-bits";
import { HoldButton } from "@/components/hold-button";

type ClassOption = { id: string; name: string };

// Quote every cell, and neutralise values a spreadsheet would run as a formula.
const cell = (value: string) => `"${(/^[=+\-@]/.test(value) ? `'${value}` : value).replace(/"/g, '""')}"`;

function download(logins: Login[]) {
  const rows = [["Name", "Class", "Username", "Password"], ...logins.map((l) => [l.name, l.group, l.username, l.password ?? "(unchanged)"])];
  const url = URL.createObjectURL(new Blob([rows.map((row) => row.map(cell).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "breakpoint-sign-in-sheet.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

/** The usernames and passwords just set. This is the only time the passwords can be read. */
export function SignInSheet({ logins }: { logins: Login[] }) {
  if (logins.length === 0) return null;
  const classes = logins.some((l) => l.group);
  const added = logins.filter((l) => l.change === "added").length;
  const updated = logins.length - added;
  return (
    <div className="rise mt-6" role="status">
      <p>
        <span className="font-semibold text-pass">Saved.</span> {added > 0 && `${added} added`}
        {added > 0 && updated > 0 && ", "}
        {updated > 0 && `${updated} updated`}.
      </p>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        Passwords are shown this once: they are stored scrambled and cannot be read back later. Download the sheet now, or set a new password from the student&apos;s page if one is lost.
      </p>
      <div className="mt-3 flex gap-3">
        <button type="button" onClick={() => download(logins)} className="btn btn-primary">
          Download sign-in sheet
        </button>
        <button type="button" onClick={() => window.print()} className="btn btn-secondary">
          Print
        </button>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="tbl">
          <thead>
            <tr>
              <th>Name</th>
              {classes && <th>Class</th>}
              <th>Username</th>
              <th>Password</th>
            </tr>
          </thead>
          <tbody>
            {logins.map((login) => (
              <tr key={login.username}>
                <td>{login.name}</td>
                {classes && <td>{login.group}</td>}
                <td className="font-mono text-sm">{login.username}</td>
                <td className="font-mono text-sm">{login.password ?? <span className="font-sans text-muted">unchanged</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ImportStudents() {
  const [state, action, pending] = useActionState(importStudents, null);
  return (
    <>
      <form action={action} className="max-w-2xl space-y-4">
        <label className={labelStyle}>
          CSV file
          <input type="file" name="file" accept=".csv,text/csv,text/plain" className={`${field} cursor-pointer`} />
        </label>
        <label className={labelStyle}>
          Or paste the rows
          <span className={hint}>Copying cells straight out of a spreadsheet works.</span>
          <textarea name="rows" rows={6} defaultValue={state?.values.rows ?? ""} placeholder={"name,class,username,password\nAda Lovelace,12A,alovelace,\nAlan Turing,12B,,"} className={`${field} font-mono text-sm`} />
        </label>
        <FormErrors state={state} />
        <button disabled={pending} className="btn btn-primary">
          {pending ? "Importing…" : "Import students"}
        </button>
      </form>
      {state && <SignInSheet logins={state.logins} />}
    </>
  );
}

export function AddStudent({ classes }: { classes: ClassOption[] }) {
  const [state, action, pending] = useActionState(addStudent, null);
  const values = state?.values ?? {};
  return (
    <>
      <form action={action} className="max-w-3xl space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <label className={labelStyle}>
            Name
            <input name="name" required defaultValue={values.name} autoComplete="off" className={field} />
          </label>
          <label className={labelStyle}>
            Username
            <input name="username" defaultValue={values.username} placeholder="Made from the name" autoComplete="off" autoCapitalize="none" className={field} />
          </label>
          <label className={labelStyle}>
            Password
            <input name="password" defaultValue={values.password} placeholder="Made for you" autoComplete="off" className={field} />
          </label>
          <label className={labelStyle}>
            Class
            <select name="group" defaultValue={values.group ?? ""} className={field}>
              <option value="">No class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <FormErrors state={state} />
        <button disabled={pending} className="btn btn-secondary">
          {pending ? "Adding…" : "Add student"}
        </button>
      </form>
      {state && <SignInSheet logins={state.logins} />}
    </>
  );
}

export function EditStudent({ student, classes }: { student: { id: string; name: string; username: string; classId: string }; classes: ClassOption[] }) {
  const [state, action, pending] = useActionState(updateStudent, null);
  const values = state?.values ?? student;
  return (
    <div>
      <form action={action} className="space-y-4">
        <input type="hidden" name="id" value={student.id} />
        <label className={labelStyle}>
          Name
          <input name="name" required defaultValue={values.name} autoComplete="off" className={field} />
        </label>
        <label className={labelStyle}>
          Username
          <input name="username" required defaultValue={values.username} autoComplete="off" autoCapitalize="none" className={`${field} font-mono text-sm`} />
        </label>
        <label className={labelStyle}>
          Class
          <select name="classId" defaultValue={values.classId ?? ""} className={field}>
            <option value="">No class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className={labelStyle}>
          New password
          <span className={hint}>Leave empty to keep the current one. Setting one signs the student out everywhere.</span>
          <input name="password" autoComplete="off" className={`${field} font-mono text-sm`} />
        </label>
        <FormErrors state={state} />
        <div className="flex items-center gap-4">
          <button disabled={pending} className="btn btn-primary">
            {pending ? "Saving…" : "Save"}
          </button>
          {state?.saved && (
            <span role="status" className="rise text-sm font-medium text-pass">
              Saved
            </span>
          )}
        </div>
      </form>
      <form action={deleteStudent} className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-4">
        <input type="hidden" name="id" value={student.id} />
        <HoldButton>Hold to delete this student</HoldButton>
        <span className="text-sm text-muted">Removes {student.name.split(" ")[0]} and everything they have submitted. This cannot be undone.</span>
      </form>
    </div>
  );
}
