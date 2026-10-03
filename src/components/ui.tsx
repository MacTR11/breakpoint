import Link from "next/link";
import { difficultyLabel } from "@/lib/problems";
import { TRACKS, trackColor, trackTitle } from "@/lib/tracks";

type Tone = React.CSSProperties & { "--tone"?: string; "--topic"?: string };
export const tone = (color: string): Tone => ({ "--tone": color });

/** What the student is asked to do: write code, repair code, or answer a question. */
export const kindLabel = (kind: string, style?: string) => (kind === "PUZZLE" ? "Puzzle" : style === "FIX" ? "Fix the bug" : "Write code");

/** The word of code that stands for each kind of challenge. */
const kindGlyph = (kind: string, style?: string) => (kind === "PUZZLE" ? "?" : style === "FIX" ? "fix" : "def");

/** A challenge's icon: its topic's colour, holding the glyph for its kind. */
export function KindIcon({ kind, style, track }: { kind: string; style?: string; track: string }) {
  return (
    <span className="icon" style={tone(trackColor(track))} aria-hidden="true">
      {kindGlyph(kind, style)}
    </span>
  );
}

export type ProblemStatus = "solved" | "failing" | "locked" | "open";

const statusWord: Record<ProblemStatus, [string, string]> = {
  solved: ["Solved", "var(--pass)"],
  failing: ["In progress", "var(--warn)"],
  locked: ["Locked", "var(--fail)"],
  open: ["", ""],
};

/** Where a student stands on a challenge, as a word on a wash of its colour. Nothing until they have tried it. */
export function Status({ status }: { status: ProblemStatus }) {
  const [word, color] = statusWord[status];
  if (!word) return null;
  return (
    <span className="tag" style={tone(color)}>
      {word}
    </span>
  );
}

/** A short word on a wash of colour. */
export function Tag({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className="tag" style={tone(color)}>
      {children}
    </span>
  );
}

/** A topic's name in the topic's own colour. */
export function TopicName({ track, className = "" }: { track: string; className?: string }) {
  return (
    <span className={`topic ${className}`} style={{ "--topic": trackColor(track) } as Tone}>
      {trackTitle(track)}
    </span>
  );
}

/** A topic as a block of its colour: name, progress and its glyph in the corner. */
export function TopicTile({ track, solved, total, href }: { track: string; solved: number; total: number; href: string }) {
  const info = TRACKS.find((t) => t.id === track);
  return (
    <Link href={href} className="tile flex min-h-[6.75rem] flex-col justify-between p-4" style={tone(info?.color ?? "#8e8e93")}>
      <span className="glyph top-auto bottom-7 text-[1.75rem]" aria-hidden="true">
        {info?.glyph}
      </span>
      <span className="font-semibold leading-tight">{info?.title ?? track}</span>
      <span>
        <span className="text-xs font-medium opacity-90">
          {solved} of {total}
        </span>
        <span className="meter mt-1.5 block" role="progressbar" aria-valuenow={solved} aria-valuemin={0} aria-valuemax={total}>
          <span style={{ width: `${total ? (solved / total) * 100 : 0}%` }} />
        </span>
      </span>
    </Link>
  );
}

/** A thin progress bar, with the count beside it. */
export function Progress({ value, total, color }: { value: number; total: number; color?: string }) {
  return (
    <span className="flex items-center gap-3" role="img" aria-label={`${value} of ${total} solved`}>
      <span className="meter w-28" style={color ? tone(color) : undefined}>
        <span style={{ width: `${total ? (value / total) * 100 : 0}%` }} />
      </span>
      <span className="w-12 text-right text-sm font-semibold tabular-nums text-muted">
        {value}/{total}
      </span>
    </span>
  );
}

// A slug such as "course-map" becomes "Course map"; a real title such as
// "Exam-style questions" or a file name such as "sum_to.py" is left as it is.
const humanise = (label: string) => (/^[a-z0-9-]+$/.test(label) ? label.charAt(0).toUpperCase() + label.slice(1).replace(/-/g, " ") : label);

/** The way back: links to the pages above this one. */
export function Path({ parts }: { parts: { label: string; href?: string }[] }) {
  const above = parts.filter((part) => part.href);
  if (above.length === 0) return null;
  return (
    <p className="mb-1.5 text-sm font-medium text-muted">
      {above.map((part, index) => (
        <span key={part.label}>
          {index > 0 && <span className="mx-1.5">/</span>}
          <Link href={part.href!} className="text-link hover:underline">
            {humanise(part.label)}
          </Link>
        </span>
      ))}
    </p>
  );
}

/** The page column. Pages lay their own cards out inside it. */
export function Page({ children, width = "max-w-5xl" }: { children: React.ReactNode; width?: string }) {
  return <main className={`mx-auto w-full ${width} px-4 py-7 sm:px-6 sm:py-9`}>{children}</main>;
}

/** A page whose whole content sits on one card. */
export function Sheet({ children, width = "max-w-5xl" }: { children: React.ReactNode; width?: string }) {
  return (
    <Page width={width}>
      <div className="card px-5 py-6 sm:px-8 sm:py-8">{children}</div>
    </Page>
  );
}

export function PageHeader({ path, title, intro, children }: { path: { label: string; href?: string }[]; title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6">
      <Path parts={path} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-4xl font-extrabold tracking-tight">{title}</h1>
        {children}
      </div>
      {intro && <p className="mt-1.5 max-w-2xl text-muted">{intro}</p>}
    </div>
  );
}

/** A row of mutually exclusive filters: a segmented control, or coloured chips when the options are topics. */
export function FilterRow({ label, options }: { label: string; options: { label: string; href: string; active: boolean; track?: string }[] }) {
  const chips = options.some((option) => option.track);
  return (
    <div className={chips ? "flex flex-wrap gap-1.5" : "segmented"} role="group" aria-label={label}>
      {options.map((option) => (
        <Link
          key={option.href}
          href={option.href}
          aria-current={option.active ? "true" : undefined}
          className={chips ? "chip" : undefined}
          style={chips ? tone(option.track ? trackColor(option.track) : "#8e8e93") : undefined}
        >
          {option.label}
        </Link>
      ))}
    </div>
  );
}

export const buttonStyle = { primary: "btn btn-primary", secondary: "btn btn-secondary" };

export function ButtonLink({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "secondary" }) {
  return (
    <Link href={href} className={buttonStyle[variant]}>
      {children}
    </Link>
  );
}

export const link = "text-link hover:underline";

export const levelLabel = (difficulty: string) => difficultyLabel[difficulty] ?? difficulty;

const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/London" });

export function formatDateTime(date: Date) {
  return dateFormat.format(date);
}

/** Points with a real minus sign, so penalties read as "−4" rather than "-4". */
export const signed = (points: number) => (points < 0 ? `−${Math.abs(points)}` : String(points));

/** 1st, 2nd, 3rd, 4th, 11th, 22nd. */
export function ordinal(n: number) {
  const tens = n % 100;
  const suffix = tens >= 11 && tens <= 13 ? "th" : (["th", "st", "nd", "rd"][n % 10] ?? "th");
  return `${n}${suffix}`;
}
