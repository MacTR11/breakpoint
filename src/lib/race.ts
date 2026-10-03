import { classStandings, type ClassStanding } from "./classes";
import { londonDay, londonDayStart, shiftDay } from "./london";

// The weekly class race: classes compared on points per student scored since
// Monday, UK time. Everything resets each Monday, so a class that fell behind
// over the year can still win a week.

/** The Monday that starts the week containing `now`, as a "YYYY-MM-DD" UK day. */
export function weekStartDay(now = new Date()) {
  const today = londonDay(now);
  // getUTCDay on midday UTC of a UK date gives that date's weekday: 0 is Sunday.
  const weekday = new Date(`${today}T12:00:00Z`).getUTCDay();
  return shiftDay(today, -((weekday + 6) % 7));
}

export type Race = {
  /** Classes with students, best average this week first. */
  standings: ClassStanding[];
  /** When this week's race ends (next Monday, midnight UK time). */
  endsAt: Date;
  /** Last week's winners: more than one when they tied. Empty when nobody scored. */
  lastWinners: ClassStanding[];
};

export async function weeklyRace(now = new Date()): Promise<Race> {
  const monday = weekStartDay(now);
  const start = londonDayStart(monday);
  const [thisWeek, lastWeek] = await Promise.all([
    classStandings({ from: start }),
    classStandings({ from: londonDayStart(shiftDay(monday, -7)), to: start }),
  ]);
  const withStudents = (rows: ClassStanding[]) => rows.filter((c) => c.students > 0);
  const last = withStudents(lastWeek);
  return {
    standings: withStudents(thisWeek),
    endsAt: londonDayStart(shiftDay(monday, 7)),
    lastWinners: last.length > 0 && last[0].averagePoints > 0 ? last.filter((c) => c.averagePoints === last[0].averagePoints) : [],
  };
}
