@AGENTS.md

# Bitwise

A Python practice and competition platform for A Level Computer Science (see README.md). The focus is programming: writing code, fixing broken code and reading code. Theory content was deliberately removed.

- `npm run dev` / `npm run build` / `npm run lint` / `npm run verify` (proves every coding challenge in `content/problems` against the judge) / `python3 scripts/check-puzzles.py` (recomputes puzzle answers).
- After changing `prisma/schema.prisma`: `npx prisma db push`, then restart the dev server (it caches the Prisma client). After changing `content/`: `npm run verify && npm run db:seed`.
- If new Tailwind classes do not show up in the running dev server, restart it: its stylesheet scan can go stale.
- Marking logic lives in `public/judge/harness.mjs` and is shared by the browser worker ("Run") and the server judge ("Submit"); change it in one place and re-run `npx tsx scripts/judge-smoke.ts`.
- Expected answers, hidden tests and hints not yet paid for must never reach the browser. `submitCode` strips hidden results; `judge()` sends inputs only; the problem page sends only unlocked hints. A locked puzzle's answer is revealed only when no live competition uses it.
- Every server action and route handler checks the user itself (`getCurrentUser`, `assertTeacher`); layouts alone are not a security boundary.
- `useActionState` forms get their fields back from the action on failure (`FormState.values`), because React resets a form when its action finishes.
- Scores are solves minus `Submission.penalty`; any new total must subtract penalties (`pointsOf`, `leaderboard`, `studentSummaries`). Hint tokens are derived, not stored: see `hintWallet` in `src/lib/hints.ts`.
- A contest with null dates is an unscheduled pack: use `isLive` / `isPending` from `src/lib/problems.ts` rather than comparing dates directly.
- A challenge is `kind` CODE or PUZZLE; a CODE challenge has `style` WRITE or FIX (the starter code is deliberately broken). Every challenge needs a `track` and at least one hint.
- Every challenge must be original. Do not copy Bebras, LeetCode or exam-board questions.
- The visual design is under review (2026-10-02): the owner found the glass-and-gradient look generic. Do not extend it; ask which direction was chosen before doing design work.
