import { ChallengeList } from "@/components/challenge-list";
import { AsciiBar, PageHeader, link } from "@/components/ui";
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
  const tracks = TRACKS.map((track) => ({
    ...track,
    problems: problems.filter((p) => p.track === track.id).sort((a, b) => order(a.difficulty) - order(b.difficulty)),
  })).filter((track) => track.problems.length > 0);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <PageHeader path={[{ label: "course-map" }]} title="Course map" intro="Every practice challenge, grouped by topic and ordered from easiest to hardest. Use it to find the gaps." />

      <nav aria-label="Topics" className="mb-10 flex flex-wrap gap-x-5 gap-y-1 text-sm">
        {tracks.map((track) => (
          <a key={track.id} href={`#${track.id}`} className={link}>
            {track.title}
          </a>
        ))}
      </nav>

      <div className="space-y-12">
        {tracks.map((track) => (
          <section key={track.id} id={track.id} className="scroll-mt-16">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6">
              <h2 className="text-xl font-semibold tracking-tight">{track.title}</h2>
              <AsciiBar value={track.problems.filter((p) => statusOf(p.id) === "solved").length} total={track.problems.length} />
            </div>
            <p className="mt-1 mb-3 text-muted">{track.blurb}</p>
            <ChallengeList problems={track.problems} statusOf={statusOf} showTrack={false} />
          </section>
        ))}
      </div>
    </main>
  );
}
