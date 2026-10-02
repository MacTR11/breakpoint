import Link from "next/link";
import { KindIcon, Status, TopicName, kindLabel, levelLabel, type ProblemStatus } from "@/components/ui";

export type ChallengeRow = { id: string; slug: string; title: string; kind: string; style: string; difficulty: string; points: number; track: string };

/** The one way challenges are listed anywhere: icon, title, what it is, where the student stands, points. */
export function ChallengeList({ problems, statusOf, showTrack = true, numbered = false }: { problems: ChallengeRow[]; statusOf: (id: string) => ProblemStatus; showTrack?: boolean; numbered?: boolean }) {
  return (
    <ul className="divide-y divide-line">
      {problems.map((p, index) => (
        <li key={p.id}>
          <Link href={`/problems/${p.slug}`} className="-mx-2 flex items-center gap-3.5 rounded-[14px] px-2 py-3 transition-colors duration-150 hover:bg-paper">
            <KindIcon kind={p.kind} style={p.style} track={p.track} />
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-semibold">
                {numbered && <span className="text-muted">{index + 1}.</span>}
                {p.title}
                <Status status={statusOf(p.id)} />
              </span>
              <span className="block text-[13px] text-muted">
                {kindLabel(p.kind, p.style)} · {levelLabel(p.difficulty)}
                {showTrack && (
                  <>
                    {" · "}
                    <TopicName track={p.track} />
                  </>
                )}
              </span>
            </span>
            <span className="shrink-0 text-sm font-semibold tabular-nums text-muted">{p.points}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
