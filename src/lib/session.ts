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
