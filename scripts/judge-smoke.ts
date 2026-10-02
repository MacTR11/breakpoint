// Quick check of the judge's failure modes. Run with: npx tsx scripts/judge-smoke.ts
import { judge } from "../src/lib/judge";

const tests = [
  { args: [1], expected: 2 },
  { args: [2], expected: 3, hidden: true },
  { args: [3], expected: 4, hidden: true },
];

const cases: Record<string, string> = {
  correct: "def f(x):\n    return x + 1\n",
  wrong: "def f(x):\n    return x\n",
  "no return": "def f(x):\n    x + 1\n",
  "infinite loop on 2nd test": "def f(x):\n    while x == 2:\n        pass\n    return x + 1\n",
  "loop at top level": "while True:\n    pass\n",
  "syntax error": "def f(x)\n    return x\n",
  "runtime error": "def f(x):\n    return [][x]\n",
  "wrong name": "def g(x):\n    return x + 1\n",
  "memory hog": "def f(x):\n    a = []\n    while True:\n        a.append('x' * 10_000_000)\n",
  "deep recursion": "def f(x):\n    return f(x)\n",
};

async function main() {
  for (const [name, code] of Object.entries(cases)) {
    const started = Date.now();
    const outcome = await judge(code, "f", tests);
    const summary = outcome.results.map((r) => r.status).join(",");
    console.log(`${name.padEnd(28)} ${outcome.status.padEnd(9)} ${summary || outcome.loadError?.split("\n").pop()}  (${Date.now() - started}ms)`);
  }
}

main();
