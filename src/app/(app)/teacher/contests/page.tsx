import Link from "next/link";
import { ButtonLink, PageHeader, formatDateTime, link } from "@/components/ui";
import { db } from "@/lib/db";
import { contestState, contestStateLabel } from "@/lib/scoring";

export default async function TeacherContestsPage() {
  const contests = await db.contest.findMany({ orderBy: [{ startsAt: "desc" }, { title: "asc" }], include: { _count: { select: { problems: true } } } });
  return (
    <>
      <PageHeader
        path={[{ label: "teacher" }, { label: "competitions" }]}
        title="Competitions"
        intro="Ready-made packs are waiting to be given a date. Their challenges stay hidden from students until the competition starts, and join Practice once it ends."
      >
        <ButtonLink href="/teacher/contests/new">New competition</ButtonLink>
      </PageHeader>
      {contests.length === 0 ? (
        <p className="border-y border-line py-6 text-muted">No competitions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th>Competition</th>
                <th>Status</th>
                <th>Starts</th>
                <th>Ends</th>
                <th className="num">Challenges</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {contests.map((contest) => {
                const state = contestState(contest);
                return (
                  <tr key={contest.id}>
                    <td>
                      <Link href={`/contests/${contest.id}`} className={link}>
                        {contest.title}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap">{contestStateLabel[state]}</td>
                    <td className="whitespace-nowrap text-muted">{contest.startsAt ? formatDateTime(contest.startsAt) : "—"}</td>
                    <td className="whitespace-nowrap text-muted">{contest.endsAt ? formatDateTime(contest.endsAt) : "—"}</td>
                    <td className="num">{contest._count.problems}</td>
                    <td>
                      <Link href={`/teacher/contests/${contest.id}`} className={link}>
                        {state === "DRAFT" ? "Schedule" : "Edit"}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
