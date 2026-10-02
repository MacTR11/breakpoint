import Link from "next/link";
import { signOutAction } from "@/app/actions";
import { Wordmark } from "@/components/brand";
import { NavLinks } from "@/components/nav-links";
import { signed } from "@/components/ui";
import { siteName } from "@/lib/config";
import { hintWallet } from "@/lib/hints";
import { pointsOf } from "@/lib/scoring";
import { requireUser } from "@/lib/session";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const user = await requireUser();
  const [wallet, points] = await Promise.all([hintWallet(user.id), pointsOf(user.id)]);
  const links = [
    { href: "/", label: "Home" },
    { href: "/problems", label: "Practice" },
    { href: "/syllabus", label: "Course map" },
    { href: "/contests", label: "Competitions" },
    { href: "/leaderboard", label: "Leaderboard" },
    ...(user.role === "TEACHER" ? [{ href: "/teacher", label: "Teacher" }] : []),
  ];

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-white">
        <div className="mx-auto flex h-12 max-w-5xl items-center gap-6 px-4 sm:px-6">
          <Link href="/" aria-label={siteName}>
            <Wordmark />
          </Link>
          <div className="min-w-0 flex-1">
            <NavLinks links={links} />
          </div>
          <form action={signOutAction}>
            <button className="cursor-pointer whitespace-nowrap text-sm text-muted hover:text-ink">Sign out</button>
          </form>
        </div>
      </header>

      <div className="flex flex-1 flex-col pb-7">{children}</div>

      {/* The status bar: like an editor's, it always says where you stand. */}
      <footer className="fixed inset-x-0 bottom-0 z-20 flex h-7 items-center gap-5 overflow-hidden whitespace-nowrap bg-editor px-4 font-mono text-xs text-[#f6f8fa]">
        <span>{signed(points)} pts</span>
        <span>{wallet.solved} solved</span>
        <span>
          {wallet.balance} hint{wallet.balance === 1 ? "" : "s"}
          <span className="hidden text-[#9198a1] sm:inline">
            {" "}
            (+1 in {wallet.untilNext} solve{wallet.untilNext === 1 ? "" : "s"})
          </span>
        </span>
        <span className="ml-auto truncate text-[#9198a1]">
          {user.name}
          {user.role === "TEACHER" && " · teacher"}
        </span>
      </footer>
    </>
  );
}
