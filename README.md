# Bitwise

A Python practice and competition platform for A Level Computer Science.

- **Write code**: students write a function or a class in an in-browser editor, run it against examples, then submit to be marked against hidden tests.
- **Fix the bug**: the editor opens on a broken program. Students find the fault and repair it.
- **Puzzles**: read some code and say what it prints, spot the bug, or trace an algorithm. Wrong answers cost points, so guessing does not pay.
- **Hints**: every challenge has hints. Students earn hint tokens by solving challenges and spend one to reveal each hint.
- **Course map**: every challenge grouped by topic, from Python basics to algorithm challenges, with the student's progress.
- **Competitions**: timed events whose challenges unlock at the start time, with a live leaderboard. Nine ready-made packs are included.
- **Teacher dashboard**: every student's progress and submitted code, a problem editor, a competition scheduler and a CSV export.
- **Google sign-in**, restricted to your school or college domain.

The name shown on the site is set by `NEXT_PUBLIC_SITE_NAME` in `.env`.

## Run it on your computer

You need [Node.js](https://nodejs.org) 22 or newer (built and tested on 24).

```bash
npm install
cp .env.example .env   # skip if .env already exists
npm run setup          # creates the database and loads the starter problems
npm run dev
```

Open <http://localhost:3000>. Until Google sign-in is configured, the sign-in page shows a **Local testing only** form: sign in with any email to act as a student, or with an email listed in `TEACHER_EMAILS` (in `.env`) to act as a teacher. That form is switched off automatically on the live site.

## Set up Google sign-in

Students sign in with their school Google account; the site never sees or stores a password.

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) and create a project. If you create it while signed in to your school account, you can make the app **Internal**, which limits it to your organisation's accounts and avoids Google's app review. Your IT team may need to do this step, or approve the app in the Google Workspace admin console.
2. **APIs & Services → OAuth consent screen**: set the app name and choose *Internal*.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**, type *Web application*.
   - Authorised redirect URI for local testing: `http://localhost:3000/api/auth/callback/google`
   - Add a second one for the live site: `https://YOUR-DOMAIN/api/auth/callback/google`
4. Copy the client ID and secret into `.env`:

```
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."
ALLOWED_EMAIL_DOMAINS="your-college.ac.uk"
TEACHER_EMAILS="you@your-college.ac.uk,colleague@your-college.ac.uk"
```

Restart `npm run dev`. Anyone in `TEACHER_EMAILS` gets the teacher dashboard; everyone else on an allowed domain is a student.

## What is covered

The 197 starter challenges are original, written for this project: 87 write-the-code, 34 fix-the-bug and 76 puzzles. 141 are in Practice and 56 are held in competition packs.

| Topic | Write | Fix | Puzzles | Includes |
| --- | --- | --- | --- | --- |
| Debugging | | 34 | 17 | Syntax, runtime and logic errors; off-by-one; infinite loops; broken searches and sorts; choosing test data that exposes a bug |
| Sorting | 11 | | 10 | Bubble, insertion, merge and quick sort, each written by hand, plus traces and best and worst cases |
| Python basics | 9 | | 11 | Selection, loops, arithmetic, tracing |
| Lists and dictionaries | 15 | | 4 | 1D and 2D lists, records, lookups |
| Data structures | 9 | | 7 | Stacks, queues, linked lists, binary search trees, hash tables |
| Strings | 9 | | 5 | Slicing, building, ciphers, run-length encoding |
| Functions and recursion | 6 | | 8 | Scope, parameter passing, recursive functions |
| Algorithm challenges | 5 | | 6 | Dijkstra, A*, breadth- and depth-first search, backtracking, Big O |
| Searching | 5 | | 5 | Linear and binary search, iterative and recursive |
| Robust programs | 6 | | 2 | Validation, messy file input, test data |
| Object-oriented programming | 6 | | 1 | Classes, encapsulation, inheritance, polymorphism |
| Bits and bytes | 6 | | | Binary, hexadecimal, two's complement, bitwise masks, in code |

Every search and sort named in OCR H446 (linear search, binary search, bubble sort, insertion sort, merge sort, quick sort) has a write-it challenge, a fix-it challenge and at least one tracing puzzle. Each challenge also carries its H446 reference (`specRef`) for your records.

This is a programming platform, not a full revision site: the theory content of Component 01 and the written sections of the programming project are deliberately left out.

## Scoring and hints

- **Code** (write or fix) is worth its full points however many attempts are needed.
- **Puzzles** allow two attempts. Each wrong answer **deducts** points, sized so that guessing loses on average: with four options a wrong answer costs a third of the puzzle's value. A correct second attempt earns half points. After two wrong answers the puzzle locks and the worked explanation is shown (after the competition ends, if it is part of a live one).
- **Hints.** Every student starts with 3 hint tokens and earns another for every 3 challenges solved. Revealing a hint costs one token; hints are revealed in order, gentlest first. Once a challenge is solved, its remaining hints are free to read. The numbers are set in `src/lib/hints.ts`.
- Teachers can reopen a locked puzzle for a student from that student's page, which also refunds the penalty. Teachers reveal hints without spending tokens.
- **Competition standings** count only points and penalties between the start and end times. Ties go to whoever reached that score first.
- Leaderboards list students who have solved at least one challenge. Teacher accounts never appear.

## Competitions

Teacher → Competitions lists the nine packs: Welcome Challenge (live when first set up), Python Sprint, Bug Hunt, Sort It Out, Recursion Rumble, Data Structures Derby, Algorithms Showdown, Build It Right and Grand Final. A pack with no dates is invisible to students; choose **Schedule**, give it start and end times (UK time) and save. Its problems stay hidden until the start, and join Practice automatically once it has finished.

You can also build a competition from any problems in the bank. The form warns you about problems students have already solved, since those will not score again.

## Adding problems

**In the browser:** Teacher → Problems → New problem. For Python problems you provide a reference solution, and saving runs it against your tests, so a wrong expected answer is caught before students see it.

**As files:** each file in `content/problems/` is one problem. Copy an existing one, edit it, then run:

```bash
npm run verify    # runs every reference solution through the real judge
npm run db:seed   # loads the files into the database
```

`db:seed` overwrites the database copy of any problem that also exists as a file, so pick one way of editing each problem. To put a file's problem in a pack, add `"contest": "<slug>"` to its meta, using a slug from `content/contests.json`. Deleting a file removes its problem at the next seed; problems made in the browser are never touched.

Each file's meta also sets `"track"` (the course-map topic, from `src/lib/tracks.ts`) and, for a broken-code task, `"style": "FIX"`. A `--- hints` section lists the hints, one per line starting with `- `. A puzzle with `"check": "run"` has the first Python block in its question executed by `scripts/check-puzzles.py`, which must print the marked answer.

### How Python problems are marked

A **function** test calls the student's function with the given arguments and compares what it returns:

```json
{ "args": [[1, 2, 3]], "expected": 6 }
```

`args` is the list of arguments, so a function taking one list needs `[[1, 2, 3]]`.

A **class** test creates an object, calls methods on it in order, and compares the list of what each call returned:

```json
{ "steps": [["Stack"], ["push", 3], ["pop"], ["is_empty"]], "expected": [null, 3, true] }
```

The first step is the class name followed by its constructor arguments. `expected` has one value per method call.

In both kinds, `"hidden": true` keeps a test for Submit only, where students see just pass or fail. Write values as JSON: `true`, `false` and `null` for Python's `True`, `False` and `None`. Tuples compare as lists, sets as sorted lists, and floats to within one part in a million. Each test has 4 seconds to run.

`"banned": ["sorted(", ".sort("]` rejects code that uses a shortcut when the point is to write the algorithm by hand.

## Putting it online

The site needs an ordinary long-running Node.js server with a disk, for example Railway, Render, Fly.io, a small VPS, or a college server.

```bash
npm install
npm run setup
npm run build
npm start
```

Set the same variables as `.env` on the host, with a fresh `AUTH_SECRET` (`npx auth secret`) and `ALLOW_DEV_LOGIN` removed. Serve it over HTTPS.

The database is a single SQLite file (`prisma/dev.db`), which is plenty for one college. **Back that file up**: it holds every student's progress.

### Why not Vercel?

Vercel does not give a site a persistent disk, so the SQLite file would be wiped on every deploy. To host there, move the database to hosted PostgreSQL first (change `provider` in `prisma/schema.prisma` to `postgresql`, point `DATABASE_URL` at the database, and run `npx prisma db push`). The marker also starts a small sandboxed process for each submission; that is likely to work in Vercel's functions but has not been tested there.

## Before you put real students on it

- **Data protection.** The site stores each student's name, school email address, Google profile picture and the code they submit. Speak to your data protection officer and IT team before launch, and host it somewhere they are happy with.
- **Read through the challenges.** Every coding challenge is proven by `npm run verify`: its reference solution passes every test, its starter code does not, and for a fix-the-bug task the examples reveal the bug. `python3 scripts/check-puzzles.py` recomputes 54 of the 76 puzzle answers, by running the code in the question or re-tracing the algorithm. The other 22 are judgement questions (which kind of error, which fix, which test data), so have a subject specialist read those.

## Before running a national competition

1. **Harden the judge.** Student code runs in a WebAssembly Python interpreter inside a process with no file-write, child-process or worker permissions, and with the bridge to the host blocked. That is a reasonable barrier against curious students, but it has not been independently security tested. For an open competition, run the judge in a separate container with no network access and get it reviewed.
2. **Move to PostgreSQL**, as above. Leaderboards are computed on each page view, which will need caching at national scale.
3. **Add schools.** Each user's email domain is already recorded in `school`. Per-school leaderboards, teachers scoped to their own students, and a registration process for schools are not built yet.

## Project layout

| Path | What it is |
| --- | --- |
| `content/problems/` | Starter problems, one file each |
| `content/contests.json` | Ready-made competition packs |
| `src/lib/tracks.ts` | The topics used by the course map |
| `src/lib/hints.ts` | How hint tokens are earned |
| `src/app/(app)/` | Student pages: home, practice, course map, competitions, leaderboard |
| `src/app/(app)/teacher/` | Teacher dashboard |
| `src/app/actions.ts` | Submitting code and puzzle answers; penalties |
| `src/lib/judge.ts`, `judge/runner.mjs` | Server-side marking |
| `public/judge/` | Marking code shared by the browser ("Run") and the server ("Submit") |
| `prisma/schema.prisma` | Database tables |

Useful commands: `npm run verify`, `python3 scripts/check-puzzles.py`, `npx tsx scripts/judge-smoke.ts` (checks the judge copes with broken and hostile code), `npm run lint`.
