# Design: Playground

The owner chose this direction on 2 October 2026 from eight mock-ups, after rejecting several earlier looks (most recently frosted glass over a blurred backdrop, which they called terrible). Their brief was "Playground, with a bit more character", in light and dark. Do not restyle it without showing options first.

## The idea

It should feel like a well-made Apple app that happens to be about code: a soft grey page, solid white cards with generous corners, big rounded numbers, and colour used in confident solid blocks rather than tints and effects. Each topic owns a colour, and that colour is how you find your way around.

The name is Breakpoint, and the mark is a breakpoint: the red dot an editor puts in the gutter next to a line. It sits beside the name, and turns green for a moment when a challenge is solved.

## Rules

- **Surfaces.** The page is `--page` (light grey, or black in dark mode). Content sits on `.card`: solid, 22px corners, no border and no shadow. Never blur, glass, gradients or glows. Inside a card, rows are separated by hairlines (`border-line`) and quieter areas use `bg-paper`.
- **Light and dark.** Every colour is a variable in `globals.css`, defined once for light and once under `.dark`. The site follows the device until the Light/Dark button in the top bar is used, then remembers the choice in that browser. Use the variables (`text-ink`, `text-muted`, `bg-card`, `bg-paper`, `border-line`, `text-pass`...), never a fixed hex, except inside the code editor, which is dark in both themes.
- **Type.** Headings, big numbers and the wordmark use `font-display` at weight 800: the system's rounded face on Apple devices, Nunito elsewhere (served from this site by `next/font`). Body text is the system sans-serif. Monospace (JetBrains Mono) is only for code, the editor, test output and the little code glyphs.
- **Topic colours** (`src/lib/tracks.ts`). Each topic has a colour deep enough for white text, and a `glyph`: a scrap of code such as `>>>`, `[ ]` or `f(f)`. A topic appears as a `TopicTile` (a solid block of its colour with the glyph printed faintly on it), its name is written in its colour (`TopicName`), and its challenges carry its colour in their icon.
- **Challenge icons.** `KindIcon` is a small rounded square in the topic's colour holding the kind of challenge in monospace: `def` to write code, `fix` to repair it, `?` for a puzzle.
- **Tiles** (`.tile`) are the solid colour blocks: topics, Today's challenge, earned awards, the sign-in page's sample. White text, a faint glyph in a corner, and they press in slightly when tapped.
- **Lists.** Every list of challenges uses `ChallengeList`: icon, title, what it is, a status tag, points. One way of listing, everywhere.
- **Status in plain words**, as a `.tag` (a word on a wash of its colour): Solved, In progress, Locked; Live, Upcoming, Finished. Untouched challenges show nothing. Test results say `✓ Passed`, `✗ Failed`, `✗ Error`, `✗ Too slow` or `– Not run`.
- **Buttons** are fully rounded. One blue primary button per view; secondary buttons are grey.
- **Choosing** between a few options uses a `.segmented` control; choosing a topic uses coloured `.chip`s.
- **Numbers.** Summary numbers are big and rounded (`.figure`) with a small grey label above (`.cap`) and a line of context below. Progress is a thin `.meter`.
- **The way back.** Pages below the top level start with links to the pages above them (`Path`).

## Character

- The breakpoint dot celebrates a solve, and test results arrive one line at a time.
- Code glyphs on tiles and awards, and `def` / `fix` / `?` on icons, keep it unmistakably about programming.
- Awards are stickers: a block of colour with a glyph once earned, a grey card with a progress line until then.
- The Home page greets by time of day and says what would extend the streak.
- Streak and hints are always in the top bar on a wide screen; the streak is amber only once today's solve is done.

## Motion

Short and only where something has changed: a page (the old one fades, the new one rises 5px), a result or hint arriving (`.rise`), a button or tile being pressed (it shrinks slightly). Around a quarter of a second, easing `cubic-bezier(0.2, 0.8, 0.2, 1)`. Nothing loops, bounces or counts up, and everything is switched off under `prefers-reduced-motion`.

## Never

Glass, blur, backdrops, gradients, glows, drop shadows, hover lifts, tinted stat-tile rows, a centred hero over three feature cards, coloured edge strips on boxes, all-caps labels, decorative numbering, fake window buttons, emoji, monospace for ordinary text.

## Words

Sentence case. Short and friendly, never gushing. Say what happened and what to do: `Not right. −4 points, 1 attempt left.`
