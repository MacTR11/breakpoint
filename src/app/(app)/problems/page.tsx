import { ChallengeList } from "@/components/challenge-list";
import { FilterRow, PageHeader } from "@/components/ui";
import { db } from "@/lib/db";
import { difficultyLabel, MAX_PUZZLE_ATTEMPTS, practiceFilter, standings } from "@/lib/problems";
import { requireUser } from "@/lib/session";
import { TRACKS } from "@/lib/tracks";
import { DIFFICULTIES } from "@/lib/types";

export const metadata = { title: "Practice" };

const TYPES = [
  { value: "", label: "All" },
  { value: "write", label: "Write code" },
  { value: "fix", label: "Fix the bug" },
  { value: "puzzle", label: "Puzzles" },
];

const typeOf = (p: { kind: string; style: string }) => (p.kind === "PUZZLE" ? "puzzle" : p.style === "FIX" ? "fix" : "write");

export default async function ProblemsPage({ searchParams }: PageProps<"/problems">) {
  const user = await requireUser();
  const params = await searchParams;
  const pick = (key: string) => (typeof params[key] === "string" ? (params[key] as string) : "");
  const filters = { type: pick("type"), difficulty: pick("difficulty"), track: pick("track") };

  const [all, statusOf] = await Promise.all([
    db.problem.findMany({
      where: practiceFilter(),
      orderBy: [{ sortOrder: "asc" }],
      select: { id: true, slug: true, title: true, kind: true, style: true, difficulty: true, points: true, track: true },
    }),
    standings(user.id),
  ]);
  const problems = all.filter(
    (p) => (!filters.type || typeOf(p) === filters.type) && (!filters.difficulty || p.difficulty === filters.difficulty) && (!filters.track || p.track === filters.track),
  );
  const tracksInUse = TRACKS.filter((track) => all.some((p) => p.track === track.id));
  const solved = problems.filter((p) => statusOf(p.id) === "solved").length;

  const href = (change: Partial<typeof filters>) => {
    const query = new URLSearchParams(Object.entries({ ...filters, ...change }).filter(([, v]) => v));
    return query.size ? `/problems?${query}` : "/problems";
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <PageHeader
        path={[{ label: "practice" }]}
        title="Practice"
        intro={`Code is marked automatically and can be retried freely. Puzzles give you ${MAX_PUZZLE_ATTEMPTS} attempts, and a wrong answer costs points.`}
      />

      <div className="mb-6 space-y-1.5">
        <FilterRow label="type" options={TYPES.map((t) => ({ label: t.label, href: href({ type: t.value }), active: filters.type === t.value }))} />
        <FilterRow
          label="level"
          options={[
            { label: "Any", href: href({ difficulty: "" }), active: !filters.difficulty },
            ...DIFFICULTIES.map((d) => ({ label: difficultyLabel[d], href: href({ difficulty: d }), active: filters.difficulty === d })),
          ]}
        />
        <FilterRow
          label="topic"
          options={[
            { label: "Any", href: href({ track: "" }), active: !filters.track },
            ...tracksInUse.map((track) => ({ label: track.title, href: href({ track: track.id }), active: filters.track === track.id })),
          ]}
        />
      </div>

      <p className="mb-2 font-mono text-[13px] text-muted">
        {problems.length} challenge{problems.length === 1 ? "" : "s"}, {solved} solved
      </p>
      {problems.length === 0 ? <p className="border-y border-line py-6 text-muted">No challenges match those filters.</p> : <ChallengeList problems={problems} statusOf={statusOf} showTrack={!filters.track} />}
    </main>
  );
}
