# Breakpoint

A Python practice and competition platform for A Level Computer Science.

- **Write code**: students write a function or a class in an in-browser editor, run it against examples, then submit to be marked against hidden tests.
- **Exam-style questions**: write-the-code questions in the style of the H446 papers, with a scenario, lettered parts and marks. Solving one reveals its mark scheme and a model answer.
- **First steps**: a gentle on-ramp of tiny challenges with most of the code already written.
- **Fix the bug**: the editor opens on a broken program. Students find the fault and repair it.
- **Puzzles**: read some code and say what it prints, spot the bug, or trace an algorithm. Wrong answers cost points, so guessing does not pay.
- **Hints**: every challenge has hints. Students earn hint tokens by solving challenges and spend one to reveal each hint.
- **Daily challenge, streaks and awards**: one challenge is featured each day and earns a bonus hint if solved that day; a calendar and a streak count show which days a student solved something; and there are 18 awards to collect.
- **Course map**: every challenge grouped by topic, from Python basics to algorithm challenges, with the student's progress.
- **Competitions**: timed events whose challenges unlock at the start time, with a live leaderboard. Nine ready-made packs are included.
- **Teacher dashboard**: every student's progress and submitted code, a problem editor, a competition scheduler and a CSV export.
- **Accounts you control**: one teacher account, and student accounts that you create, singly or by importing a CSV of your class. No Google or email accounts are involved.
- **Light and dark**: the site follows the device, with a switch in the top bar.
- **Model answers**: once a student has solved a coding challenge they can compare their code with a model answer.

The name shown on the site is set by `NEXT_PUBLIC_SITE_NAME` in `.env`. The look is described in [DESIGN.md](DESIGN.md).

## Run it on your computer

You need [Node.js](https://nodejs.org) 22 or newer (built and tested on 24).

```bash
npm install
cp .env.example .env   # skip if .env already exists
npm run setup          # creates the database and loads the starter problems
npm run dev
```

Before the first run, open `.env` and set `TEACHER_PASSWORD` (your own sign-in, see Accounts below) and `AUTH_SECRET` (`npx auth secret` writes one for you).

If the project folder is inside iCloud Drive, OneDrive or Dropbox (a Mac's Desktop and Documents folders often are), add `NEXT_DIST_DIR=".next.nosync"` to `.env`. Sync clients duplicate files inside the build folder, which crashes the dev server. Better still, keep the project somewhere that is not synced.

Open <http://localhost:3000> and sign in as the teacher, with the `TEACHER_USERNAME` and `TEACHER_PASSWORD` you set in `.env` (next section).

## Accounts

There is no sign-up page and no link to Google. You are the only teacher, and you create every student account.

### Your teacher account

Your sign-in lives in `.env` (or, once the site is online, in the host's environment settings), not in the database:

```
TEACHER_USERNAME="teacher"
TEACHER_PASSWORD="a long password of your own"
TEACHER_NAME="Mr Example"
```

The password needs at least 8 characters; make it long, and do not reuse one from elsewhere. To change your username or password, change these values and restart the site. `AUTH_SECRET` must also be set: it signs the sign-in cookies (`npx auth secret` makes one).

### Student accounts

Teacher → Students → **Add students**.

- **Import a class.** Upload a CSV file, or paste rows straight from a spreadsheet. Give it a heading row: `name` (or `first name` and `surname`), and optionally `username` and `password`. A missing username is made from the name (Ada Lovelace becomes `alovelace`); a missing password is made up for you (two words and a number). If any row has a problem, nothing is imported, so you can fix the file and try again.
- **The sign-in sheet.** After an import the page lists every username and password, with buttons to download it as a CSV or print it. This is the only time the passwords can be read: they are stored as one-way hashes. If a student loses theirs, set a new one.
- **Changing things.** Open a student from the Students table to change their name, username or password, or to delete them along with their work. Setting a new password signs that student out everywhere.
- **Changing many at once.** Import a CSV whose `username` column matches existing students: each row updates that student's name, and their password if the row gives one.

Usernames are not case sensitive. After five wrong passwords in a row a username is locked for a short while, and for longer each time after that (up to 15 minutes), so passwords cannot be guessed at speed. Setting a new password for a student clears their lock.

## What is covered

The 245 starter challenges are original, written for this project: 132 write-the-code, 37 fix-the-bug and 76 puzzles. 189 are in Practice and 56 are held in competition packs.

| Topic | Write | Fix | Puzzles | Includes |
| --- | --- | --- | --- | --- |
| First steps | 11 | 3 | | One idea at a time: a return, an `if`, a loop, a list. Worth 5 points each |
| Exam-style questions | 34 | | | Ten scenarios with parts (a), (b), (c): 2D arrays, stacks and queues in arrays, recursion, classes and inheritance, records from a file, sorts and searches by hand, linked lists and trees in arrays, string handling |
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

### Exam-style questions

These are original questions written to match what the programming questions on the H446 papers ask for; none is copied from a past paper, which are OCR's copyright. Each states its marks, and its mark scheme lists what each mark is for. The marking is still automatic (the code either passes the tests or it does not), so use the mark scheme for discussion: a student whose code passes has usually earned every mark, but an examiner also credits partly working answers, which this site cannot.

This is a programming platform, not a full revision site: the theory content of Component 01 and the written sections of the programming project are deliberately left out.

## Scoring and hints

- **Code** (write or fix) is worth its full points however many attempts are needed.
- **Puzzles** allow two attempts. Each wrong answer **deducts** points, sized so that guessing loses on average: with four options a wrong answer costs a third of the puzzle's value. A correct second attempt earns half points. After two wrong answers the puzzle locks and the worked explanation is shown (after the competition ends, if it is part of a live one).
- **Hints.** Every student starts with 3 hint tokens, earns another for every 3 challenges solved, and one for each daily challenge done on its day. Revealing a hint costs one token; hints are revealed in order, gentlest first. Once a challenge is solved, its remaining hints are free to read. The numbers are set in `src/lib/hints.ts`.
- **Daily challenge.** Everyone is shown the same easy or medium practice challenge each day (anyone who had already solved it gets the next in that day's order). Solving it before midnight UK time earns one extra hint token.
- **Awards and streaks** carry no points. Awards are worked out from a student's history each time they are shown, so adding or changing one in `src/lib/awards.ts` applies to everyone at once.
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

Set the same variables as `.env` on the host, with a fresh `AUTH_SECRET` (`npx auth secret`) and your own `TEACHER_PASSWORD`. Serve it over HTTPS: passwords are typed into this site, so it must never be reached over plain HTTP.

The database is a single SQLite file (`prisma/dev.db`), which is plenty for one college. **Back that file up**: it holds every student's progress.

### Vercel

Vercel works, with one change first: it does not give a site a persistent disk, so the SQLite file would be wiped on every deploy. Move the database to hosted PostgreSQL (Vercel's Storage tab offers Neon, which has a free tier):

1. In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`.
2. Set `DATABASE_URL` to the database's connection string, locally and in Vercel's environment settings.
3. Run `npm run setup` once against that database to create the tables and load the challenges.
4. In Vercel's environment settings add `AUTH_SECRET`, `TEACHER_USERNAME`, `TEACHER_PASSWORD` and `NEXT_PUBLIC_SITE_NAME`.

Nothing else needs setting up: there is no Google project or redirect address to configure. One thing is untested there: the marker starts a small sandboxed process for each submission. That is expected to work in Vercel's functions, but submit a challenge straight after the first deploy to make sure.

## Before you put real students on it

- **Data protection.** The site stores each student's name, username, a one-way hash of their password, and the code they submit. It holds no email addresses. Speak to your data protection officer before launch, and host it somewhere they are happy with. Treat the sign-in sheet like any other list of passwords: hand each student only their own line.
- **Passwords you set are known to you.** That is the point of a teacher-managed class, but it means a student's account is only as private as the sheet it was printed on. Students cannot change their own password; you set it.
- **Read through the challenges.** Every coding challenge is proven by `npm run verify`: its reference solution passes every test, its starter code does not, and for a fix-the-bug task the examples reveal the bug. The exam-style mark schemes were written for this project, not taken from OCR, so have a subject specialist read those too. `python3 scripts/check-puzzles.py` recomputes 54 of the 76 puzzle answers, by running the code in the question or re-tracing the algorithm. The other 22 are judgement questions (which kind of error, which fix, which test data), so have a subject specialist read those.

## Before running a national competition

1. **Harden the judge.** Student code runs in a WebAssembly Python interpreter inside a process with no file-write, child-process or worker permissions, and with the bridge to the host blocked. That is a reasonable barrier against curious students, but it has not been independently security tested. For an open competition, run the judge in a separate container with no network access and get it reviewed.
2. **Move to PostgreSQL**, as above. Leaderboards are computed on each page view, which will need caching at national scale.
3. **Add schools and more teachers.** The site is built for one teacher and their students. Several teachers, classes, per-school leaderboards and a way for schools to register are not built.

## Project layout

| Path | What it is |
| --- | --- |
| `content/problems/` | Starter problems, one file each |
| `content/contests.json` | Ready-made competition packs |
| `src/lib/tracks.ts` | The topics used by the course map |
| `src/lib/hints.ts` | How hint tokens are earned |
| `src/lib/awards.ts`, `daily.ts`, `activity.ts` | Awards, the daily challenge, streaks and the solve calendar |
| `src/app/(app)/` | Student pages: home, practice, course map, competitions, leaderboard |
| `src/app/(app)/teacher/` | Teacher dashboard, including adding and editing students |
| `src/auth.ts`, `src/lib/accounts.ts`, `passwords.ts`, `throttle.ts` | Sign-in, usernames and the CSV import, password hashing, the wrong-password lock |
| `src/app/actions.ts` | Submitting code and puzzle answers; penalties |
| `src/lib/judge.ts`, `judge/runner.mjs` | Server-side marking |
| `public/judge/` | Marking code shared by the browser ("Run") and the server ("Submit") |
| `prisma/schema.prisma` | Database tables |

Useful commands: `npm run verify`, `python3 scripts/check-puzzles.py`, `npx tsx scripts/judge-smoke.ts` (checks the judge copes with broken and hostile code), `npm run lint`.
