// Runs every reference solution in content/problems through the real judge, and
// checks every problem is well formed. Run with: npm run verify
import { loadContent, loadContests } from "../prisma/content";
import { judge } from "../src/lib/judge";
import { expectedPoints } from "../src/lib/points";
import { SPEC_REFS } from "../src/lib/spec";
import { TRACK_IDS } from "../src/lib/tracks";
import { bannedUse } from "../src/lib/types";
import { callText } from "../public/judge/harness.mjs";

/** What is wrong with a trace table's layout and answer, if anything. */
function traceProblems(spec: unknown, answer: unknown): string[] {
  const table = spec as { columns?: unknown[]; rows?: unknown[] };
  if (!table || !Array.isArray(table.columns) || !Array.isArray(table.rows)) return ["a trace table needs options with columns and rows"];
  const columns = table.columns;
  if (!Array.isArray(answer) || answer.length !== table.rows.length) return ["the answer needs one row for every row of the table"];
  const errors: string[] = [];
  let blanks = 0;
  table.rows.forEach((row, r) => {
    const full = (answer as unknown[])[r];
    if (!Array.isArray(row) || !Array.isArray(full) || row.length !== columns.length || full.length !== row.length) {
      errors.push(`row ${r + 1} has the wrong number of cells`);
      return;
    }
    row.forEach((cell, c) => {
      if (cell === null) blanks++;
      else if (cell !== full[c]) errors.push(`row ${r + 1}, ${columns[c]}: the given cell does not match the answer`);
    });
  });
  if (blanks === 0) errors.push("a trace table needs at least one cell for the student to fill in");
  return errors;
}

async function main() {
  const contests = new Set(loadContests().map((c) => c.slug));
  const only = process.argv[2];
  let failures = 0;
  let checked = 0;

  for (const p of loadContent()) {
    if (only && !p.slug.includes(only)) continue;
    checked++;
    const problems: string[] = [];
    if (!SPEC_REFS.includes(p.specRef)) problems.push(`specRef "${p.specRef}" is not in src/lib/spec.ts`);
    if (!TRACK_IDS.includes(p.track)) problems.push(`track "${p.track}" is not in src/lib/tracks.ts`);
    if (p.contest && !contests.has(p.contest)) problems.push(`contest "${p.contest}" is not in content/contests.json`);
    if (!["EASY", "MEDIUM", "HARD"].includes(p.difficulty)) problems.push("difficulty must be EASY, MEDIUM or HARD");
    if (p.hints.length === 0) problems.push("needs a hints section with at least one hint");
    if (p.points !== expectedPoints(p)) problems.push(`points should be ${expectedPoints(p)} (see src/lib/points.ts), not ${p.points}`);

    if (p.kind === "CODE") {
      if (!p.functionName || !p.tests?.length || !p.solution || !p.starter) {
        problems.push("needs functionName, tests, a starter section and a solution section");
      } else {
        // A put-in-order challenge offers the lines of its answer, shuffled, perhaps with a few spare ones.
        if (p.style === "ORDER") {
          const offered = p.starter.split("\n").filter((line) => line.trim());
          for (const line of p.solution.split("\n").filter((l) => l.trim())) {
            const at = offered.indexOf(line);
            if (at === -1) problems.push(`the answer's line ${JSON.stringify(line)} is not among the lines offered`);
            else offered.splice(at, 1);
          }
        }
        const keyword = p.tests.every((t) => t.steps) ? "class" : "def";
        if (!new RegExp(`${keyword} ${p.functionName}\\b`).test(p.starter)) problems.push(`starter code does not contain "${keyword} ${p.functionName}"`);
        if (!p.tests.some((t) => !t.hidden)) problems.push("needs at least one visible test");
        if (bannedUse(p.solution, p.banned ?? [])) problems.push("reference solution uses something on the banned list");
        if (p.style === "FIX" && bannedUse(p.starter, p.banned ?? [])) problems.push("the broken starter code uses something on the banned list");
        const outcome = await judge(p.solution, p.functionName, p.tests);
        if (outcome.status !== "ACCEPTED") {
          problems.push(`reference solution: ${outcome.status} ${outcome.loadError ?? ""}`);
          for (const r of outcome.results.filter((r) => r.status !== "PASS")) {
            const test = p.tests[r.index];
            problems.push(`  test ${r.index + 1}: ${callText(p.functionName, test).replace(/\n/g, "; ")}\n        got ${r.actual ?? r.error}\n        expected ${JSON.stringify(test.expected)}`);
          }
        }
        // The untouched starter code must not pass: for a WRITE problem that would
        // be free points, and for a FIX problem it would mean there is no bug.
        const starter = await judge(p.starter, p.functionName, p.tests);
        if (starter.status === "ACCEPTED") problems.push("starter code passes every test");
        // A bug that the visible examples do not reveal gives students nothing to go on.
        if (p.style === "FIX" && !starter.loadError && starter.results.filter((r) => !r.hidden).every((r) => r.status === "PASS")) {
          problems.push("the bug is not revealed by any visible test");
        }
      }
    } else {
      if (p.style === "TRACE") {
        problems.push(...traceProblems(p.options, p.answer));
      } else if (!Array.isArray(p.options) || typeof p.answer !== "number") {
        problems.push("options must be a list and answer an index into it");
      } else {
        if (!p.options.length || !(p.answer in p.options)) problems.push("answer must be an index into options");
        if (new Set(p.options).size !== p.options.length) problems.push("options must all be different");
      }
      if (!p.explanation) problems.push("needs an explanation section");
    }
    console.log(`${problems.length ? "FAIL" : " ok "}  ${p.slug}`);
    for (const line of problems) console.log(`      ${line}`);
    failures += problems.length ? 1 : 0;
  }
  if (failures) {
    console.log(`\n${failures} of ${checked} problems need attention.`);
    process.exit(1);
  }
  console.log(`\nAll ${checked} problems verified.`);
}

main();
