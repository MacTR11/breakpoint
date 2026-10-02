import Link from "next/link";
import { Status, kindLabel, levelLabel, type ProblemStatus } from "@/components/ui";
import { trackTitle } from "@/lib/tracks";

export type ChallengeRow = { id: string; slug: string; title: string; kind: string; style: string; difficulty: string; points: number; track: string };

/** The one way challenges are listed anywhere: status, title, what it is, points. */
export function ChallengeList({ problems, statusOf, showTrack = true, numbered = false }: { problems: ChallengeRow[]; statusOf: (id: string) => ProblemStatus; showTrack?: boolean; numbered?: boolean }) {
  return (
    <ul className="border-y border-line divide-y divide-line">
      {problems.map((p, index) => (
        <li key={p.id} className="flex items-baseline gap-4 py-2.5">
          <span className="w-10 shrink-0">
            <Status status={statusOf(p.id)} />
          </span>
          <div className="min-w-0 flex-1 sm:flex sm:items-baseline sm:gap-4">
            <Link href={`/problems/${p.slug}`} className="text-link hover:underline">
              {numbered && <span className="mr-2 font-mono text-[13px] text-muted">{index + 1}</span>}
              {p.title}
            </Link>
            <span className="block text-sm text-muted sm:ml-auto sm:whitespace-nowrap">
              {kindLabel(p.kind, p.style)} · {levelLabel(p.difficulty)}
              {showTrack && ` · ${trackTitle(p.track)}`}
            </span>
          </div>
          <span className="w-8 shrink-0 text-right font-mono text-sm tabular-nums">{p.points}</span>
        </li>
      ))}
    </ul>
  );
}
