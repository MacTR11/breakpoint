import { AwardTile } from "@/components/award-tile";
import { Page, PageHeader, tone } from "@/components/ui";
import { YearActivity } from "@/components/year-activity";
import { activity } from "@/lib/activity";
import { AWARD_GROUPS, awardsFor } from "@/lib/awards";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Awards" };

const dayFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

export default async function AwardsPage() {
  const user = await requireUser();
  const [awards, year] = await Promise.all([awardsFor(user.id), activity(user.id, 53)]);
  const open = awards.filter((a) => !a.secret);
  const secrets = awards.filter((a) => a.secret);
  const earned = open.filter((a) => a.earned).length;
  const found = secrets.filter((a) => a.earned).length;
  // The three nearest to being earned, by how much of the way there they are.
  const nearest = open
    .filter((a) => !a.earned)
    .sort((a, b) => b.progress[0] / b.progress[1] - a.progress[0] / a.progress[1])
    .slice(0, 3);
  const days = year.grid.flat().filter((d) => !d.future);
  const busiest = days.reduce((top, d) => (d.count > top.count ? d : top), days[0]);
  const activeDays = days.filter((d) => d.count > 0).length;

  return (
    <Page>
      <PageHeader path={[{ label: "awards" }]} title="Awards" intro="Stickers to collect. Each one fills with its colour once you have done what it asks, and a few are secret until you stumble on them." />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <section className="card flex flex-col justify-between gap-5">
          <div>
            <p className="cap">Earned</p>
            <p className="figure text-[3.2rem]">
              {earned}
              <span className="text-[1.6rem] text-muted"> of {open.length}</span>
            </p>
            <div className="meter mt-2" role="progressbar" aria-valuenow={earned} aria-valuemin={0} aria-valuemax={open.length}>
              <span style={{ width: `${(earned / open.length) * 100}%` }} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="figure text-[1.6rem]">{found}</span>
            <span className="text-sm text-muted">
              of {secrets.length} secret awards found{found === secrets.length ? ". Every one. Impressive." : ""}
            </span>
          </div>
        </section>

        <section className="card">
          <h2 className="cap">Nearly there</h2>
          {nearest.length === 0 ? (
            <p className="mt-3 text-muted">You have earned every award. Now find the secret ones.</p>
          ) : (
            <ul className="mt-2 divide-y divide-line">
              {nearest.map((a) => (
                <li key={a.id} className="flex items-center gap-3.5 py-2.5">
                  <span className="icon !w-12" style={tone(a.color)} aria-hidden="true">
                    {a.code}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{a.title}</span>
                    <span className="block text-[13px] text-muted">{a.description}</span>
                    <span className="meter mt-1.5 block" style={tone(a.color)} aria-hidden="true">
                      <span style={{ width: `${(a.progress[0] / a.progress[1]) * 100}%` }} />
                    </span>
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-muted">
                    {a.progress[0]}/{a.progress[1]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="card mt-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 className="cap">Your year</h2>
          <p className="flex flex-wrap gap-x-5 text-[13px] text-muted">
            <span>
              <b className="font-display text-base font-extrabold text-ink">{year.inGrid}</b> solved
            </span>
            <span>
              <b className="font-display text-base font-extrabold text-ink">{activeDays}</b> days active
            </span>
            <span>
              best streak <b className="font-display text-base font-extrabold text-streak">{year.best}</b>
            </span>
            {busiest && busiest.count > 0 && (
              <span>
                busiest day <b className="font-display text-base font-extrabold text-ink">{busiest.count}</b> on {dayFormat.format(new Date(`${busiest.day}T12:00:00Z`))}
              </span>
            )}
          </p>
        </div>
        <div className="mt-3">
          <YearActivity grid={year.grid} />
        </div>
      </section>

      {AWARD_GROUPS.map((group) => {
        const inGroup = awards.filter((a) => a.group === group);
        if (inGroup.length === 0) return null;
        return (
          <section key={group} className="mt-8">
            <h2 className="mb-3 flex items-baseline gap-2 font-display text-xl font-extrabold tracking-tight">
              {group}
              <span className="font-sans text-sm font-semibold text-muted">
                {inGroup.filter((a) => a.earned).length} of {inGroup.length}
              </span>
            </h2>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {inGroup.map((award, index) => (
                <li key={award.id} className={`grid ${award.earned ? "sticker" : "[&>div]:bg-card"}`} style={{ "--tilt": `${[-1.2, 0.8, -0.6, 1.1][index % 4]}deg` } as React.CSSProperties}>
                  <AwardTile award={award} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </Page>
  );
}
