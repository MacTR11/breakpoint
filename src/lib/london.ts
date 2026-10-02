// Competition times are entered and shown in UK time wherever the server or
// the viewer happens to be, so a 9:00 start means 9:00 in the classroom.
const ZONE = "Europe/London";

function offsetMinutes(instant: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: ZONE,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(instant);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const wallClock = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return Math.round((wallClock - instant.getTime()) / 60_000);
}

/** Parse a `datetime-local` value ("2026-10-02T09:00") as UK time. */
export function londonToDate(local: string): Date {
  const naive = new Date(`${local.slice(0, 16)}:00Z`);
  if (Number.isNaN(naive.getTime())) return naive;
  return new Date(naive.getTime() - offsetMinutes(naive) * 60_000);
}

/** Format a date as a `datetime-local` value in UK time. */
export function dateToLondonInput(date: Date): string {
  return new Date(date.getTime() + offsetMinutes(date) * 60_000).toISOString().slice(0, 16);
}
