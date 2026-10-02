// Quick checks of the rules that are worked out on demand rather than stored:
// homework states, paste flags, points and marks, class years and special days.
// Run with: npm run check
import assert from "node:assert/strict";
import { guessYear } from "../src/lib/classes";
import { current, homeworkState, openToStudents, stateOf, type StudentHomework } from "../src/lib/homework";
import { cleanTelemetry, flagsByChallenge, isFlagged, LARGE_PASTE, pasteFlag } from "../src/lib/integrity";
import { marksOf } from "../src/lib/mock";
import { expectedPoints, marksIn } from "../src/lib/points";
import { specialDay } from "../src/lib/special-days";

const checks: [string, () => void][] = [];
const check = (name: string, run: () => void) => checks.push([name, run]);
const day = (iso: string) => new Date(iso);

check("homework: done, late, open and overdue", () => {
  const due = day("2026-10-09T08:30:00Z");
  const before = day("2026-10-08T12:00:00Z");
  const after = day("2026-10-10T12:00:00Z");
  assert.equal(stateOf(due, [before, before], before), "done");
  assert.equal(stateOf(due, [before, after], after), "late");
  assert.equal(stateOf(due, [before, undefined], before), "open");
  assert.equal(stateOf(due, [before, undefined], after), "overdue");
  // Solved before the homework was even set still counts.
  assert.equal(stateOf(due, [day("2025-01-01T00:00:00Z")], before), "done");
});

check("homework: a challenge students cannot open counts only once open or solved", () => {
  const due = day("2026-10-09T08:30:00Z");
  const before = day("2026-10-08T12:00:00Z");
  const after = day("2026-10-10T12:00:00Z");
  // The open one is solved and the held one is not: done, and not overdue after the due date.
  assert.equal(homeworkState(due, [{ solvedAt: before, counts: true }, { solvedAt: undefined, counts: false }], after), "done");
  // Everything held and nothing solved: still to do, never overdue.
  assert.equal(homeworkState(due, [{ solvedAt: undefined, counts: false }], after), "open");
  // Held until after the due date, then solved: it counts, but is not late.
  assert.equal(homeworkState(due, [{ solvedAt: after, counts: false }], after), "done");
  assert.equal(homeworkState(due, [{ solvedAt: after, counts: true }], after), "late");
  assert.equal(homeworkState(due, [{ solvedAt: undefined, counts: true }], after), "overdue");
  // Every challenge deleted: nothing to do.
  assert.equal(homeworkState(due, [], after), "done");
});

check("homework: which challenges students can open", () => {
  const now = day("2026-10-02T12:00:00Z");
  const contest = (startsAt: string | null, endsAt: string | null, createdAt?: string) => ({
    ...(createdAt ? { createdAt: day(createdAt) } : {}),
    contest: { startsAt: startsAt ? day(startsAt) : null, endsAt: endsAt ? day(endsAt) : null },
  });
  assert.equal(openToStudents({ published: true, contests: [] }, now), true);
  assert.equal(openToStudents({ published: false, contests: [] }, now), false);
  assert.equal(openToStudents({ published: true, contests: [contest(null, null)] }, now), false, "in an unscheduled pack");
  assert.equal(openToStudents({ published: true, contests: [contest("2026-10-05T09:00:00Z", "2026-10-05T10:00:00Z")] }, now), false, "competition not started");
  assert.equal(openToStudents({ published: true, contests: [contest("2026-10-02T11:00:00Z", "2026-10-02T13:00:00Z")] }, now), true, "competition running");
  assert.equal(openToStudents({ published: true, contests: [contest("2026-09-01T09:00:00Z", "2026-09-01T10:00:00Z")] }, now), true, "competition over");
  assert.equal(openToStudents({ published: true, contests: [contest(null, null, "2026-10-03T09:00:00Z")] }, now), true, "put in a pack later");
});

check("homework: a past result does not change when a competition starts or a pack is made later", () => {
  const due = day("2026-10-09T08:30:00Z");
  const solved = day("2026-10-08T12:00:00Z");
  const during = day("2026-10-20T09:30:00Z");
  // X went into a competition on 1 Oct that runs on 20 Oct, after the due date. A was solved on time.
  const x = { published: true, contests: [{ createdAt: day("2026-10-01T09:00:00Z"), contest: { startsAt: day("2026-10-20T09:00:00Z"), endsAt: day("2026-10-20T10:00:00Z") } }] };
  const counts = (at: Date) => openToStudents(x, at < due ? at : due);
  assert.equal(counts(during), false, "held at the due date, so it never counts unless solved");
  assert.equal(homeworkState(due, [{ solvedAt: solved, counts: true }, { solvedAt: undefined, counts: counts(during) }], during), "done");
  assert.equal(homeworkState(due, [{ solvedAt: solved, counts: true }, { solvedAt: during, counts: counts(during) }], during), "done");
  // Y was open until the due date and never done; a pack made after the due date does not excuse it.
  const y = { published: true, contests: [{ createdAt: day("2026-10-12T09:00:00Z"), contest: { startsAt: null, endsAt: null } }] };
  assert.equal(openToStudents(y, due), true);
  assert.equal(homeworkState(due, [{ solvedAt: solved, counts: true }, { solvedAt: undefined, counts: openToStudents(y, due) }], during), "overdue");
});

check("homework: Home shows what is not yet due and recent overdue work", () => {
  const now = day("2026-10-02T12:00:00Z");
  const set = (dueAt: string, state: StudentHomework["state"]) => ({ dueAt: day(dueAt), state }) as StudentHomework;
  const sets = [set("2026-10-09T08:30:00Z", "open"), set("2026-10-09T08:30:00Z", "done"), set("2026-09-25T08:30:00Z", "overdue"), set("2026-09-01T08:30:00Z", "overdue"), set("2026-09-25T08:30:00Z", "done")];
  assert.deepEqual(
    current(sets, now).map((h) => `${h.dueAt.toISOString().slice(0, 10)} ${h.state}`),
    ["2026-10-09 open", "2026-10-09 done", "2026-09-25 overdue"],
  );
});

check("paste flags: one large paste, or mostly pasted", () => {
  const code = "x".repeat(200);
  assert.equal(pasteFlag({ code, pastedChars: 0, largestPaste: 0 }), null);
  assert.equal(pasteFlag({ code, pastedChars: LARGE_PASTE - 1, largestPaste: LARGE_PASTE - 1 }), "About 60% of the code was pasted in");
  assert.match(pasteFlag({ code, pastedChars: LARGE_PASTE, largestPaste: LARGE_PASTE })!, /^Pasted 120 characters in one go, about 60% of the code$/);
  assert.equal(pasteFlag({ code, pastedChars: 79, largestPaste: 40 }), null);
  assert.equal(isFlagged({ code: "x".repeat(1000), pastedChars: 100, largestPaste: 50 }), false);
});

check("paste flags: counted once per student per challenge, latest kept", () => {
  const flagged = { code: "x".repeat(150), pastedChars: 150, largestPaste: 150 };
  const rows = [
    { ...flagged, userId: "a", problemId: "p", createdAt: day("2026-10-01T10:00:00Z"), id: 1 },
    { ...flagged, userId: "a", problemId: "p", createdAt: day("2026-10-01T11:00:00Z"), id: 2 },
    { ...flagged, userId: "a", problemId: "q", createdAt: day("2026-10-01T09:00:00Z"), id: 3 },
    { ...flagged, userId: "b", problemId: "p", createdAt: day("2026-10-01T12:00:00Z"), id: 4, pastedChars: 0, largestPaste: 0 },
  ];
  assert.deepEqual(
    flagsByChallenge(rows).map((r) => r.id),
    [2, 3],
  );
});

check("paste counts from the browser are cleaned", () => {
  assert.deepEqual(cleanTelemetry({ pastedChars: -5, largestPaste: 1e12, typedChars: 12.6, seconds: "9" }), { pastedChars: 0, largestPaste: 1_000_000, typedChars: 13, seconds: 0 });
  assert.deepEqual(cleanTelemetry(null), { pastedChars: 0, largestPaste: 0, typedChars: 0, seconds: 0 });
});

check("points follow the table, First steps and exam marks", () => {
  assert.equal(expectedPoints({ kind: "CODE", style: "WRITE", difficulty: "MEDIUM", track: "lists", description: "" }), 25);
  assert.equal(expectedPoints({ kind: "CODE", style: "FIX", difficulty: "HARD", track: "debugging", description: "" }), 40);
  assert.equal(expectedPoints({ kind: "PUZZLE", difficulty: "EASY", track: "basics", description: "" }), 5);
  assert.equal(expectedPoints({ kind: "CODE", style: "WRITE", difficulty: "EASY", track: "warmup", description: "" }), 5);
  assert.equal(expectedPoints({ kind: "CODE", style: "WRITE", difficulty: "HARD", track: "exam", description: "Write it.\n\n**[6 marks]**" }), 30);
  assert.equal(marksIn("**[1 mark]**"), 1);
  assert.equal(marksIn("no marks here"), null);
  assert.equal(marksOf({ description: "nothing", points: 20 }), 4);
});

check("a class's year is guessed from its name", () => {
  for (const name of ["13A", "13b", "U6 Computing", "Upper sixth"]) assert.equal(guessYear(name), "UPPER", name);
  for (const name of ["12A", "L6", "Year 12", "Computing"]) assert.equal(guessYear(name), "LOWER", name);
});

check("special days", () => {
  assert.match(specialDay("2026-09-13")!, /Programmers' Day/);
  assert.match(specialDay("2028-09-12")!, /Programmers' Day/);
  assert.match(specialDay("2026-10-13")!, /Ada Lovelace Day/);
  assert.equal(specialDay("2026-10-06"), null);
  assert.match(specialDay("2027-10-31")!, /Oct 31 == Dec 25/);
});

let failed = 0;
for (const [name, run] of checks) {
  try {
    run();
    console.log(` ok   ${name}`);
  } catch (error) {
    failed++;
    console.log(`FAIL  ${name}\n      ${error instanceof Error ? error.message.split("\n").join("\n      ") : error}`);
  }
}
console.log(failed ? `\n${failed} of ${checks.length} checks failed.` : `\nAll ${checks.length} checks passed.`);
process.exit(failed ? 1 : 0);
