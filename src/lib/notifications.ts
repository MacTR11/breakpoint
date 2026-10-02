import { db } from "./db";
import { current, homeworkFor } from "./homework";
import { flagsByChallenge, mightBeFlagged } from "./integrity";
import { daysAgo } from "./scoring";

/** Something worth a look, for the bell in the top bar. `at` decides whether it is new to the viewer. */
export type Notice = { id: string; title: string; detail: string; href: string; at: string; tone: string };

const dueFormat = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });

/**
 * Worked out on each page load from what is already stored: homework to do,
 * competitions running or about to, and for the teacher, this week's paste
 * flags. Which ones are unread is kept in the viewer's browser.
 */
export async function noticesFor(user: { id: string; role: string; classId: string | null }): Promise<Notice[]> {
  const now = new Date();
  const soon = new Date(now.getTime() + 3 * 86_400_000);
  const [homework, contests, flagged] = await Promise.all([
    user.role === "STUDENT" ? homeworkFor(user) : Promise.resolve([]),
    db.contest.findMany({ where: { startsAt: { lte: soon }, endsAt: { gt: now } }, orderBy: { startsAt: "asc" } }),
    user.role === "TEACHER"
      ? db.submission.findMany({
          where: { createdAt: { gte: daysAgo(7) }, user: { role: "STUDENT" }, ...mightBeFlagged },
          select: { userId: true, problemId: true, code: true, pastedChars: true, largestPaste: true, createdAt: true },
        })
      : Promise.resolve([]),
  ]);

  const notices: Notice[] = [];
  for (const set of current(homework, now).filter((h) => h.state === "open" || h.state === "overdue")) {
    notices.push({
      id: `homework:${set.id}`,
      title: set.state === "overdue" ? `Overdue: ${set.title}` : `Homework: ${set.title}`,
      detail: `${set.done} of ${set.problems.length} done · due ${dueFormat.format(set.dueAt)}`,
      href: "/homework",
      at: set.createdAt.toISOString(),
      tone: set.state === "overdue" ? "var(--fail)" : "var(--accent)",
    });
  }
  for (const contest of contests) {
    const live = contest.startsAt! <= now;
    notices.push({
      id: `contest:${contest.id}`,
      title: live ? `${contest.title} is live` : `${contest.title} starts soon`,
      detail: live ? `Ends ${dueFormat.format(contest.endsAt!)}` : `Starts ${dueFormat.format(contest.startsAt!)}`,
      href: `/contests/${contest.id}`,
      at: (live ? contest.startsAt! : contest.createdAt).toISOString(),
      tone: live ? "var(--fail)" : "var(--warn)",
    });
  }
  const flags = flagsByChallenge(flagged);
  if (flags.length > 0) {
    notices.push({
      id: "flags",
      title: `${flags.length} paste flag${flags.length === 1 ? "" : "s"} this week`,
      detail: "Large pastes into the code editor",
      href: "/teacher/classes",
      at: flags[0].createdAt.toISOString(),
      tone: "var(--warn)",
    });
  }
  return notices.sort((a, b) => b.at.localeCompare(a.at));
}
