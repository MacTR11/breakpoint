import Link from "next/link";
import { difficultyLabel } from "@/lib/problems";

const difficultyStyles: Record<string, string> = {
  EASY: "bg-[#30d158]/20 text-[#126b2d]",
  MEDIUM: "bg-[#ff9f0a]/22 text-[#7d4a00]",
  HARD: "bg-[#ff453a]/18 text-[#b3231a]",
};

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  return <span className={`badge ${difficultyStyles[difficulty] ?? "bg-white/70 text-ink-soft"}`}>{difficultyLabel[difficulty] ?? difficulty}</span>;
}

/** What the student is asked to do: write code, repair code, or answer a question. */
export const kindLabel = (kind: string, style?: string) => (kind === "PUZZLE" ? "Puzzle" : style === "FIX" ? "Fix the bug" : "Write code");

const kindStyles: Record<string, string> = {
  "Write code": "bg-[#0a84ff]/16 text-[#0a4fa8]",
  "Fix the bug": "bg-[#bf5af2]/20 text-[#6b2bb0]",
  Puzzle: "bg-[#30b0c7]/22 text-[#0d6071]",
};

export function KindBadge({ kind, style }: { kind: string; style?: string }) {
  const label = kindLabel(kind, style);
  return <span className={`badge ${kindStyles[label]}`}>{label}</span>;
}

export type ProblemStatus = "solved" | "locked" | "open";

/** Solved, out of attempts (puzzles only), or still to do. */
export function StatusMark({ status }: { status: ProblemStatus }) {
  if (status === "solved") {
    return (
      <span title="Solved" className="bead bead-done">
        ✓
      </span>
    );
  }
  if (status === "locked") {
    return (
      <span title="No attempts left" className="bead bead-locked">
        ✕
      </span>
    );
  }
  return <span title="Not solved yet" className="bead bead-open" />;
}

export function PageHeader({ title, intro, children }: { title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-5 mb-10">
      <div>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">{title}</h1>
        {intro && <p className="mt-3 text-lg text-muted max-w-2xl">{intro}</p>}
      </div>
      {children}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`glass rounded-3xl ${className}`}>{children}</div>;
}

export const buttonStyle = { primary: "btn btn-primary", secondary: "btn btn-secondary" };

export function ButtonLink({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "secondary" }) {
  return (
    <Link href={href} className={buttonStyle[variant]}>
      {children}
    </Link>
  );
}

/** A filter pill, as used in rows of mutually exclusive choices. */
export const chip = (active: boolean) => `chip ${active ? "chip-on" : ""}`;

export const backLink = "text-sm text-link hover:underline";

export function ProgressBar({ value, total, color }: { value: number; total: number; color?: string }) {
  const percent = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className="well h-2 rounded-full overflow-hidden" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={total}>
      <div className="bar h-full rounded-full" style={{ width: `${percent}%`, ...(color ? { background: color } : {}) }} />
    </div>
  );
}

const avatarColors = ["#0a84ff", "#5e5ce6", "#bf5af2", "#ff375f", "#ff9f0a", "#30b0c7", "#30d158"];

export function Avatar({ name, image, size = 32 }: { name: string; image?: string | null; size?: number }) {
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  // The same person always gets the same colour.
  const color = avatarColors[[...name].reduce((sum, character) => sum + character.charCodeAt(0), 0) % avatarColors.length];
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element -- remote avatar; not worth configuring the image optimiser for
    return <img src={image} alt="" width={size} height={size} referrerPolicy="no-referrer" className="rounded-full" style={{ width: size, height: size }} />;
  }
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full text-white font-medium"
      style={{ width: size, height: size, fontSize: size * 0.4, background: color }}
    >
      {initials}
    </span>
  );
}

const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/London" });

export function formatDateTime(date: Date) {
  return dateFormat.format(date);
}

/** Points with a real minus sign, so penalties read as "−4" rather than "-4". */
export const signed = (points: number) => (points < 0 ? `−${Math.abs(points)}` : String(points));
