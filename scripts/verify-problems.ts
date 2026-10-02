// Runs every reference solution in content/problems through the real judge, and
// checks every problem is well formed. Run with: npm run verify
import { loadContent, loadContests } from "../prisma/content";
import { judge } from "../src/lib/judge";
import { expectedPoints } from "../src/lib/points";
import { SPEC_REFS } from "../src/lib/spec";
import { TRACK_IDS } from "../src/lib/tracks";
import { bannedUse } from "../src/lib/types";
import { callText } from "../public/judge/harness.mjs";

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
      if (!p.options?.length || p.answer === undefined || !(p.answer in p.options)) problems.push("answer must be an index into options");
      if (new Set(p.options).size !== p.options?.length) problems.push("options must all be different");
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
