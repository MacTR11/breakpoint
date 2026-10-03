import { activity } from "./activity";
import { db } from "./db";
import { hintWallet } from "./hints";
import { homeworkFor } from "./homework";
import { isFlagged } from "./integrity";
import { dateToLondonInput, londonDay, shiftDay } from "./london";
import { examScenarios } from "./mock";
import { practiceFilter } from "./problems";
import { pointsOf } from "./scoring";
import { TRACKS } from "./tracks";

/**
 * `color` fills the award once it is earned and `code` is printed faintly on
 * it. `progress` is [so far, needed]. A `secret` award shows only a clue until
 * it is earned.
 */
export type Award = { id: string; code: string; title: string; description: string; color: string; group: string; secret: boolean; clue?: string; earned: boolean; progress: [number, number] };

/** What a secret award shows before it is earned. */
const CLUES: Record<string, string> = {
  "night-owl": "Some code is best written by moonlight.",
  "early-bird": "Before the first bell.",
  weekend: "Two days off. Or are they?",
  persistence: "Try, try again.",
  "quick-draw": "Fast fingers, no pasting.",
  "the-answer": "Life, the universe and everything.",
  "pi-time": "A slice of time.",
  byte: "A round number, in another base.",
  "leap-day": "Once every four years.",
  comeback: "Long time no see.",
  speedrun: "Three in ten.",
  recursion: "To understand recursion, you must first understand recursion.",
  "binary-day": "A date a computer would like.",
  "lunch-break": "Between bites.",
  palindrome: "Reads the same both ways.",
  "friday-13": "Unlucky for some.",
};

/** Where to go to work on an award: the challenges, page or part of Home that earns it. */
const AWARD_LINKS: Record<string, string> = {
  "in-order": "/problems?type=order",
  "first-fix": "/problems?type=fix",
  "ten-fixes": "/problems?type=fix",
  "bug-hunter": "/problems?type=fix",
  "clean-run": "/problems?type=write",
  "sharp-eye": "/problems?type=puzzle",
  puzzler: "/problems?type=puzzle",
  "puzzle-master": "/problems?type=puzzle",
  tracer: "/problems?type=trace",
  unassisted: "/problems?difficulty=HARD",
  "heavy-lifting": "/problems?difficulty=HARD",
  "exam-ready": "/problems?track=exam",
  "exam-season": "/problems?track=exam",
  "exam-marathon": "/problems?track=exam",
  "full-paper": "/problems?track=exam",
  "mock-sitter": "/mock",
  "all-sorts": "/syllabus#sorting",
  "seek-and-find": "/syllabus#searching",
  "all-rounder": "/syllabus",
  completionist: "/syllabus",
  "hat-trick": "/syllabus",
  "five-topics": "/syllabus",
  "off-the-mark": "/syllabus#warmup",
  "three-days": "/#streak",
  "full-week": "/#streak",
  fortnight: "/#streak",
  month: "/#streak",
  "daily-habit": "/#today",
  "on-time": "/homework",
  "on-the-clock": "/contests",
};

/** Where an award leads, or null for a secret one, which gives nothing away. */
export const awardHref = (award: Pick<Award, "id" | "secret">) => (award.secret ? null : (AWARD_LINKS[award.id] ?? "/problems"));

/** The headings awards are shown under, in order. */
export const AWARD_GROUPS = ["Solving", "Fixing", "Accuracy", "Taking it on", "Exams", "Algorithms", "Breadth", "Habits", "Competing", "Secret"];

type Solved = { problemId: string; slug: string; kind: string; style: string; track: string; difficulty: string; attempts: number };

const SORTS = ["bubble-sort", "insertion-sort", "merge-sort", "quick-sort"];
const SEARCHES = ["linear-search", "binary-search", "binary-search-recursive"];

const BLUE = "#0071e3";
const GREEN = "#2a9d48";
const RED = "#d70015";
const PURPLE = "#8944ab";
const ORANGE = "#c93400";
const INDIGO = "#5e5ce6";
const TEAL = "#1492aa";
const PINK = "#d30f45";
const NIGHT = "#3a4a8c";
const GOLD = "#b07800";

/**
 * Every award with this student's progress towards it. Awards are worked out
 * from what the student has done; nothing about them is stored.
 */
export async function awardsFor(userId: string): Promise<Award[]> {
  const [solveRows, hintRows, history, practice, dailies, quick, user, points, scenarios, mocksSat, wallet] = await Promise.all([
    db.solve.findMany({
      where: { userId },
      select: { problemId: true, attempts: true, solvedAt: true, problem: { select: { slug: true, kind: true, style: true, track: true, difficulty: true, contests: { select: { contest: true } } } } },
    }),
    db.hintUnlock.findMany({ where: { userId }, select: { problemId: true } }),
    activity(userId),
    db.problem.findMany({ where: practiceFilter(), select: { id: true, track: true } }),
    db.dailyBonus.count({ where: { userId } }),
    // Medium or hard code accepted within two minutes of opening it, typed rather than pasted.
    db.submission.findMany({
      where: { userId, status: "ACCEPTED", seconds: { gt: 0, lte: 120 }, problem: { kind: "CODE", difficulty: { in: ["MEDIUM", "HARD"] } } },
      select: { code: true, pastedChars: true, largestPaste: true },
    }),
    db.user.findUnique({ where: { id: userId }, select: { id: true, classId: true } }),
    pointsOf(userId),
    examScenarios(),
    // Mock papers that have run their course or been handed in.
    db.mockPaper.count({ where: { userId, OR: [{ finishedAt: { not: null } }, { endsAt: { lte: new Date() } }] } }),
    hintWallet(userId),
  ]);
  const homeworkOnTime = user ? (await homeworkFor(user)).filter((set) => set.state === "done").length : 0;
  const solves: Solved[] = solveRows.map((s) => ({ problemId: s.problemId, attempts: s.attempts, ...s.problem }));
  const slugs = new Set(solves.map((s) => s.slug));
  const solvedIds = new Set(solves.map((s) => s.problemId));
  const hinted = new Set(hintRows.map((h) => h.problemId));
  const count = (test: (s: Solved) => boolean) => solves.filter(test).length;

  const inCompetition = solveRows.filter((s) => s.problem.contests.some(({ contest }) => contest.startsAt && contest.endsAt && contest.startsAt <= s.solvedAt && s.solvedAt <= contest.endsAt)).length;
  const tracksTouched = new Set(solves.map((s) => s.track)).size;
  const tracksInUse = TRACKS.filter((track) => practice.some((p) => p.track === track.id));
  // The topic the student is closest to finishing, as a fraction.
  const closest = tracksInUse
    .map((track) => {
      const ids = practice.filter((p) => p.track === track.id).map((p) => p.id);
      return [ids.filter((id) => solvedIds.has(id)).length, ids.length] as [number, number];
    })
    .sort((a, b) => b[0] / b[1] - a[0] / a[1])[0] ?? [0, 1];

  // Topics where every practice challenge is solved, and how far through First steps.
  const finishedTopics = tracksInUse.filter((track) => practice.filter((p) => p.track === track.id).every((p) => solvedIds.has(p.id))).length;
  const inTrack = (id: string) => practice.filter((p) => p.track === id);
  const solvedIn = (id: string) => inTrack(id).filter((p) => solvedIds.has(p.id)).length;
  const fullScenarios = scenarios.filter((s) => s.parts.length > 1 && s.parts.every((part) => solvedIds.has(part.id))).length;

  // When things were solved, in UK time, for the secret awards.
  const hours = solveRows.map((s) => Number(dateToLondonInput(s.solvedAt).slice(11, 13)));
  const days = new Set(solveRows.map((s) => londonDay(s.solvedAt)));
  const weekend = [...days].some((day) => new Date(`${day}T12:00:00Z`).getUTCDay() === 6 && days.has(shiftDay(day, 1)));
  const times = solveRows.map((s) => dateToLondonInput(s.solvedAt));
  const piTime = times.some((t) => /T(03|15):14/.test(t));
  const leapDay = [...days].some((day) => day.endsWith("-02-29"));
  // A gap of 14 days or more between two days with a solve.
  const sortedDays = [...days].sort();
  const comeback = sortedDays.some((day, i) => i > 0 && shiftDay(sortedDays[i - 1], 14) <= day);
  // Three solves within ten minutes.
  const stamps = solveRows.map((s) => s.solvedAt.getTime()).sort((a, b) => a - b);
  const speedrun = stamps.some((t, i) => i >= 2 && t - stamps[i - 2] <= 10 * 60_000);
  // A date whose day and month are only 0s and 1s, such as 11/11 or 10/01.
  const binaryDay = [...days].some((day) => /^\d{4}-[01]{2}-[01]{2}$/.test(day));
  const lunchBreak = hours.some((h) => h === 12);
  // A time such as 12:21 or 15:51, that reads the same backwards.
  const palindrome = times.some((t) => t[11] === t[15] && t[12] === t[14]);
  const friday13 = [...days].some((day) => day.endsWith("-13") && new Date(`${day}T12:00:00Z`).getUTCDay() === 5);
  // Code written, a bug fixed and a puzzle solved on the same day.
  const kindsByDay = new Map<string, Set<string>>();
  for (const s of solveRows) {
    const day = londonDay(s.solvedAt);
    const kind = s.problem.kind === "PUZZLE" ? "puzzle" : s.problem.style === "FIX" ? "fix" : s.problem.style === "ORDER" ? "order" : "write";
    kindsByDay.set(day, (kindsByDay.get(day) ?? new Set()).add(kind));
  }
  const tripleThreat = [...kindsByDay.values()].some((kinds) => kinds.has("write") && kinds.has("fix") && kinds.has("puzzle"));

  const make =
    (group: string, secret = false) =>
    (id: string, code: string, title: string, description: string, color: string, done: number, needed: number): Award => ({
      id,
      code,
      title,
      description,
      color,
      group,
      secret,
      ...(secret ? { clue: CLUES[id] } : {}),
      earned: done >= needed,
      progress: [Math.min(done, needed), needed],
    });
  const solving = make("Solving");
  const fixing = make("Fixing");
  const accuracy = make("Accuracy");
  const taking = make("Taking it on");
  const algorithms = make("Algorithms");
  const breadth = make("Breadth");
  const habits = make("Habits");
  const competing = make("Competing");
  const exams = make("Exams");
  const secret = make("Secret", true);

  return [
    solving("first-pass", "ok", "First pass", "Solve your first challenge.", GREEN, solves.length, 1),
    solving("ten", "10", "Double figures", "Solve 10 challenges.", GREEN, solves.length, 10),
    solving("twenty-five", "25", "Quarter century", "Solve 25 challenges.", GREEN, solves.length, 25),
    solving("fifty", "50", "Half century", "Solve 50 challenges.", GREEN, solves.length, 50),
    solving("hundred", "100", "Centurion", "Solve 100 challenges.", GREEN, solves.length, 100),
    solving("two-hundred", "200", "Double century", "Solve 200 challenges.", GREEN, solves.length, 200),
    solving("in-order", "1↕2", "In good order", "Put 5 programs in order.", GREEN, count((s) => s.style === "ORDER"), 5),
    fixing("first-fix", "fix", "Bug squashed", "Fix your first broken program.", RED, count((s) => s.style === "FIX"), 1),
    fixing("ten-fixes", "x10", "Exterminator", "Fix 10 broken programs.", RED, count((s) => s.style === "FIX"), 10),
    fixing("bug-hunter", "x25", "Bug hunter", "Fix 25 broken programs.", RED, count((s) => s.style === "FIX"), 25),
    accuracy("clean-run", "1st", "Clean run", "Have 5 coding challenges accepted on your first submission.", BLUE, count((s) => s.kind === "CODE" && s.attempts === 1), 5),
    accuracy("sharp-eye", "==", "Sharp eye", "Answer 10 puzzles correctly at the first attempt.", BLUE, count((s) => s.kind === "PUZZLE" && s.attempts === 1), 10),
    accuracy("puzzler", "?", "Puzzler", "Solve 25 puzzles.", BLUE, count((s) => s.kind === "PUZZLE"), 25),
    accuracy("puzzle-master", "??", "Puzzle master", "Solve 50 puzzles.", BLUE, count((s) => s.kind === "PUZZLE"), 50),
    accuracy("tracer", "x=", "Tracer", "Complete 5 trace tables.", BLUE, count((s) => s.style === "TRACE"), 5),
    accuracy("own-steam", "self", "Under your own steam", "Solve 20 challenges without using a hint on them.", BLUE, count((s) => !hinted.has(s.problemId)), 20),
    taking("unassisted", "solo", "Unassisted", "Solve a hard challenge without using a hint.", PURPLE, count((s) => s.difficulty === "HARD" && !hinted.has(s.problemId)), 1),
    taking("heavy-lifting", "hard", "Heavy lifting", "Solve 5 hard challenges.", PURPLE, count((s) => s.difficulty === "HARD"), 5),
    exams("exam-ready", "[6]", "Exam ready", "Solve 10 exam-style questions.", PURPLE, count((s) => s.track === "exam"), 10),
    exams("exam-season", "[30]", "Exam season", "Solve 30 exam-style questions.", PURPLE, count((s) => s.track === "exam"), 30),
    exams("exam-marathon", "[50]", "Exam marathon", "Solve 50 exam-style questions.", PURPLE, count((s) => s.track === "exam"), 50),
    exams("full-paper", "(a-d)", "Every part", "Solve every part of one exam-style scenario.", PURPLE, fullScenarios, 1),
    exams("mock-sitter", "mm:ss", "Exam conditions", "Sit a timed mock paper to the end.", INDIGO, mocksSat, 1),
    algorithms("all-sorts", "sort", "All sorts", "Write bubble, insertion, merge and quick sort.", INDIGO, SORTS.filter((slug) => slugs.has(slug)).length, SORTS.length),
    algorithms("seek-and-find", "find", "Seek and find", "Write linear search and both kinds of binary search.", TEAL, SEARCHES.filter((slug) => slugs.has(slug)).length, SEARCHES.length),
    breadth("all-rounder", "all", "All-rounder", "Solve at least one challenge in every topic.", ORANGE, tracksTouched, tracksInUse.length),
    breadth("completionist", "100%", "Completionist", "Finish every practice challenge in any one topic.", ORANGE, closest[0], closest[1]),
    breadth("hat-trick", "3x", "Hat-trick", "Finish every practice challenge in three topics.", ORANGE, finishedTopics, 3),
    breadth("five-topics", "5x", "Five topics down", "Finish every practice challenge in five topics.", ORANGE, finishedTopics, 5),
    breadth("triple-threat", "w/f/?", "Triple threat", "Write code, fix a bug and solve a puzzle, all on the same day.", ORANGE, tripleThreat ? 1 : 0, 1),
    breadth("off-the-mark", "hi", "Off the mark", "Finish every First steps challenge.", PINK, solvedIn("warmup"), Math.max(inTrack("warmup").length, 1)),
    habits("three-days", "3d", "Three in a row", "Solve something on 3 days running.", PINK, history.best, 3),
    habits("full-week", "7d", "Full week", "Solve something on 7 days running.", PINK, history.best, 7),
    habits("fortnight", "14d", "Fortnight", "Solve something on 14 days running.", PINK, history.best, 14),
    habits("month", "30d", "Month of code", "Solve something on 30 days running.", PINK, history.best, 30),
    habits("saving-up", "h10", "Saving up", "Have 10 hints saved up to spend.", PINK, wallet.balance, 10),
    habits("daily-habit", "day", "Daily habit", "Complete 5 daily challenges on their day.", PINK, dailies, 5),
    habits("on-time", "hw", "On time", "Finish 5 homework sets before they are due.", PINK, homeworkOnTime, 5),
    competing("on-the-clock", "live", "On the clock", "Solve a challenge during a live competition.", INDIGO, inCompetition, 1),
    secret("night-owl", "23:59", "Night owl", "Solve something after 10 at night.", NIGHT, hours.some((h) => h >= 22 || h < 5) ? 1 : 0, 1),
    secret("early-bird", "06:00", "Early bird", "Solve something before half past seven in the morning.", GOLD, solveRows.some((s) => /T0[5-6]:|T07:[0-2]/.test(dateToLondonInput(s.solvedAt))) ? 1 : 0, 1),
    secret("weekend", "sat", "Weekend warrior", "Solve something on a Saturday and the Sunday after it.", ORANGE, weekend ? 1 : 0, 1),
    secret("persistence", "retry", "while not passed", "Get a coding challenge accepted after five or more tries.", RED, count((s) => s.kind === "CODE" && s.attempts >= 5), 1),
    secret("quick-draw", "<2m", "Quick draw", "Type out a medium or hard solution that passes within two minutes of opening it.", TEAL, quick.filter((q) => !isFlagged(q)).length, 1),
    secret("the-answer", "42", "The answer", "Solve 42 challenges. Don't panic.", GOLD, solves.length, 42),
    secret("pi-time", "3.14", "Pi o'clock", "Solve something at 3.14, morning or afternoon.", TEAL, piTime ? 1 : 0, 1),
    secret("byte", "0x100", "A whole byte", "Reach 256 points.", NIGHT, Math.max(points, 0), 256),
    secret("leap-day", "29/2", "Leap of faith", "Solve something on 29 February.", GREEN, leapDay ? 1 : 0, 1),
    secret("comeback", "back", "Welcome back", "Solve something after two weeks or more without solving anything.", ORANGE, comeback ? 1 : 0, 1),
    secret("speedrun", "3/10", "Speedrun", "Solve three challenges within ten minutes.", RED, speedrun ? 1 : 0, 1),
    secret("binary-day", "11/11", "Binary day", "Solve something on a date written only with 0s and 1s, such as 11/11 or 10/10.", NIGHT, binaryDay ? 1 : 0, 1),
    secret("lunch-break", "12:00", "Lunch break", "Solve something between 12 and 1 in the afternoon.", GOLD, lunchBreak ? 1 : 0, 1),
    secret("palindrome", "12:21", "Palindrome", "Solve something at a time that reads the same backwards, such as 12:21.", TEAL, palindrome ? 1 : 0, 1),
    secret("friday-13", "13", "Unlucky for some", "Solve something on Friday the 13th.", RED, friday13 ? 1 : 0, 1),
    secret("recursion", "f(f)", "Recursion", "Solve every practice challenge in Functions and recursion.", PURPLE, solvedIn("recursion"), Math.max(inTrack("recursion").length, 1)),
  ];
}
