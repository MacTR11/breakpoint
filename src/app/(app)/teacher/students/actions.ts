"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cleanUsername, generatePassword, passwordProblem, readStudentCsv, usernameFor, usernameProblem, type ImportRow } from "@/lib/accounts";
import { guessYear } from "@/lib/classes";
import { teacherLogin } from "@/lib/config";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/passwords";
import { getCurrentUser, SIGNED_OUT, stillTeacher } from "@/lib/session";

/** One line of the sign-in sheet. `password` is null when an existing student's password was left alone. */
export type Login = { name: string; username: string; password: string | null; group: string; change: "added" | "updated" };

// Passwords are only readable at the moment they are set, so the sheet comes
// back with the result and is never stored.
export type EnrolState = { errors: string[]; logins: Login[]; values: Record<string, string> } | null;
export type EditState = { errors: string[]; saved: boolean; values: Record<string, string> } | null;

const MAX_CSV_BYTES = 500_000;

async function assertTeacher() {
  const user = await getCurrentUser();
  if (user?.role !== "TEACHER") throw new Error("Teachers only");
}

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

/**
 * Add the students in `rows`, or update those whose username already exists.
 * Nothing is saved unless every row is acceptable, so a file can be corrected
 * and imported again without leaving half a class behind.
 */
async function enrol(rows: ImportRow[]): Promise<{ errors: string[]; logins: Login[] }> {
  const users = await db.user.findMany({ select: { id: true, username: true, role: true } });
  const byUsername = new Map(users.map((u) => [u.username, u]));
  const reserved = teacherLogin()?.username;
  const taken = new Set([...byUsername.keys(), ...(reserved ? [reserved] : [])]);
  const inThisImport = new Set<string>();
  const errors: string[] = [];
  const plan: { row: ImportRow; username: string; password: string | null; id?: string }[] = [];
  const where = (row: ImportRow) => (rows.length > 1 ? `Row ${row.line} (${row.name}): ` : "");

  for (const row of rows) {
    const username = row.username || usernameFor(row.name, taken);
    const existing = byUsername.get(username);
    const problem =
      usernameProblem(username) ??
      (inThisImport.has(username) ? `The username "${username}" is used more than once.` : null) ??
      (username === reserved || existing?.role === "TEACHER" ? `The username "${username}" is the teacher's.` : null) ??
      (row.password ? passwordProblem(row.password) : null);
    if (problem) {
      errors.push(where(row) + problem);
      continue;
    }
    taken.add(username);
    inThisImport.add(username);
    plan.push({ row, username, password: row.password || (existing ? null : generatePassword()), id: existing?.id });
  }
  if (errors.length > 0) return { errors, logins: [] };

  // Classes named in the rows are made if they do not exist yet.
  const classIds = new Map((await db.class.findMany()).map((c) => [c.name.toLowerCase(), c.id]));
  for (const name of new Set(plan.map((p) => p.row.group).filter(Boolean))) {
    if (classIds.has(name.toLowerCase())) continue;
    classIds.set(name.toLowerCase(), (await db.class.create({ data: { name, year: guessYear(name) } })).id);
  }

  const hashes = await Promise.all(plan.map((p) => (p.password ? hashPassword(p.password) : null)));
  await db.$transaction(
    plan.map((p, i) => {
      const passwordHash = hashes[i];
      // A row with no class leaves an existing student where they are.
      const classId = p.row.group ? { classId: classIds.get(p.row.group.toLowerCase()) } : {};
      return p.id
        ? db.user.update({ where: { id: p.id }, data: { name: p.row.name, ...classId, ...(passwordHash ? { passwordHash, sessionEpoch: { increment: 1 } } : {}) } })
        : db.user.create({ data: { name: p.row.name, username: p.username, passwordHash: passwordHash ?? "", role: "STUDENT", ...classId } });
    }),
  );
  revalidatePath("/", "layout");
  return { errors: [], logins: plan.map((p) => ({ name: p.row.name, username: p.username, password: p.password, group: p.row.group, change: p.id ? "updated" : "added" })) };
}

/** Import a class from a CSV file, or from rows pasted out of a spreadsheet. */
export async function importStudents(_previous: EnrolState, formData: FormData): Promise<EnrolState> {
  const pasted = String(formData.get("rows") ?? "");
  const file = formData.get("file");
  const upload = file instanceof File && file.size > 0 ? file : null;
  const values = { rows: pasted };
  if (!(await stillTeacher())) return { errors: [SIGNED_OUT], logins: [], values };
  if (upload && upload.size > MAX_CSV_BYTES) return { errors: ["That file is too large to be a class list."], logins: [], values };
  const csv = upload ? await upload.text() : pasted;
  if (!csv.trim()) return { errors: ["Choose a CSV file, or paste the rows into the box."], logins: [], values };

  const read = readStudentCsv(csv);
  if (read.errors.length > 0) return { errors: read.errors, logins: [], values };
  const result = await enrol(read.rows);
  return { ...result, values: result.errors.length ? values : { rows: "" } };
}

export async function addStudent(_previous: EnrolState, formData: FormData): Promise<EnrolState> {
  const values = { name: text(formData, "name"), username: text(formData, "username"), password: text(formData, "password"), group: text(formData, "group") };
  // A password typed for the student is not sent back to a browser that is no longer signed in.
  if (!(await stillTeacher())) return { errors: [SIGNED_OUT], logins: [], values: { ...values, password: "" } };
  if (!values.name) return { errors: ["Enter the student's name."], logins: [], values };
  const username = cleanUsername(values.username);
  if (username && (await db.user.findUnique({ where: { username } }))) return { errors: [`The username "${username}" is already taken.`], logins: [], values };
  const result = await enrol([{ line: 1, name: values.name.slice(0, 80), username, password: values.password, group: values.group.slice(0, 40) }]);
  return { ...result, values: result.errors.length ? values : { name: "", username: "", password: "", group: values.group } };
}

/** Change a student's name, username or password. A blank password leaves it as it is. */
export async function updateStudent(_previous: EditState, formData: FormData): Promise<EditState> {
  const id = text(formData, "id");
  const values = { name: text(formData, "name"), username: cleanUsername(text(formData, "username")), password: text(formData, "password"), classId: text(formData, "classId") };
  if (!(await stillTeacher())) return { errors: [SIGNED_OUT], saved: false, values: { ...values, password: "" } };
  const student = await db.user.findUnique({ where: { id } });
  if (!student || student.role !== "STUDENT") return { errors: ["That student no longer exists."], saved: false, values };

  const holder = values.username === student.username ? null : await db.user.findUnique({ where: { username: values.username } });
  const errors = [
    values.name ? null : "Enter the student's name.",
    usernameProblem(values.username),
    holder || values.username === teacherLogin()?.username ? `The username "${values.username}" is already taken.` : null,
    values.password ? passwordProblem(values.password) : null,
  ].filter((error): error is string => Boolean(error));
  if (errors.length > 0) return { errors, saved: false, values };

  await db.user.update({
    where: { id },
    data: {
      name: values.name.slice(0, 80),
      username: values.username,
      classId: values.classId && (await db.class.findUnique({ where: { id: values.classId } })) ? values.classId : null,
      // A new password signs the student out wherever the old one was used.
      ...(values.password ? { passwordHash: await hashPassword(values.password), sessionEpoch: { increment: 1 } } : {}),
    },
  });
  if (values.password) await db.loginThrottle.deleteMany({ where: { username: { in: [student.username, values.username] } } });
  revalidatePath("/", "layout");
  return { errors: [], saved: true, values: { ...values, password: "" } };
}

/** Remove a student and everything they have done. */
export async function deleteStudent(formData: FormData) {
  await assertTeacher();
  await db.user.deleteMany({ where: { id: text(formData, "id"), role: "STUDENT" } });
  revalidatePath("/", "layout");
  redirect("/teacher");
}

/** Move the ticked students into a class, or out of any class. */
export async function moveStudents(formData: FormData) {
  await assertTeacher();
  const ids = formData.getAll("student").map(String);
  const classId = text(formData, "classId");
  const target = classId && classId !== "none" ? await db.class.findUnique({ where: { id: classId } }) : null;
  if (ids.length > 0 && (target || classId === "none")) {
    await db.user.updateMany({ where: { id: { in: ids }, role: "STUDENT" }, data: { classId: target?.id ?? null } });
    revalidatePath("/", "layout");
  }
}
