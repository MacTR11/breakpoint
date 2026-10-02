import Link from "next/link";
import { ButtonLink, Card, PageHeader, formatDateTime } from "@/components/ui";
import { db } from "@/lib/db";
import { contestState, contestStateLabel } from "@/lib/scoring";

export default async function TeacherContestsPage() {
  const contests = await db.contest.findMany({ orderBy: [{ startsAt: "desc" }, { title: "asc" }], include: { _count: { select: { problems: true } } } });
  return (
    <>
      <PageHeader
        title="Competitions"
        intro="Ready-made packs are waiting to be given a date. Their problems stay hidden from students until the competition starts, and join Practice once it ends."
      >
        <ButtonLink href="/teacher/contests/new">New competition</ButtonLink>
      </PageHeader>
      {contests.length === 0 ? (
        <Card className="p-10 text-center text-muted">No competitions yet.</Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-muted">
              <tr className="border-b border-line">
                <th className="px-6 py-3 font-medium">Competition</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Starts</th>
                <th className="px-4 py-3 font-medium">Ends</th>
                <th className="px-4 py-3 font-medium text-right">Problems</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {contests.map((contest) => {
                const state = contestState(contest);
                return (
                  <tr key={contest.id} className="hover:bg-white/60">
                    <td className="px-6 py-3.5">
                      <Link href={`/contests/${contest.id}`} className="font-medium text-base hover:underline">
                        {contest.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5">{contestStateLabel[state]}</td>
                    <td className="px-4 py-3.5 text-muted whitespace-nowrap">{contest.startsAt ? formatDateTime(contest.startsAt) : "—"}</td>
                    <td className="px-4 py-3.5 text-muted whitespace-nowrap">{contest.endsAt ? formatDateTime(contest.endsAt) : "—"}</td>
                    <td className="px-4 py-3.5 text-right tabular-nums">{contest._count.problems}</td>
                    <td className="px-6 py-3.5 text-right">
                      <Link href={`/teacher/contests/${contest.id}`} className="text-link hover:underline">
                        {state === "DRAFT" ? "Schedule" : "Edit"}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
