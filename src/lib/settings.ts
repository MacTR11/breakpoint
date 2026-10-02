import { cache } from "react";
import { db } from "./db";

// Site-wide choices the teacher makes in the dashboard.

/** "record": large pastes are noted for the teacher. "block": they are also refused. */
export type PasteMode = "record" | "block";

export const pasteMode = cache(async (): Promise<PasteMode> => {
  const row = await db.setting.findUnique({ where: { key: "pasteMode" } });
  return row?.value === "block" ? "block" : "record";
});

export async function setSetting(key: string, value: string) {
  await db.setting.upsert({ where: { key }, create: { key, value }, update: { value } });
}
