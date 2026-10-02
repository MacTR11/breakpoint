"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import { db } from "@/lib/db";
import { assertTeacher } from "@/lib/session";
import { setSetting } from "@/lib/settings";

/** Whether large pastes into the editor are only recorded, or refused as well. */
export async function savePasteMode(formData: FormData) {
  await assertTeacher();
  await setSetting("pasteMode", String(formData.get("pasteMode") ?? "") === "block" ? "block" : "record");
  revalidatePath("/", "layout");
}

/** End every teacher session, on every device (a classroom PC left signed in, say), including this one. */
export async function signOutEverywhere() {
  const teacher = await assertTeacher();
  await db.user.update({ where: { id: teacher.id }, data: { sessionEpoch: { increment: 1 } } });
  await signOut({ redirect: false });
  redirect("/login");
}
