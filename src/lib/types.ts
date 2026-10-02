/**
 * A test either calls a function with `args`, or builds an object and calls its
 * methods: `steps` is [[ClassName, ...constructorArgs], [method, ...args], ...]
 * and `expected` is the list of what each method call returns.
 */
export type TestCase = { args?: unknown[]; steps?: [string, ...unknown[]][]; expected: unknown; hidden?: boolean };

/** What the judge process is given: inputs only, never the expected answers. */
export const toJob = (tests: TestCase[]) => tests.map((t) => (t.steps ? { steps: t.steps } : { args: t.args ?? [] }));

/**
 * Some problems ask for an algorithm to be written by hand, so ban the shortcut.
 * "sorted(" bans calling sorted but not my_sorted(...); ".sort(" bans the method;
 * anything else is matched as plain text.
 */
export function bannedUse(code: string, banned: string[]): string | null {
  const used = banned.find((text) => {
    const call = /^(\.?)([A-Za-z_][A-Za-z0-9_.]*)\($/.exec(text);
    if (!call) return code.includes(text);
    const name = call[2].replace(/\./g, "\\.");
    return new RegExp(call[1] ? `\\.${name}\\s*\\(` : `(?<![A-Za-z0-9_.])${name}\\s*\\(`).test(code);
  });
  return used ? `This problem asks you to write the algorithm yourself, so "${used.replace(/^\.|\($/g, "")}" is not allowed (even in a comment).` : null;
}

export type TestStatus = "PASS" | "FAIL" | "ERROR" | "TIMEOUT" | "SKIPPED";

export type TestResult = {
  index: number;
  status: TestStatus;
  actual?: string;
  stdout?: string;
  error?: string;
  ms?: number;
  hidden?: boolean;
};

export type JudgeStatus = "ACCEPTED" | "WRONG" | "ERROR" | "TIMEOUT";

export type JudgeOutcome = {
  status: JudgeStatus;
  /** Set when the code could not even be loaded (e.g. a syntax error). */
  loadError?: string;
  results: TestResult[];
};

export type JudgeEvent =
  | { type: "ready" }
  | { type: "fatal"; error: string }
  | { type: "load"; ok: boolean; error: string | null; stdout: string }
  | { type: "start"; index: number }
  | { type: "test"; index: number; ok: boolean; serialisable: boolean; result: unknown; repr: string; stdout: string; error: string | null; ms: number }
  | { type: "done" };

export const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export function overallStatus(results: TestResult[]): JudgeStatus {
  if (results.some((r) => r.status === "TIMEOUT")) return "TIMEOUT";
  if (results.some((r) => r.status === "ERROR")) return "ERROR";
  if (results.every((r) => r.status === "PASS")) return "ACCEPTED";
  return "WRONG";
}
