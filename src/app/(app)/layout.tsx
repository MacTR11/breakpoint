import Link from "next/link";
import { AccountMenu, Bell, TabBar, TopLinks, type NavLink } from "@/components/app-nav";
import { Wordmark } from "@/components/brand";
import { EasterEggs } from "@/components/easter-eggs";
import { ScrollProgress } from "@/components/scroll-progress";
import { activity } from "@/lib/activity";
import { siteName } from "@/lib/config";
import { db } from "@/lib/db";
import { hintWallet } from "@/lib/hints";
import { noticesFor } from "@/lib/notifications";
import { requireUser } from "@/lib/session";

const HOME: NavLink = { href: "/", label: "Home", short: "Home", glyph: "~" };
const PRACTICE: NavLink = { href: "/problems", label: "Practice", short: "Practice", glyph: "def" };
const MAP: NavLink = { href: "/syllabus", label: "Course map", short: "Map", glyph: "{ }" };
const COMPETE: NavLink = { href: "/contests", label: "Competitions", short: "Compete", glyph: "vs" };
const RANKS: NavLink = { href: "/leaderboard", label: "Leaderboard", short: "Ranks", glyph: "#1" };
const AWARDS: NavLink = { href: "/awards", label: "Awards", short: "Awards", glyph: "++" };
const TEACHER: NavLink = { href: "/teacher", label: "Teacher", short: "Teacher", glyph: "sudo" };

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const user = await requireUser();
  const teacher = user.role === "TEACHER";
  const [wallet, history, notices, group] = await Promise.all([
    hintWallet(user.id),
    activity(user.id, 1),
    noticesFor(user),
    user.classId ? db.class.findUnique({ where: { id: user.classId }, select: { name: true } }) : null,
  ]);
  const links = [HOME, PRACTICE, MAP, COMPETE, RANKS, AWARDS, ...(teacher ? [TEACHER] : [])];
  // Five places fit along the bottom of a phone; the rest are in the account menu.
  const tabs = [HOME, PRACTICE, COMPETE, RANKS, teacher ? TEACHER : AWARDS];
  const menu = teacher
    ? [
        { href: "/teacher/classes", label: "Classes" },
        { href: "/teacher/homework", label: "Homework" },
        { href: "/present", label: "Projector view" },
        { href: "/teacher/settings", label: "Settings" },
        { href: "/syllabus", label: "Course map" },
        { href: "/awards", label: "Awards" },
      ]
    : [
        { href: "/homework", label: "Homework" },
        { href: "/mock", label: "Mock papers" },
        { href: "/syllabus", label: "Course map" },
        { href: "/awards", label: "Awards" },
      ];
  const streak = `${history.streak} day streak`;
  const hints = `${wallet.balance} hint${wallet.balance === 1 ? "" : "s"}`;

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-card">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Link href="/" aria-label={siteName} className="shrink-0">
            <Wordmark className="text-[1.05rem]" />
          </Link>
          <div className="hidden min-w-0 flex-1 justify-center lg:flex">
            <TopLinks links={links} />
          </div>
          <div className="ml-auto flex items-center gap-2">
            {/* On a wide screen: the streak (amber once today's solve is done) and hints to spend. */}
            {!teacher && (
              <>
                <span className="stat-chip hidden xl:inline-flex" title={history.solvedToday ? "You have solved something today" : "Solve something today to keep your streak"}>
                  <b className={history.solvedToday ? "text-streak" : "text-ink-soft"}>{history.streak}</b> day streak
                </span>
                <span className="stat-chip hidden xl:inline-flex" title={`Next hint after ${wallet.untilNext} more solve${wallet.untilNext === 1 ? "" : "s"}`}>
                  <b className="text-hint">{wallet.balance}</b> hint{wallet.balance === 1 ? "" : "s"}
                </span>
              </>
            )}
            <Bell userId={user.id} notices={notices} />
            <AccountMenu name={user.name} detail={teacher ? "Teacher" : [group?.name, streak, hints].filter(Boolean).join(" · ")} links={menu} />
          </div>
        </div>
        <ScrollProgress />
      </header>

      {/* Room at the bottom for the tab bar on phones and tablets. */}
      <div className="flex flex-1 flex-col pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">{children}</div>
      <TabBar links={tabs} />
      <EasterEggs />
    </>
  );
}
