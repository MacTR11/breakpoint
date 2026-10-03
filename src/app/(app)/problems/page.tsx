import { ChallengeList } from "@/components/challenge-list";
import type { IconName } from "@/components/icons";
import { ButtonLink, FilterRow, Page, PageHeader } from "@/components/ui";
import { db } from "@/lib/db";
import { difficultyLabel, MAX_PUZZLE_ATTEMPTS, practiceFilter, standings } from "@/lib/problems";
import { requireUser } from "@/lib/session";
import { TRACKS } from "@/lib/tracks";
import { DIFFICULTIES } from "@/lib/types";

export const metadata = { title: "Practice" };

const TYPES: { value: string; label: string; icon?: IconName }[] = [
  { value: "", label: "All" },
  { value: "write", label: "Write code", icon: "code" },
  { value: "fix", label: "Fix the bug", icon: "bug" },
  { value: "order", label: "Put in order", icon: "list-numbers" },
  { value: "trace", label: "Trace tables", icon: "table" },
  { value: "puzzle", label: "Puzzles", icon: "puzzle-piece" },
];

const typeOf = (p: { kind: string; style: string }) => (p.kind === "PUZZLE" ? (p.style === "TRACE" ? "trace" : "puzzle") : p.style === "FIX" ? "fix" : p.style === "ORDER" ? "order" : "write");

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
  const problems = all.filter((p) => (!filters.type || typeOf(p) === filters.type) && (!filters.difficulty || p.difficulty === filters.difficulty) && (!filters.track || p.track === filters.track));
  const tracksInUse = TRACKS.filter((track) => all.some((p) => p.track === track.id));
  const solved = problems.filter((p) => statusOf(p.id) === "solved").length;

  const href = (change: Partial<typeof filters>) => {
    const query = new URLSearchParams(Object.entries({ ...filters, ...change }).filter(([, v]) => v));
    return query.size ? `/problems?${query}` : "/problems";
  };

  return (
    <Page>
      <PageHeader
        path={[{ label: "practice" }]}
        title="Practice"
        intro={`Code is marked automatically and can be retried freely. Puzzles give you ${MAX_PUZZLE_ATTEMPTS} attempts, and a wrong answer costs points.`}
      >
        <ButtonLink href="/mock" variant="secondary">
          Sit a mock paper
        </ButtonLink>
      </PageHeader>

      {/* The filters together on one panel, a label beside each row. */}
      <div className="card filter-panel mb-4">
        <span className="filter-key">Type</span>
        <FilterRow label="type" options={TYPES.map((t) => ({ label: t.label, href: href({ type: t.value }), active: filters.type === t.value, icon: t.icon }))} />
        <span className="filter-key">Level</span>
        <FilterRow
          label="level"
          options={[
            { label: "Any level", href: href({ difficulty: "" }), active: !filters.difficulty },
            ...DIFFICULTIES.map((d, index) => ({ label: difficultyLabel[d], href: href({ difficulty: d }), active: filters.difficulty === d, level: index + 1 })),
          ]}
        />
        <span className="filter-key">Topic</span>
        <FilterRow
          label="topic"
          options={[
            { label: "All topics", href: href({ track: "" }), active: !filters.track },
            ...tracksInUse.map((track) => ({ label: track.title, href: href({ track: track.id }), active: filters.track === track.id, track: track.id })),
          ]}
        />
      </div>

      <div className="card">
        <p className="cap">
          {problems.length} challenge{problems.length === 1 ? "" : "s"} · {solved} solved
        </p>
        <div className="mt-1">
          {problems.length === 0 ? <p className="py-5 text-muted">No challenges match those filters.</p> : <ChallengeList problems={problems} statusOf={statusOf} showTrack={!filters.track} />}
        </div>
      </div>
    </Page>
  );
}
