import Link from "next/link";
import { ButtonLink, PageHeader, kindLabel, levelLabel, link } from "@/components/ui";
import { db } from "@/lib/db";
import { isPending } from "@/lib/problems";
import { requireTeacher } from "@/lib/session";
import { trackTitle } from "@/lib/tracks";

export default async function TeacherProblemsPage() {
  await requireTeacher();
  const problems = await db.problem.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { solves: true, submissions: true } }, contests: { include: { contest: true } } },
  });

  return (
    <>
      <PageHeader path={[{ label: "teacher" }, { label: "problems" }]} title="Problems" intro="Everything in the bank, including unpublished problems and those held back for a competition.">
        <ButtonLink href="/teacher/problems/new">New problem</ButtonLink>
      </PageHeader>
      <div className="overflow-x-auto">
        <table className="tbl">
          <thead>
            <tr>
              <th>Problem</th>
              <th>Type</th>
              <th>Level</th>
              <th>Topic</th>
              <th className="num">Points</th>
              <th className="num">Solved</th>
              <th className="num">Attempts</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {problems.map((p) => {
              const held = p.contests.map((c) => c.contest).find((c) => isPending(c));
              return (
                <tr key={p.id}>
                  <td>
                    <Link href={`/problems/${p.slug}`} className={link}>
                      {p.title}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap text-muted">{kindLabel(p.kind, p.style)}</td>
                  <td className="text-muted">{levelLabel(p.difficulty)}</td>
                  <td className="whitespace-nowrap text-muted">{trackTitle(p.track)}</td>
                  <td className="num">{p.points}</td>
                  <td className="num">{p._count.solves}</td>
                  <td className="num">{p._count.submissions}</td>
                  <td className="whitespace-nowrap text-muted">{!p.published ? "Unpublished" : held ? `Held for ${held.title}` : "In practice"}</td>
                  <td>
                    <Link href={`/teacher/problems/${p.id}`} className={link}>
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
