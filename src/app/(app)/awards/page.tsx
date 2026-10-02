import { AwardTile } from "@/components/award-tile";
import { Page, PageHeader } from "@/components/ui";
import { awardsFor } from "@/lib/awards";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Awards" };

export default async function AwardsPage() {
  const user = await requireUser();
  const awards = await awardsFor(user.id);
  const earned = awards.filter((a) => a.earned).length;

  return (
    <Page>
      <PageHeader path={[{ label: "awards" }]} title="Awards" intro="Things to collect. Each one lights up in its own colour when you have done what it asks." />
      <p className="cap mb-3">
        {earned} of {awards.length} earned
      </p>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {awards.map((award) => (
          <li key={award.id} className={`grid ${award.earned ? "" : "[&>div]:bg-card"}`}>
            <AwardTile award={award} />
          </li>
        ))}
      </ul>
    </Page>
  );
}
