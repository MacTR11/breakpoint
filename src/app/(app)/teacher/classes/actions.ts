"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { generatePassword } from "@/lib/accounts";
import { YEARS } from "@/lib/classes";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/passwords";
import { assertTeacher, SIGNED_OUT, stillTeacher } from "@/lib/session";
import type { EnrolState } from "../students/actions";

export type ClassFormState = { errors: string[]; saved: boolean; values: Record<string, string> } | null;

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

/** Create a class, or rename one and change its year when the form carries an id. */
export async function saveClass(_previous: ClassFormState, formData: FormData): Promise<ClassFormState> {
  const id = text(formData, "id");
  const values = { name: text(formData, "name").slice(0, 40), year: text(formData, "year") };
  if (!(await stillTeacher())) return { errors: [SIGNED_OUT], saved: false, values };
  const errors: string[] = [];
  if (!values.name) errors.push("Give the class a name, such as 12A.");
  if (!YEARS.includes(values.year as (typeof YEARS)[number])) errors.push("Choose lower or upper sixth.");
  const clash = values.name ? await db.class.findFirst({ where: { name: values.name, NOT: id ? { id } : undefined } }) : null;
  if (clash) errors.push(`There is already a class called ${values.name}.`);
  if (errors.length > 0) return { errors, saved: false, values };

  if (id) await db.class.update({ where: { id }, data: values });
  else await db.class.create({ data: values });
  revalidatePath("/", "layout");
  return { errors: [], saved: true, values: id ? values : { name: "", year: values.year } };
}

/** Delete a class. Its students stay, without a class. */
export async function deleteClass(formData: FormData) {
  await assertTeacher();
  await db.class.deleteMany({ where: { id: text(formData, "id") } });
  revalidatePath("/", "layout");
  redirect("/teacher/classes");
}

/** Give every student in a class a fresh password, and hand back the sign-in sheet. */
export async function resetClassPasswords(_previous: EnrolState, formData: FormData): Promise<EnrolState> {
  if (!(await stillTeacher())) return { errors: [SIGNED_OUT], logins: [], values: {} };
  const group = await db.class.findUnique({ where: { id: text(formData, "id") }, include: { students: { where: { role: "STUDENT" }, orderBy: { name: "asc" } } } });
  if (!group) return { errors: ["That class no longer exists."], logins: [], values: {} };
  if (group.students.length === 0) return { errors: ["There are no students in this class yet."], logins: [], values: {} };

  const passwords = group.students.map(() => generatePassword());
  const hashes = await Promise.all(passwords.map(hashPassword));
  await db.$transaction(group.students.map((student, i) => db.user.update({ where: { id: student.id }, data: { passwordHash: hashes[i], sessionEpoch: { increment: 1 } } })));
  await db.loginThrottle.deleteMany({ where: { username: { in: group.students.map((s) => s.username) } } });
  revalidatePath("/", "layout");
  return { errors: [], values: {}, logins: group.students.map((student, i) => ({ name: student.name, username: student.username, password: passwords[i], group: group.name, change: "updated" })) };
}
