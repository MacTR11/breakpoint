// Dates worth a line under the Home greeting, in UK time. Mostly programming history.

/** Day 256 of the year (0x100): the 13th of September, or the 12th in a leap year. */
const isProgrammersDay = (year: number, month: number, date: number) => month === 9 && date === (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 12 : 13);

/** The second Tuesday in October. */
const isAdaLovelaceDay = (year: number, month: number, date: number) => month === 10 && date >= 8 && date <= 14 && new Date(Date.UTC(year, 9, date)).getUTCDay() === 2;

const FIXED: Record<string, string> = {
  "02-20": "Python was first released on this day in 1991.",
  "02-29": "29 February: the day that finds every bug in date code. Check your leap-year rule.",
  "04-01": "Today every challenge is marked in Python 2. (It isn't. Happy April Fools' Day.)",
  "05-25": "Towel Day, for Douglas Adams. Don't panic, and always know where your towel is.",
  "07-20": "The Moon landing, 1969. Margaret Hamilton's team wrote the guidance software, and it held up.",
  "09-09": "In 1947 Grace Hopper's team found a moth stuck in a relay: the first actual bug in a computer.",
  "10-24": "10/24: 1024 bytes in a kibibyte, so it's a good day for powers of two.",
  "03-14": "Happy π day. 3.14159265358979…",
  "06-23": "Alan Turing was born on this day in 1912.",
  "10-31": "Oct 31 == Dec 25, as any programmer will tell you.",
  "12-09": "Grace Hopper was born on this day in 1906.",
  "12-10": "Ada Lovelace was born on this day in 1815.",
  "12-25": "Dec 25 == Oct 31, as any programmer will tell you.",
};

/** A line for today, from a "YYYY-MM-DD" UK day, or null. */
export function specialDay(day: string): string | null {
  const [year, month, date] = day.split("-").map(Number);
  if (isProgrammersDay(year, month, date)) return "Happy Programmers' Day: today is day 256 of the year, or 0x100.";
  if (isAdaLovelaceDay(year, month, date)) return "It's Ada Lovelace Day, which celebrates women in science and technology.";
  return FIXED[day.slice(5)] ?? null;
}
