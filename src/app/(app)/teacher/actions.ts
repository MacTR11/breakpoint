"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { judge } from "@/lib/judge";
import { londonToDate } from "@/lib/london";
import { getCurrentUser, SIGNED_OUT, stillTeacher } from "@/lib/session";
import { SPEC_REFS } from "@/lib/spec";
import { TRACK_IDS } from "@/lib/tracks";
import { bannedUse, DIFFICULTIES, type TestCase } from "@/lib/types";
import { callText, toPy } from "../../../../public/judge/harness.mjs";

// React clears a form once its action finishes, so a failed save hands back
// what was typed for the form to refill itself with.
export type FormState = { errors: string[]; values: Record<string, string> } | null;

const typed = (formData: FormData) =>
  Object.fromEntries([...formData.entries()].filter(([key, value]) => typeof value === "string" && !key.startsWith("$"))) as Record<string, string>;

async function assertTeacher() {
  const user = await getCurrentUser();
  if (user?.role !== "TEACHER") throw new Error("Teachers only");
}

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();
// Code keeps its indentation and internal blank lines; only line endings are normalised.
const code = (formData: FormData, key: string) => String(formData.get(key) ?? "").replace(/\r\n/g, "\n").trimEnd();

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

const isSteps = (steps: unknown): steps is [string, ...unknown[]][] =>
  Array.isArray(steps) && steps.length > 0 && steps.every((step) => Array.isArray(step) && typeof step[0] === "string");

function parseTestsField(raw: string, errors: string[]): TestCase[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    errors.push(`Tests are not valid JSON: ${error instanceof Error ? error.message : error}`);
    return [];
  }
  if (!Array.isArray(parsed) || parsed.length === 0) {
    errors.push("Tests must be a JSON list with at least one test.");
    return [];
  }
  const tests: TestCase[] = [];
  parsed.forEach((test, i) => {
    const hidden = test?.hidden ? { hidden: true } : {};
    if (typeof test !== "object" || test === null || !("expected" in test)) {
      errors.push(`Test ${i + 1} needs an "expected" value.`);
    } else if ("steps" in test) {
      if (!isSteps(test.steps)) errors.push(`Test ${i + 1}: "steps" must be a list such as [["Stack"], ["push", 3], ["pop"]].`);
      else if (!Array.isArray(test.expected) || test.expected.length !== test.steps.length - 1) {
        errors.push(`Test ${i + 1}: "expected" must list one return value for each method call (${test.steps.length - 1} here).`);
      } else tests.push({ steps: test.steps, expected: test.expected, ...hidden });
    } else if (Array.isArray(test.args)) {
      tests.push({ args: test.args, expected: test.expected, ...hidden });
    } else {
      errors.push(`Test ${i + 1} needs "args" (a list of the function's arguments) or "steps" (for a class).`);
    }
  });
  if (tests.length && !tests.some((t) => !t.hidden)) errors.push("At least one test must be visible (not hidden) so students have an example to run.");
  return tests;
}

export async function saveProblem(_previous: FormState, formData: FormData): Promise<FormState> {
  if (!(await stillTeacher())) return { errors: [SIGNED_OUT], values: typed(formData) };
  const errors: string[] = [];
  const id = text(formData, "id") || null;
  const title = text(formData, "title");
  const slug = slugify(text(formData, "slug") || title);
  const kind = text(formData, "kind") === "PUZZLE" ? "PUZZLE" : "CODE";
  const difficulty = text(formData, "difficulty");
  const topic = text(formData, "topic");
  const specRef = text(formData, "specRef");
  const track = text(formData, "track");
  const hints = code(formData, "hints")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const points = Number(text(formData, "points"));
  const description = code(formData, "description");

  // The form has no fields for these, so saving would quietly break them.
  if (id && (await db.problem.findUnique({ where: { id }, select: { style: true } }))?.style.match(/^(ORDER|TRACE)$/)) {
    return { errors: ["Put-in-order and trace-table challenges are edited in their file in content/problems."], values: typed(formData) };
  }
  if (!title) errors.push("Give the problem a title.");
  if (!slug) errors.push("The web address could not be worked out from the title.");
  if (!DIFFICULTIES.includes(difficulty as (typeof DIFFICULTIES)[number])) errors.push("Choose a difficulty.");
  if (!topic) errors.push("Give the problem a topic.");
  if (!SPEC_REFS.includes(specRef)) errors.push("Choose which part of the specification this covers.");
  if (!TRACK_IDS.includes(track)) errors.push("Choose a topic for the course map.");
  if (hints.length === 0) errors.push("Write at least one hint. Students spend a hint token to see each one.");
  if (!Number.isInteger(points) || points < 0 || points > 1000) errors.push("Points must be a whole number from 0 to 1000.");
  if (!description) errors.push("Write the question.");
  if (slug && (await db.problem.findFirst({ where: { slug, ...(id ? { NOT: { id } } : {}) } }))) {
    errors.push(`Another problem already uses the web address "${slug}".`);
  }

  const data = {
    title,
    slug,
    kind,
    difficulty,
    topic,
    specRef,
    track,
    hints: JSON.stringify(hints),
    style: "WRITE",
    points,
    description,
    published: formData.get("published") === "on",
    functionName: null as string | null,
    starterCode: null as string | null,
    tests: null as string | null,
    solution: null as string | null,
    banned: null as string | null,
    options: null as string | null,
    answer: null as string | null,
    explanation: null as string | null,
  };

  if (kind === "CODE") {
    const functionName = text(formData, "functionName");
    const starterCode = code(formData, "starterCode");
    const solution = code(formData, "solution");
    const style = text(formData, "style") === "FIX" ? "FIX" : "WRITE";
    const banned = text(formData, "banned")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const tests = parseTestsField(text(formData, "tests"), errors);
    const keyword = tests.length > 0 && tests.every((t) => t.steps) ? "class" : "def";

    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(functionName)) errors.push("The function or class name must be a valid Python name, such as count_vowels or Stack.");
    else if (!new RegExp(`${keyword} ${functionName}\\b`).test(starterCode)) errors.push(`The starter code must contain "${keyword} ${functionName}".`);
    if (!solution) errors.push("Add a reference solution. It is used to check your tests are right, and students never see it.");
    else if (bannedUse(solution, banned)) errors.push("The reference solution uses something on the not-allowed list.");

    // Prove the tests against the reference solution before students meet them.
    if (errors.length === 0) {
      const outcome = await judge(solution, functionName, tests);
      if (outcome.loadError) errors.push(`The reference solution could not be run:\n${outcome.loadError}`);
      for (const result of outcome.results.filter((r) => r.status !== "PASS")) {
        const test = tests[result.index];
        const got = result.status === "FAIL" ? `returned ${result.actual}` : result.status === "TIMEOUT" ? "took too long" : (result.error ?? "was not run");
        errors.push(`Test ${result.index + 1}: ${callText(functionName, test)}\nshould give ${toPy(test.expected)}, but the reference solution ${got}`);
      }
      if (errors.length === 0 && (await judge(starterCode, functionName, tests)).status === "ACCEPTED") {
        errors.push(
          style === "FIX"
            ? "The broken code already passes every test, so there is no bug for students to find."
            : "The starter code already passes every test, so students would score without writing anything.",
        );
      }
    }
    Object.assign(data, { style, functionName, starterCode, solution, tests: JSON.stringify(tests), banned: banned.length ? JSON.stringify(banned) : null });
  } else {
    const options = code(formData, "options")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const answer = text(formData, "answer");
    if (options.length === 1) errors.push("A multiple-choice puzzle needs at least two options. Leave the options empty for a typed answer.");
    if (!answer) errors.push("Enter the correct answer.");
    else if (options.length > 1 && !options.includes(answer)) errors.push("The correct answer must match one of the options exactly.");
    Object.assign(data, {
      options: JSON.stringify(options),
      answer: options.length > 1 ? String(options.indexOf(answer)) : answer,
      explanation: code(formData, "explanation") || null,
    });
  }

  if (errors.length) return { errors, values: typed(formData) };

  if (id) await db.problem.update({ where: { id }, data });
  else {
    const last = await db.problem.aggregate({ _max: { sortOrder: true } });
    await db.problem.create({ data: { ...data, sortOrder: (last._max.sortOrder ?? 0) + 1 } });
  }
  revalidatePath("/", "layout");
  redirect("/teacher/problems");
}

export async function deleteProblem(formData: FormData) {
  await assertTeacher();
  await db.problem.delete({ where: { id: text(formData, "id") } });
  revalidatePath("/", "layout");
  redirect("/teacher/problems");
}

export async function saveContest(_previous: FormState, formData: FormData): Promise<FormState> {
  if (!(await stillTeacher())) return { errors: [SIGNED_OUT], values: { ...typed(formData), problemIds: formData.getAll("problemIds").map(String).join(",") } };
  const errors: string[] = [];
  const id = text(formData, "id") || null;
  const title = text(formData, "title");
  const startsRaw = text(formData, "startsAt");
  const endsRaw = text(formData, "endsAt");
  const problemIds = formData.getAll("problemIds").map(String);

  // No dates at all is allowed: the competition stays an unscheduled pack.
  const startsAt = startsRaw ? londonToDate(startsRaw) : null;
  const endsAt = endsRaw ? londonToDate(endsRaw) : null;

  if (!title) errors.push("Give the competition a title.");
  if (Boolean(startsRaw) !== Boolean(endsRaw)) errors.push("Set both a start and an end time, or leave both empty to schedule it later.");
  else if (startsAt && endsAt) {
    if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) errors.push("Those dates could not be read.");
    else if (endsAt <= startsAt) errors.push("The end time must be after the start time.");
  }
  if (problemIds.length === 0) errors.push("Choose at least one problem.");
  if (errors.length) return { errors, values: { ...typed(formData), problemIds: problemIds.join(",") } };

  const data = { title, description: text(formData, "description"), startsAt, endsAt };
  if (id) {
    // Problems that stay keep their row, and so when they were put in (homework reads it).
    await db.$transaction([
      db.contestProblem.deleteMany({ where: { contestId: id, problemId: { notIn: problemIds } } }),
      ...problemIds.map((problemId, sortOrder) =>
        db.contestProblem.upsert({ where: { contestId_problemId: { contestId: id, problemId } }, create: { contestId: id, problemId, sortOrder }, update: { sortOrder } }),
      ),
      db.contest.update({ where: { id }, data }),
    ]);
  } else {
    await db.contest.create({ data: { ...data, problems: { create: problemIds.map((problemId, sortOrder) => ({ problemId, sortOrder })) } } });
  }
  revalidatePath("/", "layout");
  redirect("/teacher/contests");
}

export async function deleteContest(formData: FormData) {
  await assertTeacher();
  await db.contest.delete({ where: { id: text(formData, "id") } });
  revalidatePath("/", "layout");
  redirect("/teacher/contests");
}

/** Wipe one student's attempts at one problem, e.g. after a mis-click locked a puzzle. */
export async function resetAttempts(formData: FormData) {
  await assertTeacher();
  const where = { userId: text(formData, "userId"), problemId: text(formData, "problemId") };
  await db.$transaction([db.submission.deleteMany({ where }), db.solve.deleteMany({ where })]);
  revalidatePath("/", "layout");
}
