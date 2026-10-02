# Design

The owner chose this direction (2 October 2026) from four options, after rejecting earlier looks as generic. It is a blend of two ideas: **plain pages**, like good technical documentation, and **the code editor**, the tool students are learning to use.

## The idea

Anything a person wrote is set in the system sans-serif on a white page. Anything the machine says is set in monospace: status, scores, counts, paths, test output. That one rule does most of the work.

The name is Breakpoint, and the mark is a breakpoint: the red dot an editor puts in the gutter next to a line. It appears beside the name and on the sign-in page's code sample, and nowhere else.

## Rules

- **Surfaces.** White page, `#1d1d1f` text, `#6e6e73` secondary text, `#d2d2d7` hairlines. No cards: content sits on the page and lists are separated by hairlines. The only dark surfaces are the code editor and the status bar.
- **Colour.** One blue (`#0066cc`) for links and the primary button. Green, red and amber appear only as the text of a status word. The brand red is for the breakpoint dot only.
- **Status words.** A challenge's state is written as a test runner would report it, in monospace: `PASS`, `FAIL`, `LOCK`, `----`. Competitions use `LIVE`, `SOON`, `DONE`. Never as coloured pills or icons.
- **Lists.** Every list of challenges uses `ChallengeList`: status, title (a link), what it is in grey, points in monospace. One way of listing, everywhere.
- **Paths.** Each page starts with a file-style path such as `~/practice/sorting/quick_sort.py`, which doubles as the breadcrumb.
- **Status bar.** A fixed bar along the bottom, like an editor's, always shows points, challenges solved and hints.
- **Numbers and progress.** Monospace, tabular. Progress is drawn in block characters (`AsciiBar`), not a styled bar.
- **Shape.** 6px corners on buttons, fields and code blocks. Nothing else is rounded except the breakpoint dot.
- **Type.** System sans-serif for prose and headings (600 weight, modest sizes, left-aligned). JetBrains Mono for machine text, loaded through `next/font` so it is served from this site.
- **Filters and tabs** are plain text links; the active one is bold and underlined.

## Never

Shadows, gradients, blur or glass, glows, hover lifts, pill badges, stat-tile rows, cards with rounded corners, a centred hero over three feature cards, an icon in a rounded square, coloured edge strips on boxes, all-caps labels, decorative numbering, fake window buttons, emoji. If a new page seems to need one of these, it needs a table or a list instead.

## Words

Sentence case. Short. Say what happened and what to do. Machine text is terse and lower-case apart from the status word: `FAIL −4 points, 1 attempt left`.
