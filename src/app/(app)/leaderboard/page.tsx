import { ClassBoard } from "@/components/class-board";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { FilterRow, PageHeader, Sheet } from "@/components/ui";
import { classStandings } from "@/lib/classes";
import { londonDayStart } from "@/lib/london";
import { weekStartDay } from "@/lib/race";
import { daysAgo, leaderboard } from "@/lib/scoring";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Leaderboard" };

export default async function LeaderboardPage({ searchParams }: PageProps<"/leaderboard">) {
  const user = await requireUser();
  const { period, view } = await searchParams;
  const week = period === "week";
  const classes = view === "classes";
  // For classes, "this week" is the weekly race, which starts each Monday.
  const scope = week ? { from: classes ? londonDayStart(weekStartDay()) : daysAgo(7) } : {};
  const query = (next: { period?: string; view?: string }) => {
    const params = new URLSearchParams();
    if (next.view === "classes") params.set("view", "classes");
    if (next.period === "week") params.set("period", "week");
    return `/leaderboard${params.size ? `?${params}` : ""}`;
  };

  return (
    <Sheet width="max-w-3xl">
      <PageHeader
        path={[{ label: "leaderboard" }]}
        title="Leaderboard"
        intro={
          classes
            ? "Classes ranked on their average points per student. Everyone in a class counts, so the way up is for every student to solve something."
            : "Points from every challenge and competition, less penalties for wrong puzzle answers. Equal points share a position."
        }
      />
      <div className="mb-4 flex flex-wrap gap-3">
        <FilterRow
          label="who"
          options={[
            { label: "Students", href: query({ period: period as string }), active: !classes },
            { label: "Classes", href: query({ period: period as string, view: "classes" }), active: classes },
          ]}
        />
        <FilterRow
          label="when"
          options={[
            { label: "All time", href: query({ view: view as string }), active: !week },
            { label: classes ? "This week" : "Last 7 days", href: query({ view: view as string, period: "week" }), active: week },
          ]}
        />
      </div>
      {classes ? (
        <ClassBoard rows={await classStandings(scope)} mine={user.classId} />
      ) : (
        <LeaderboardTable rows={await leaderboard(scope)} currentUserId={user.id} emptyMessage="Nobody has scored yet. Be the first." />
      )}
    </Sheet>
  );
}
