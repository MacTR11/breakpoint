import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@/auth";
import { db } from "@/lib/db";

/**
 * The signed-in user's database row, or null. Read fresh on every request, so
 * deleting a student or changing their password signs them out at once.
 */
export const getCurrentUser = cache(async () => {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;
  const user = await db.user.findUnique({ where: { id } });
  return user && user.sessionEpoch === session.epoch ? user : null;
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

/** Said by a teacher's form when their sign-in ended while it was open. What they typed goes back into the form with it. */
export const SIGNED_OUT = "Your sign-in has ended, so nothing was saved. Sign in again in another tab, then come back and save: what you typed is still here.";

/**
 * For the teacher's forms (useActionState): whether the teacher is still
 * signed in. A form that gets false returns SIGNED_OUT with what was typed,
 * instead of throwing, so nothing typed is lost.
 */
export async function stillTeacher() {
  return (await getCurrentUser())?.role === "TEACHER";
}

/** For server actions and route handlers: stops anyone but the teacher. */
export async function assertTeacher() {
  const user = await getCurrentUser();
  if (user?.role !== "TEACHER") throw new Error("Teachers only");
  return user;
}
