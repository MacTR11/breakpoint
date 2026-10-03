# Design: Playground

The owner chose this direction on 2 October 2026 from eight mock-ups, after rejecting several earlier looks (most recently frosted glass over a blurred backdrop, which they called terrible). Their brief was "Playground, with a bit more character", in light and dark. Do not restyle it without showing options first.

## The idea

It should feel like a well-made Apple app that happens to be about code: a soft grey page, solid white cards with generous corners, big rounded numbers, and colour used in confident solid blocks rather than tints and effects. Each topic owns a colour, and that colour is how you find your way around.

The name is Breakpoint, and the mark is a breakpoint: the red dot an editor puts in the gutter next to a line. It sits beside the name, and turns green for a moment when a challenge is solved.

## Rules

- **Surfaces.** The page is `--page` (light grey, or black in dark mode). Content sits on `.card`: solid, 22px corners, no border and no shadow. Never blur, glass, gradients or glows, with one exception: the solved pop-up blurs the page behind it, at the owner's request, so that "go back" is the obvious next step. Inside a card, rows are separated by hairlines (`border-line`) and quieter areas use `bg-paper`.
- **Light and dark.** Every colour is a variable in `globals.css`, defined once for light and once under `.dark`. The site follows the device until the Light/Dark button in the account menu is used, then remembers the choice in that browser. Use the variables (`text-ink`, `text-muted`, `bg-card`, `bg-paper`, `border-line`, `text-pass`...), never a fixed hex, except inside the code editor, which is dark in both themes.
- **Type.** Headings, big numbers and the wordmark use `font-display` at weight 800: the system's rounded face on Apple devices, Nunito elsewhere (served from this site by `next/font`). Body text is the system sans-serif. Monospace (JetBrains Mono) is only for code, the editor, test output and the little code glyphs.
- **Topic colours** (`src/lib/tracks.ts`). Each topic has a colour deep enough for white text, and a `glyph`: a scrap of code such as `>>>`, `[ ]` or `f(f)`. A topic appears as a `TopicTile` (a solid block of its colour with the glyph printed faintly on it), its name is written in its colour (`TopicName`), and its challenges carry its colour in their icon.
- **Challenge icons.** `KindIcon` is a small rounded square in the topic's colour holding the kind of challenge in monospace: `def` to write code, `fix` to repair it, `?` for a puzzle.
- **Tiles** (`.tile`) are the solid colour blocks: topics, Today's challenge, earned awards, the sign-in page's sample. White text, a faint glyph in a corner, and they press in slightly when tapped.
- **Lists.** Every list of challenges uses `ChallengeList`: icon, title, what it is, a status tag, points. One way of listing, everywhere.
- **Status in plain words**, as a `.tag` (a word on a wash of its colour): Solved, In progress, Locked; Live, Upcoming, Finished. Untouched challenges show nothing. Test results say `✓ Passed`, `✗ Failed`, `✗ Error`, `✗ Too slow` or `– Not run`.
- **Buttons** are fully rounded. One blue primary button per view; secondary buttons are grey.
- **Choosing** between a few options uses a `.segmented` control; choosing a topic uses coloured `.chip`s.
- **Numbers.** Summary numbers are big and rounded (`.figure`) with a small grey label above (`.cap`) and a line of context below. Progress is a thin `.meter`.
- **Typing on a phone.** On a touch screen narrower than the two-column layout, the code editor's panel fills the visible area above the keyboard while it has the cursor (`useTypingMode`): Run and Done along the top, a dark row of Python keys (`MobileKeys`) along the bottom. Keys act on press so the keyboard never closes. Anything you can type into is at least 16px on touch screens, because iPhones zoom the page in otherwise.
- **The way back.** Pages below the top level start with links to the pages above them (`Path`).
- **The top bar** (`src/components/app-nav.tsx`). The wordmark; on screens 1024px and wider the main links in a grey track with the current page on a raised pill (`--raised`) that slides to the next page; the streak and hints as chips from 1280px; a bell; and the viewer's initials, which open the account menu (class, streak, hints, the pages that are not in the bar, the theme, Sign out). Menus opened from the top bar are the one card with a hairline border, so they stand off the page.
- **The tab bar.** Below 1024px the main places are along the bottom, five of them, each with a word of code for an icon: `~` Home, `def` Practice, `vs` Compete, `#1` Ranks, `++` Awards (`sudo` Teacher for the teacher). The current one is a blue block.
- **Classes** each own a colour, given in name order (`classColor`), and appear as tiles the way topics do.
- **Deleting** something that cannot be brought back is press and hold (`HoldButton`): a red wash fills the button while it is held, and a tap does nothing.
- **Homework** is a task list: a ring per challenge, filled green with a tick once solved, the title struck through.

## Character

- The breakpoint dot celebrates a solve, and test results arrive one line at a time.
- Code glyphs on tiles and awards, and `def` / `fix` / `?` on icons, keep it unmistakably about programming.
- Awards are stickers: a block of colour with a glyph once earned, a grey card with a progress line until then. On the Awards page an earned sticker sits slightly askew, and a new award arrives under a solved challenge as a small sticker pressed on, once. Secret awards are a grey card with a clue until found.
- A fix is shown as a diff: lines taken out on a red wash, lines put in on a green one, and the changed part of a line washed more strongly. A failed example washes where the value returned first differs from the one expected.
- Search is a command palette (Ctrl K or ⌘K, or the round search button): a menu card centred under the top bar, results grouped under small grey headings, each with a coloured square like a challenge icon.
- A missing page is a Python traceback (`KeyError` at line 404), and so is an error (`RuntimeError` at line 500).
- Under the editor are three tabs drawn like its file tab: Results, Console and Debugger. In the debugger a breakpoint is the brand's red dot beside a line number, the line reached is washed amber, and a strip of bars shows how deep the calls go over the whole run (recursion rises and falls like a mountain range), with an amber line for where you are; it doubles as the scrubber. Variables that just changed are washed amber, and the trace table fills in as you step. Recursion is a tree of calls, each a small rounded block under the call that made it (amber while running, grey while waiting, its return value in green once done), joined by thin curved lines. A list of numbers is a row of bars with its positions and index variables underneath: changed items amber, items the index variables point at blue, and outside a search range dimmed. Beside each line number, how many times the line ran, the busiest in amber.
- The Home page greets by time of day and says what would extend the streak.
- Streak and hints are in the top bar on a wide screen (1280px and up) and in the account menu below that; the streak is amber only once today's solve is done.

## Motion

Short and only where something has changed: a page (the old one fades, the new one rises 5px), a result or hint arriving (`.rise`), a button or tile being pressed (it shrinks slightly), the top bar's pill sliding to the new page, the bell swinging once when there is something new under it. A thin blue line under the top bar shows how far down a long page you are. Around a quarter of a second, easing `cubic-bezier(0.2, 0.8, 0.2, 1)`. Nothing loops, bounces or counts up, and everything is switched off under `prefers-reduced-motion`.

The one exception is the Easter eggs (`src/components/easter-eggs.tsx`): the wordmark's letters may fall and bounce, or float away, but only when a student sets it off, and never under reduced motion. Terminal mode (the Konami code) changes only the colour variables, green on black, so every page follows without its own styles.

## Borrowed touches

The owner suggested [Rare UI](https://www.rareui.com/components) for small touches that keep the core design. These were adapted and redrawn in solid colour: the sliding nav pill (from its gooey nav, without the blur), the notification bell, hold-to-delete (its delete button), the homework task list, the duration picker on mock papers, the year of solving on the Awards page (its GitHub activity), the scroll-progress line, and the code block for model answers. Its animated counter, orbs, gravity text as an everyday effect, proximity sidebars and emoji reactions were left out because they count up, glow, bounce or use emoji.

## Never

Glass, blur, backdrops, gradients, glows, drop shadows, hover lifts, tinted stat-tile rows, a centred hero over three feature cards, coloured edge strips on boxes, all-caps labels, decorative numbering, fake window buttons, emoji, monospace for ordinary text.

## Words

Sentence case. Short and friendly, never gushing. Say what happened and what to do: `Not right. −4 points, 1 attempt left.`
