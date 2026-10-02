import Link from "next/link";
import { signOutAction } from "@/app/actions";
import { Wordmark } from "@/components/brand";
import { NavLinks } from "@/components/nav-links";
import { ThemeToggle } from "@/components/theme-toggle";
import { activity } from "@/lib/activity";
import { siteName } from "@/lib/config";
import { hintWallet } from "@/lib/hints";
import { requireUser } from "@/lib/session";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const user = await requireUser();
  const [wallet, history] = await Promise.all([hintWallet(user.id), activity(user.id, 1)]);
  const links = [
    { href: "/", label: "Home" },
    { href: "/problems", label: "Practice" },
    { href: "/syllabus", label: "Course map" },
    { href: "/contests", label: "Competitions" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/awards", label: "Awards" },
    ...(user.role === "TEACHER" ? [{ href: "/teacher", label: "Teacher" }] : []),
  ];

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-card">
        {/* On a phone the links drop to a second row, which scrolls sideways. */}
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 px-4 sm:px-6 md:h-[3.25rem] md:flex-nowrap">
          <Link href="/" aria-label={siteName} className="flex h-12 items-center md:h-auto">
            <Wordmark />
          </Link>
          <div className="order-last w-full min-w-0 pb-2.5 md:order-none md:w-auto md:flex-1 md:pb-0">
            <NavLinks links={links} />
          </div>
          <div className="ml-auto flex items-center gap-4 text-sm">
            {/* Always in view: the streak (amber until today's solve is done) and hints to spend. */}
            <span className="hidden whitespace-nowrap text-muted lg:inline" title={history.solvedToday ? "You have solved something today" : "Solve something today to keep your streak"}>
              <span className={`font-display font-extrabold ${history.solvedToday ? "text-streak" : "text-muted"}`}>{history.streak}</span> day streak
            </span>
            <span className="hidden whitespace-nowrap text-muted lg:inline" title={`Next hint after ${wallet.untilNext} more solve${wallet.untilNext === 1 ? "" : "s"}`}>
              <span className="font-display font-extrabold text-hint">{wallet.balance}</span> hint{wallet.balance === 1 ? "" : "s"}
            </span>
            <ThemeToggle />
            <form action={signOutAction} className="flex">
              <button className="cursor-pointer whitespace-nowrap text-muted hover:text-ink">Sign out</button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col">{children}</div>
    </>
  );
}
