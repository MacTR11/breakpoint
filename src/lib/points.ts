// What a challenge is worth. Harder work earns clearly more, and writing a
// program from nothing earns more than repairing one or answering a question.
type Level = "EASY" | "MEDIUM" | "HARD";

export const POINTS: Record<"write" | "fix" | "order" | "trace" | "puzzle", Record<Level, number>> = {
  write: { EASY: 10, MEDIUM: 25, HARD: 50 },
  fix: { EASY: 10, MEDIUM: 20, HARD: 40 },
  // Putting given lines in order: easier than writing them.
  order: { EASY: 5, MEDIUM: 10, HARD: 20 },
  // A whole trace table is more work than one puzzle answer.
  trace: { EASY: 10, MEDIUM: 15, HARD: 25 },
  puzzle: { EASY: 5, MEDIUM: 10, HARD: 20 },
};

/** Every First steps challenge is worth the same small amount. */
export const FIRST_STEPS_POINTS = 5;
/** An exam-style question is worth this for each mark it carries. */
export const POINTS_PER_MARK = 5;

export function suggestedPoints(kind: string, style: string | undefined, difficulty: string) {
  const column = kind === "PUZZLE" ? (style === "TRACE" ? "trace" : "puzzle") : style === "FIX" ? "fix" : style === "ORDER" ? "order" : "write";
  return POINTS[column][(difficulty as Level) in POINTS[column] ? (difficulty as Level) : "EASY"];
}

/** The marks an exam-style question carries, from the bold "[4 marks]" in its description. */
export function marksIn(description: string): number | null {
  const found = /\*\*\[(\d+) marks?\]\*\*/.exec(description);
  return found ? Number(found[1]) : null;
}

/** What a challenge file should be worth: the table, or the First steps and exam-style rules. */
export function expectedPoints(problem: { kind: string; style?: string; difficulty: string; track: string; description: string }) {
  if (problem.track === "warmup") return FIRST_STEPS_POINTS;
  const marks = marksIn(problem.description);
  if (problem.track === "exam" && marks) return marks * POINTS_PER_MARK;
  return suggestedPoints(problem.kind, problem.style, problem.difficulty);
}
