import Link from "next/link";
import { ButtonLink, Card, DifficultyBadge, KindBadge, PageHeader } from "@/components/ui";
import { db } from "@/lib/db";
import { isPending } from "@/lib/problems";
import { trackTitle } from "@/lib/tracks";

export default async function TeacherProblemsPage() {
  const problems = await db.problem.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { solves: true, submissions: true } }, contests: { include: { contest: true } } },
  });

  return (
    <>
      <PageHeader title="Problems" intro="Everything in the bank, including unpublished problems and those held back for a competition.">
        <ButtonLink href="/teacher/problems/new">New problem</ButtonLink>
      </PageHeader>
      <Card className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-muted">
            <tr className="border-b border-line">
              <th className="px-6 py-3 font-medium">Problem</th>
              <th className="px-4 py-3 font-medium">Topic</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Level</th>
              <th className="px-4 py-3 font-medium text-right">Points</th>
              <th className="px-4 py-3 font-medium text-right">Solved</th>
              <th className="px-4 py-3 font-medium text-right">Attempts</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {problems.map((p) => {
              const held = p.contests.map((c) => c.contest).find((c) => isPending(c));
              return (
                <tr key={p.id} className="hover:bg-white/60">
                  <td className="px-6 py-3.5">
                    <Link href={`/problems/${p.slug}`} className="font-medium text-base hover:underline">
                      {p.title}
                    </Link>
                    <span className="block text-muted">
                      {p.topic} · {p.specRef}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-muted whitespace-nowrap">{trackTitle(p.track)}</td>
                  <td className="px-4 py-3.5">
                    <KindBadge kind={p.kind} style={p.style} />
                  </td>
                  <td className="px-4 py-3.5">
                    <DifficultyBadge difficulty={p.difficulty} />
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums">{p.points}</td>
                  <td className="px-4 py-3.5 text-right tabular-nums">{p._count.solves}</td>
                  <td className="px-4 py-3.5 text-right tabular-nums">{p._count.submissions}</td>
                  <td className="px-4 py-3.5 text-muted">{!p.published ? "Unpublished" : held ? `Held for ${held.title}` : "In practice"}</td>
                  <td className="px-6 py-3.5 text-right">
                    <Link href={`/teacher/problems/${p.id}`} className="text-link hover:underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </>
  );
}
