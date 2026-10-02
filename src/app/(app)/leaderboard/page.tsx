import { LeaderboardTable } from "@/components/leaderboard-table";
import { FilterRow, PageHeader, Sheet } from "@/components/ui";
import { daysAgo, leaderboard } from "@/lib/scoring";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Leaderboard" };

export default async function LeaderboardPage({ searchParams }: PageProps<"/leaderboard">) {
  const user = await requireUser();
  const { period } = await searchParams;
  const week = period === "week";
  const rows = await leaderboard(week ? { from: daysAgo(7) } : {});

  return (
    <Sheet width="max-w-3xl">
      <PageHeader path={[{ label: "leaderboard" }]} title="Leaderboard" intro="Points from every challenge and competition, less penalties for wrong puzzle answers. Equal points share a position." />
      <div className="mb-4">
        <FilterRow
          label="when"
          options={[
            { label: "All time", href: "/leaderboard", active: !week },
            { label: "Last 7 days", href: "/leaderboard?period=week", active: week },
          ]}
        />
      </div>
      <LeaderboardTable rows={rows} currentUserId={user.id} emptyMessage="Nobody has scored yet. Be the first." />
    </Sheet>
  );
}
