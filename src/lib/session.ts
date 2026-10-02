import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@/auth";
import { db } from "@/lib/db";

/** The signed-in user's database row, or null. Read fresh so role changes apply at once. */
export const getCurrentUser = cache(async () => {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  if (!email) return null;
  return db.user.findUnique({ where: { email } });
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireTeacher() {
  const user = await requireUser();
  if (user.role !== "TEACHER") redirect("/");
  return user;
}
