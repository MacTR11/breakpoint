import { ChallengeList } from "@/components/challenge-list";
import { Page, PageHeader, Progress, TopicName, TopicTile } from "@/components/ui";
import { db } from "@/lib/db";
import { practiceFilter, standings } from "@/lib/problems";
import { requireUser } from "@/lib/session";
import { TRACKS } from "@/lib/tracks";
import { DIFFICULTIES } from "@/lib/types";

export const metadata = { title: "Course map" };

export default async function SyllabusPage() {
  const user = await requireUser();
  const [problems, statusOf] = await Promise.all([
    db.problem.findMany({
      where: practiceFilter(),
      orderBy: [{ sortOrder: "asc" }],
      select: { id: true, slug: true, title: true, kind: true, style: true, difficulty: true, points: true, track: true },
    }),
    standings(user.id),
  ]);
  const order = (d: string) => DIFFICULTIES.indexOf(d as (typeof DIFFICULTIES)[number]);
  const tracks = TRACKS.map((track) => {
    const inTrack = problems.filter((p) => p.track === track.id).sort((a, b) => order(a.difficulty) - order(b.difficulty));
    return { ...track, problems: inTrack, solved: inTrack.filter((p) => statusOf(p.id) === "solved").length };
  }).filter((track) => track.problems.length > 0);

  return (
    <Page>
      <PageHeader path={[{ label: "course-map" }]} title="Course map" intro="Every practice challenge, grouped by topic and ordered from easiest to hardest. Use it to find the gaps." />

      <nav aria-label="Topics" className="mb-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {tracks.map((track) => (
          <TopicTile key={track.id} track={track.id} solved={track.solved} total={track.problems.length} href={`#${track.id}`} />
        ))}
      </nav>

      <div className="space-y-4">
        {tracks.map((track) => (
          <section key={track.id} id={track.id} className="card scroll-mt-20">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
              <h2 className="font-display text-2xl font-extrabold tracking-tight">
                <TopicName track={track.id} />
              </h2>
              <Progress value={track.solved} total={track.problems.length} color={track.color} />
            </div>
            <p className="mt-0.5 mb-1 text-muted">{track.blurb}</p>
            <ChallengeList problems={track.problems} statusOf={statusOf} showTrack={false} />
          </section>
        ))}
      </div>
    </Page>
  );
}
