@AGENTS.md

# Breakpoint

A Python practice and competition platform for A Level Computer Science (see README.md), run by one teacher for their own students. The focus is programming: writing code, fixing broken code and reading code. Theory content was deliberately removed.

- `npm run dev` / `npm run build` / `npm run lint` / `npm run verify` (proves every coding challenge in `content/problems` against the judge) / `python3 scripts/check-puzzles.py` (recomputes puzzle answers).
- After changing `prisma/schema.prisma`: `npx prisma db push`, then restart the dev server (it caches the Prisma client). After changing `content/`: `npm run verify && npm run db:seed`.
- If new Tailwind classes do not show up in the running dev server, restart it: its stylesheet scan can go stale.
- Marking logic lives in `public/judge/harness.mjs` and is shared by the browser worker ("Run") and the server judge ("Submit"); change it in one place and re-run `npx tsx scripts/judge-smoke.ts`.
- Expected answers, hidden tests and hints not yet paid for must never reach the browser. `submitCode` strips hidden results; `judge()` sends inputs only; the problem page sends only unlocked hints. A locked puzzle's answer is revealed only when no live competition uses it.
- Accounts: there is no sign-up and no Google sign-in. The one teacher signs in with `TEACHER_USERNAME` / `TEACHER_PASSWORD` from `.env` (never stored in the database). Students are created by the teacher, singly or by CSV (`src/app/(app)/teacher/students/actions.ts`, `src/lib/accounts.ts`). Passwords are scrypt hashes (`src/lib/passwords.ts`) and are only readable at the moment they are set, which is when the sign-in sheet is shown. Changing a password raises `sessionEpoch`, which signs old sessions out; wrong attempts are throttled per username (`src/lib/throttle.ts`).
- Never log, return or store a readable password anywhere except the one-off sign-in sheet, and never weaken the throttle or the hash to make testing easier.
- Every server action and route handler checks the user itself (`getCurrentUser`, `assertTeacher`); layouts alone are not a security boundary.
- `useActionState` forms get their fields back from the action on failure (`FormState.values`), because React resets a form when its action finishes.
- Scores are solves minus `Submission.penalty`; any new total must subtract penalties (`pointsOf`, `leaderboard`, `studentSummaries`). Hint tokens are derived, not stored: see `hintWallet` in `src/lib/hints.ts`.
- Solving goes through `recordSolve` in `src/lib/solve.ts`, which also handles the hint token, the daily bonus and new awards. Awards, streaks and the daily pick are derived on demand; only `DailyBonus` rows are stored. Days are UK calendar days (`londonDay`).
- A contest with null dates is an unscheduled pack: use `isLive` / `isPending` from `src/lib/problems.ts` rather than comparing dates directly.
- A challenge is `kind` CODE or PUZZLE; a CODE challenge has `style` WRITE or FIX (the starter code is deliberately broken). Every challenge needs a `track` and at least one hint.
- Every challenge must be original. Do not copy Bebras, LeetCode or exam-board questions: the "exam" topic is written in the style of the H446 papers (a scenario, parts, marks, a mark scheme) but none of it is taken from them.
- A CODE challenge may have an `--- explanation` section, which is its mark scheme. It and the model answer are shown only once the student has solved the challenge, and never while a live competition is using it (teachers always see them).
- Design follows DESIGN.md ("Playground": grey page, solid rounded cards, rounded display type, each topic a solid block of its own colour, light and dark), which the owner chose from mock-ups after rejecting several other looks, including glass. Read it before any UI work, and show options before restyling. Colours come from the CSS variables so both themes work; statuses are plain words; no glass, blur, gradients, shadows or glows.
