import Link from "next/link";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { PageHeader, chip } from "@/components/ui";
import { daysAgo, leaderboard } from "@/lib/scoring";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Leaderboard" };

export default async function LeaderboardPage({ searchParams }: PageProps<"/leaderboard">) {
  const user = await requireUser();
  const { period } = await searchParams;
  const week = period === "week";
  const rows = await leaderboard(week ? { from: daysAgo(7) } : {});

  return (
    <main className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-12">
      <PageHeader title="Leaderboard" intro="Points from every problem and competition, less penalties for wrong puzzle answers. Equal points share a position.">
        <div className="flex gap-2">
          <Link href="/leaderboard" className={chip(!week)}>
            All time
          </Link>
          <Link href="/leaderboard?period=week" className={chip(week)}>
            Last 7 days
          </Link>
        </div>
      </PageHeader>
      <LeaderboardTable rows={rows} currentUserId={user.id} emptyMessage="Nobody has scored yet. Be the first." />
    </main>
  );
}
