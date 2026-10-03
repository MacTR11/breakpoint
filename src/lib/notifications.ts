import { db } from "./db";
import { current, homeworkFor } from "./homework";
import { flagsByChallenge, mightBeFlagged } from "./integrity";
import { daysAgo } from "./scoring";

/**
 * Something worth a look, for the bell in the top bar. `key` changes whenever
 * the notice is news again (homework going overdue, a competition going live
 * or moving), and the viewer's browser remembers which keys it has seen, so no
 * clock is compared. `at` only orders the list.
 */
export type Notice = { id: string; key: string; title: string; detail: string; href: string; at: string; tone: string };

/** How far ahead a competition is announced. */
const SOON = 3 * 86_400_000;

const dueFormat = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });

/**
 * Worked out on each page load from what is already stored: homework to do,
 * competitions running or about to, and for the teacher, this week's paste
 * flags. Which ones are unread is kept in the viewer's browser.
 */
export async function noticesFor(user: { id: string; role: string; classId: string | null }): Promise<Notice[]> {
  const now = new Date();
  const soon = new Date(now.getTime() + SOON);
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
    const overdue = set.state === "overdue";
    notices.push({
      id: `homework:${set.id}`,
      // New when it reaches the student, again when it goes overdue, and when the due date moves.
      key: `homework:${set.id}:${set.state}:${set.dueAt.toISOString()}`,
      title: overdue ? `Overdue: ${set.title}` : `Homework: ${set.title}`,
      detail: `${set.done} of ${set.problems.length} done · due ${dueFormat.format(set.dueAt)}`,
      href: "/homework",
      at: (overdue ? set.dueAt : set.createdAt).toISOString(),
      tone: set.state === "overdue" ? "var(--fail)" : "var(--accent)",
    });
  }
  for (const contest of contests) {
    const live = contest.startsAt! <= now;
    notices.push({
      id: `contest:${contest.id}`,
      // New when it comes within three days of starting, again when it goes live, and when it is moved.
      key: `contest:${contest.id}:${live ? "live" : "soon"}:${contest.startsAt!.toISOString()}`,
      title: live ? `${contest.title} is live` : `${contest.title} starts soon`,
      detail: live ? `Ends ${dueFormat.format(contest.endsAt!)}` : `Starts ${dueFormat.format(contest.startsAt!)}`,
      href: `/contests/${contest.id}`,
      at: (live ? contest.startsAt! : new Date(contest.startsAt!.getTime() - SOON)).toISOString(),
      tone: live ? "var(--fail)" : "var(--warn)",
    });
  }
  const flags = flagsByChallenge(flagged);
  if (flags.length > 0) {
    notices.push({
      id: "flags",
      key: `flags:${flags[0].createdAt.toISOString()}`,
      title: `${flags.length} paste flag${flags.length === 1 ? "" : "s"} this week`,
      detail: "Large pastes into the code editor",
      href: "/teacher/classes",
      at: flags[0].createdAt.toISOString(),
      tone: "var(--warn)",
    });
  }
  return notices.sort((a, b) => b.at.localeCompare(a.at));
}
