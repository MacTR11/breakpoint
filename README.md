# Breakpoint

A Python practice and competition platform for A Level Computer Science.

- **Write code**: students write a function or a class in an in-browser editor, run it against examples, then submit to be marked against hidden tests.
- **Exam-style questions**: write-the-code questions in the style of the H446 papers, with a scenario, lettered parts and marks. Solving one reveals its mark scheme and a model answer.
- **First steps**: a gentle on-ramp of tiny challenges with most of the code already written.
- **Fix the bug**: the editor opens on a broken program. Students find the fault and repair it.
- **Puzzles**: read some code and say what it prints, spot the bug, or trace an algorithm. Wrong answers cost points, so guessing does not pay.
- **Debugger and console**: click beside a line number to put a breakpoint (a red dot) on it, then step through a call forwards and backwards, watching the variables change, the call stack grow and shrink, and a trace table fill in the way one is written in an exam. Recursion is drawn as a tree of calls that grows as you step, a list of numbers is drawn as bars with `i`, `j`, `low`, `mid` and `high` pointing into it (outside a search range dimmed), and each line shows how many times it ran. A Python console beside the editor tries the code on any input. Neither marks anything.
- **Hints**: every challenge has hints. Students earn hint tokens by solving challenges and spend one to reveal each hint.
- **Daily challenge, streaks and awards**: one challenge is featured each day and earns a bonus hint if solved that day; a calendar and a streak count show which days a student solved something; and there are 20 awards to collect, plus 6 secret ones.
- **Course map**: every challenge grouped by topic, from Python basics to algorithm challenges, with the student's progress.
- **Competitions**: timed events whose challenges unlock at the start time, with a live leaderboard. Nine ready-made packs are included.
- **Classes**: put students in classes (lower or upper sixth) and the classes are compared on their average points, on the leaderboard, on each student's Home page and on a projector view for the classroom.
- **Homework**: set practice challenges for a class with a due date. Students tick them off on their Home page; you see who finished on time.
- **Mock papers**: students sit exam-style questions against the clock, with hints off, and get marks from the tests their code passes.
- **Paste tracking**: the editor notes when code is pasted in from outside, so you can spot answers copied from elsewhere, and can refuse large pastes altogether.
- **Teacher dashboard**: every student's progress and submitted code, class pages with a topic grid, printable reports, a problem editor, a competition scheduler and a CSV export.
- **Accounts you control**: one teacher account, and student accounts that you create, singly or by importing a CSV of your class. No Google or email accounts are involved.
- **Light and dark**: the site follows the device, with a switch in the account menu (the initials in the top bar). On a phone or tablet the main pages are along the bottom of the screen, like an app.
- **Model answers**: once a student has solved a coding challenge they can compare their code with a model answer. For a fix-the-bug challenge they see what their fix changed, line by line, beside the model fix.
- **Search anywhere**: press Ctrl K (⌘K on a Mac), or the search button in the top bar, and type a few letters to jump to any page, challenge or competition. The teacher can also find any student, class or piece of homework.

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

On the live site the password needs at least 8 characters, or teacher sign-in is switched off; make it long, and do not reuse one from elsewhere. Your sign-in lasts 12 hours, then asks again (`TEACHER_SESSION_HOURS` changes that). Changing your username or password signs you out everywhere, and if you leave yourself signed in on a classroom computer, Teacher → Settings → **Sign out everywhere** ends it. While running the site on your own computer with `npm run dev`, any password is accepted so you can try things quickly. To change your username or password, change these values and restart the site. `AUTH_SECRET` must also be set: it signs the sign-in cookies (`npx auth secret` makes one).

### Student accounts

Teacher → Students → **Add students**.

- **Import a class.** Upload a CSV file, or paste rows straight from a spreadsheet. Give it a heading row: `name` (or `first name` and `surname`), and optionally `class`, `username` and `password`. A class that does not exist yet is made for you. A missing username is made from the name (Ada Lovelace becomes `alovelace`); a missing password is made up for you (two words and a number). If any row has a problem, nothing is imported, so you can fix the file and try again.
- **The sign-in sheet.** After an import the page lists every username and password, with buttons to download it as a CSV or print it. This is the only time the passwords can be read: they are stored as one-way hashes. If a student loses theirs, set a new one.
- **Changing things.** Open a student from the Students table to change their name, username or password, or to delete them along with their work. Setting a new password signs that student out everywhere.
- **Changing many at once.** Import a CSV whose `username` column matches existing students: each row updates that student's name, and their password if the row gives one.

- **Changing many classes at once.** On the Students page, tick students and choose **Move**, or import a CSV with `username` and `class` columns.

Usernames are not case sensitive. After five wrong passwords in a row a username is locked for a short while, and for longer each time after that (up to 15 minutes), so passwords cannot be guessed at speed. Setting a new password for a student clears their lock.

## Classes

Teacher → Classes. Add your classes there (for example 12A and 12B in the lower sixth, 13A and 13B in the upper sixth), or let a CSV import with a `class` column make them. Each class gets a colour of its own.

- **Compared on averages.** A class's score is its points per student, counting everyone in it, including students who have not started. So a class of 12 can beat a class of 20, and the way up is for every student to solve something. Students see the class table on the leaderboard (**Classes**) and a card on their Home page saying how far behind the class above they are.
- **The class page** shows the class's figures, a **topic grid** (a square per student per topic, filling with the topic's colour as they solve its challenges), recent paste flags, and buttons to rename the class, **give the whole class new passwords** (with the sign-in sheet to hand out) and **print a report** for every student.
- **Projector view.** Teacher → Classes → **Projector view** (or `/present`) fills a classroom screen with the classes, this week's top ten (as first name and initial) and any live competition, and refreshes itself every 20 seconds.
- **Reports.** A student's page and each class page have a printable report: points and position in the class, progress in each topic, the last 15 weeks, homework, mock papers, awards and lines for a comment. Paste flags are left off reports.
- Deleting a class (press and hold the button) keeps its students and everything they have solved; they are simply left without a class. Homework set for that class is deleted with it (the button says how many).

## Homework and mock papers

**Homework.** Teacher → Homework → **Set homework**: pick practice challenges (filter by topic or title), a class or every class, and a due date in UK time. Students see it on their Home page as a checklist and on a Homework page; the bell in the top bar tells them when something is set. A challenge solved before the homework was set already counts. Each piece of homework shows a grid of who has done what, on time or late.

A challenge students cannot open, because it has since gone into a competition that has not started or been unpublished, counts only for those who have solved it, and the homework page says which. Once the due date has passed, what counts is whether students could open it at the due date, so a competition that starts (or a pack that is made) afterwards never changes a past result.

**Mock papers.** Practice → **Sit a mock paper**. Students tick exam-style scenarios (or let the site pick about 30 marks they have not done), choose a length (a minute a mark is the default), and work against a countdown. While the paper runs, those questions open with a clean editor and no hints, mark schemes or model answers. Marks are worked out from what they submitted during the paper: full marks for a question whose tests all pass, otherwise the share of tests passed, rounded down. It is an estimate of a mark scheme, not a replacement for one. Their papers appear on their page for you.

## Paste tracking

The code editor counts what each student types and what they paste or drop in from outside it, and how long the editor was open, and stores the counts with each submission. A dropped file counts as a paste, and so does a large block arriving at once from a phone keyboard's clipboard. Moving their own code around inside the editor (copy, cut and paste, or dragging) is not counted, and two tabs open on one challenge keep a single record. A challenge is **flagged** for a student when a single paste is 120 characters or more, or most of the code was pasted. Each flagged challenge counts once, however many times it was submitted afterwards. Flags show on the Students page, the class page and the student's page, beside the code.

Teacher → Settings switches between **recording** large pastes (the default) and **recording and blocking** them, in which case a student who pastes a large block is asked to type it instead. Teachers are never blocked.

Neither setting can stop a student retyping an answer from another screen, and a determined student could send false counts, so treat a flag as a reason for a conversation rather than proof.

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

Points grow with difficulty, and writing a program from nothing is worth more than repairing one or answering a question:

| | Easy | Medium | Hard |
| --- | --- | --- | --- |
| Write code | 10 | 25 | 50 |
| Fix the bug | 10 | 20 | 40 |
| Puzzle | 5 | 10 | 20 |

First steps challenges are worth 5 each, and exam-style questions 5 for each mark. The table is in `src/lib/points.ts`; challenge files carry their own points, so keep them in step when adding challenges.

- **Code** (write or fix) is worth its full points however many attempts are needed.
- **Puzzles** allow two attempts. Each wrong answer **deducts** points, sized so that guessing loses on average: with four options a wrong answer costs a third of the puzzle's value. A correct second attempt earns half points. After two wrong answers the puzzle locks and the worked explanation is shown (after the competition ends, if it is part of a live one).
- **Hints.** Every student starts with 3 hint tokens, earns another for every 3 challenges solved, one for every hard challenge solved, and one for each daily challenge done on its day. Revealing a hint costs one token; hints are revealed in order, gentlest first. Once a challenge is solved, its remaining hints are free to read. The numbers are set in `src/lib/hints.ts`.
- **Daily challenge.** Everyone is shown the same easy or medium practice challenge each day (anyone who had already solved it gets the next in that day's order). Solving it before midnight UK time earns one extra hint token.
- **Awards and streaks** carry no points. Awards are worked out from a student's history each time they are shown, so adding or changing one in `src/lib/awards.ts` applies to everyone at once. Six are secret: they show only a clue until earned.
- **Homework and mock papers** carry no extra points: a challenge scores the same however it is reached.
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
npm run verify    # runs every reference solution through the real judge, and checks the points
npm run db:seed   # loads the files into the database
```

`db:seed` overwrites the database copy of any problem that also exists as a file, so pick one way of editing each problem. Renaming a file keeps its problem and its solves, as long as the title stays the same. Deleting a file removes its problem at the next seed, unless students have worked on it or homework or a mock paper uses it: then it is kept, unpublished and out of any competition that has not started, so nobody loses points, and the seed tells you which to delete or republish in Teacher → Problems. A new file whose name would take over a different problem's address is not loaded, and the seed says so. To put a file's problem in a pack, add `"contest": "<slug>"` to its meta, using a slug from `content/contests.json`. Problems made in the browser are never touched by the seed.

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

- **Data protection.** The site stores each student's name, username, class, a one-way hash of their password, the code they submit and, with each submission, how many characters were typed and pasted and how long the editor was open. It holds no email addresses. Speak to your data protection officer before launch, and host it somewhere they are happy with. Treat the sign-in sheet like any other list of passwords: hand each student only their own line.
- **Passwords you set are known to you.** That is the point of a teacher-managed class, but it means a student's account is only as private as the sheet it was printed on. Students cannot change their own password; you set it.
- **Read through the challenges.** Every coding challenge is proven by `npm run verify`: its reference solution passes every test, its starter code does not, and for a fix-the-bug task the examples reveal the bug. The exam-style mark schemes were written for this project, not taken from OCR, so have a subject specialist read those too. `python3 scripts/check-puzzles.py` recomputes 54 of the 76 puzzle answers, by running the code in the question or re-tracing the algorithm. The other 22 are judgement questions (which kind of error, which fix, which test data), so have a subject specialist read those.

## Before running a national competition

1. **Harden the judge.** Student code runs in a WebAssembly Python interpreter inside a process with no file-write, child-process or worker permissions, and with the bridge to the host blocked. That is a reasonable barrier against curious students, but it has not been independently security tested. For an open competition, run the judge in a separate container with no network access and get it reviewed.
2. **Move to PostgreSQL**, as above. Leaderboards are computed on each page view, which will need caching at national scale.
3. **Add schools and more teachers.** The site is built for one teacher and their classes. Several teachers, per-school leaderboards and a way for schools to register are not built.

## Project layout

| Path | What it is |
| --- | --- |
| `content/problems/` | Starter problems, one file each |
| `content/contests.json` | Ready-made competition packs |
| `src/lib/tracks.ts` | The topics used by the course map |
| `src/lib/hints.ts` | How hint tokens are earned |
| `src/lib/points.ts` | What each kind and difficulty of challenge is worth |
| `src/lib/awards.ts`, `daily.ts`, `activity.ts` | Awards (including the secret ones), the daily challenge, streaks and the solve calendar |
| `src/lib/classes.ts` | Classes, their colours, standings and the topic grid |
| `src/lib/homework.ts`, `mock.ts` | Homework progress, and mock papers and their marks |
| `src/lib/integrity.ts`, `typing-counts.ts`, `settings.ts` | Paste tracking: the flag rule, the editor's counting, and the record-or-block setting |
| `src/lib/notifications.ts` | What the bell in the top bar lists |
| `src/lib/palette.ts`, `src/app/api/palette/route.ts`, `src/components/command-palette.tsx` | The command palette: what it can find and how a search is ranked |
| `src/lib/diff.ts`, `src/components/code-diff.tsx` | The line-by-line comparison shown for a fix |
| `src/lib/debugger.ts`, `trace.ts`, `public/judge/tracer.mjs` | The debugger: breakpoints in the editor, what each step shows, and the recording of a run |
| `src/components/code-workspace.tsx`, `debug-panel.tsx`, `console-panel.tsx` | The editor with its Results, Console and Debugger tabs |
| `src/app/(app)/` | Student pages: home, practice, course map, competitions, leaderboard, awards, homework, mock papers |
| `src/app/(app)/teacher/` | Teacher dashboard: students, classes, homework, problems, competitions, settings, reports |
| `src/app/present/` | The projector view |
| `src/components/app-nav.tsx` | The top bar, the phone tab bar, the bell and the account menu |
| `src/auth.ts`, `src/lib/accounts.ts`, `passwords.ts`, `throttle.ts` | Sign-in, usernames and the CSV import, password hashing, the wrong-password lock |
| `src/app/actions.ts` | Submitting code and puzzle answers; penalties |
| `src/lib/judge.ts`, `judge/runner.mjs` | Server-side marking |
| `public/judge/` | Marking code shared by the browser ("Run") and the server ("Submit") |
| `prisma/schema.prisma` | Database tables |

## Easter eggs

A few things are hidden for students to find. None of them changes a score.

- Tap the name in the top bar five times: the letters fall.
- Run code containing `import antigravity`: the letters float away (Python's own joke).
- On a keyboard, type the Konami code (up, up, down, down, left, right, left, right, B, A): terminal mode, green on black, until it is typed again or the tab is closed.
- Open the browser's developer console.
- Visit a page that does not exist.
- Look under the Home greeting on Ada Lovelace Day, Programmers' Day (the 256th day of the year), pi day and a few other dates.
- Six secret awards (see `src/lib/awards.ts`).

Useful commands: `npm run verify`, `npm run check` (homework states, paste flags, points and marks, the fix diff, palette search and debugger stepping), `python3 scripts/check-puzzles.py`, `npx tsx scripts/judge-smoke.ts` (checks the judge copes with broken and hostile code), `npm run lint`.

**End-to-end tests.** `npm run e2e` drives the real site in a browser: signing in, solving, puzzles, hints, homework and the bell, paste recording and blocking, the debugger and console, search, teacher forms, mock papers, a phone-sized screen, and checks that no hidden test, model answer or unpaid hint ever reaches the page. It starts its own copy of the site on port 3100 with its own database (`prisma/e2e.db`, built from nothing each run by `e2e/prepare.ts`, which refuses any other database), so your data is never touched. The first time, run `npx playwright install chromium`. The tests are in `e2e/`.
