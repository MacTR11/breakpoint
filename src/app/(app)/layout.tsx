import Link from "next/link";
import { signOutAction } from "@/app/actions";
import { HintCoin, Logo } from "@/components/brand";
import { NavLinks } from "@/components/nav-links";
import { Avatar } from "@/components/ui";
import { siteName } from "@/lib/config";
import { hintWallet } from "@/lib/hints";
import { requireUser } from "@/lib/session";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const user = await requireUser();
  const wallet = await hintWallet(user.id);
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
      <header className="sticky top-0 z-30 px-3 pt-3">
        <div className="glass-nav mx-auto flex h-13 max-w-6xl items-center gap-3 rounded-full pl-3 pr-4 sm:gap-5">
          <Link href="/" className="flex items-center gap-2.5 whitespace-nowrap" aria-label={siteName}>
            <Logo size={30} />
            <span className="hidden text-[17px] font-semibold tracking-tight md:inline">{siteName}</span>
          </Link>
          <div className="min-w-0 flex-1">
            <NavLinks links={links} />
          </div>
          <div className="flex items-center gap-3">
            <span
              className="flex items-center gap-1.5 rounded-full bg-[#ffd60a]/30 py-1 pl-1.5 pr-2.5 text-[13px] font-semibold tabular-nums"
              title={`${wallet.balance} hint${wallet.balance === 1 ? "" : "s"} to spend. Next one in ${wallet.untilNext} solve${wallet.untilNext === 1 ? "" : "s"}.`}
            >
              <HintCoin size={18} />
              {wallet.balance}
            </span>
            <span className="hidden sm:inline-flex" title={user.name}>
              <Avatar name={user.name} image={user.image} size={28} />
            </span>
            <form action={signOutAction}>
              <button className="text-[13px] text-ink/70 hover:text-ink cursor-pointer whitespace-nowrap">Sign out</button>
            </form>
          </div>
        </div>
      </header>
      <div className="flex-1 flex flex-col">{children}</div>
    </>
  );
}
