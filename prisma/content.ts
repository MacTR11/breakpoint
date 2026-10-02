import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { TestCase } from "../src/lib/types";

export type ContentProblem = {
  slug: string;
  sortOrder: number;
  title: string;
  kind: "CODE" | "PUZZLE";
  difficulty: string;
  topic: string;
  track: string;
  specRef: string;
  style?: "WRITE" | "FIX";
  hints: string[];
  points: number;
  contest?: string;
  description: string;
  functionName?: string;
  tests?: TestCase[];
  banned?: string[];
  starter?: string;
  solution?: string;
  options?: string[];
  answer?: number;
  explanation?: string;
};

/** A ready-made competition. `live` packs start when first seeded; the rest wait to be scheduled. */
export type ContentContest = { slug: string; title: string; description: string; live?: boolean };

const ROOT = path.join(process.cwd(), "content");
const DIR = path.join(ROOT, "problems");

export const loadContests = (): ContentContest[] => JSON.parse(readFileSync(path.join(ROOT, "contests.json"), "utf8"));

/**
 * Each file in content/problems is split into sections by lines like
 * `--- description`. The `meta` section is JSON; the rest are plain text.
 */
export function loadContent(): ContentProblem[] {
  return readdirSync(DIR)
    .filter((file) => file.endsWith(".md"))
    .sort()
    .map((file) => {
      const sections: Record<string, string> = {};
      let current = "";
      for (const line of readFileSync(path.join(DIR, file), "utf8").split("\n")) {
        const heading = /^--- (\w+)\s*$/.exec(line);
        if (heading) {
          current = heading[1];
          sections[current] = "";
        } else if (current) {
          sections[current] += line + "\n";
        }
      }
      const [, order, slug] = /^(\d+)-(.+)\.md$/.exec(file) ?? [];
      if (!slug) throw new Error(`${file}: name files like 101-my-problem.md`);
      let meta;
      try {
        meta = JSON.parse(sections.meta);
      } catch (error) {
        throw new Error(`${file}: the meta section is not valid JSON (${error instanceof Error ? error.message : error})`);
      }
      return {
        ...meta,
        slug,
        sortOrder: Number(order),
        description: sections.description.trim(),
        starter: sections.starter?.trimEnd(),
        solution: sections.solution?.trimEnd(),
        explanation: sections.explanation?.trim(),
        // Each line starting "- " begins a hint.
        hints: (sections.hints ?? "")
          .split(/^- /m)
          .map((hint) => hint.trim())
          .filter(Boolean),
      };
    });
}
