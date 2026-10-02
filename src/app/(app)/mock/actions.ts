"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { examScenarios, runningPaper } from "@/lib/mock";
import { getCurrentUser } from "@/lib/session";

export type MockState = { error: string } | null;

/** Start a timed paper from the ticked scenarios. */
export async function startMock(_previous: MockState, formData: FormData): Promise<MockState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Your session has ended. Please sign in again." };
  if (await runningPaper(user.id)) return { error: "You are already sitting a paper. Finish it first." };

  const keys = new Set(formData.getAll("scenario").map(String));
  const chosen = (await examScenarios()).filter((s) => keys.has(s.key));
  if (chosen.length === 0) return { error: "Tick at least one question." };
  const minutes = Math.round(Number(formData.get("minutes")));
  if (!Number.isFinite(minutes) || minutes < 5 || minutes > 180) return { error: "Choose between 5 minutes and 3 hours." };

  const startedAt = new Date();
  const paper = await db.mockPaper.create({
    data: {
      userId: user.id,
      problemIds: JSON.stringify(chosen.flatMap((s) => s.parts.map((p) => p.id))),
      minutes,
      startedAt,
      endsAt: new Date(startedAt.getTime() + minutes * 60_000),
    },
  });
  redirect(`/mock/${paper.id}`);
}

/** Hand a paper in before the time is up. */
export async function finishMock(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const id = String(formData.get("id") ?? "");
  await db.mockPaper.updateMany({ where: { id, userId: user.id, finishedAt: null }, data: { finishedAt: new Date() } });
  redirect(`/mock/${id}`);
}
