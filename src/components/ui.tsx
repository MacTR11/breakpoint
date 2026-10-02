import Link from "next/link";
import { difficultyLabel } from "@/lib/problems";

/** What the student is asked to do: write code, repair code, or answer a question. */
export const kindLabel = (kind: string, style?: string) => (kind === "PUZZLE" ? "Puzzle" : style === "FIX" ? "Fix the bug" : "Write code");

export type ProblemStatus = "solved" | "failing" | "locked" | "open";

const statusWord: Record<ProblemStatus, [string, string, string]> = {
  solved: ["PASS", "text-pass", "Solved"],
  failing: ["FAIL", "text-fail", "Attempted, not yet solved"],
  locked: ["LOCK", "text-fail", "No attempts left"],
  open: ["----", "text-muted", "Not attempted"],
};

/** A challenge's state, written the way a test runner would report it. */
export function Status({ status }: { status: ProblemStatus }) {
  const [word, color, title] = statusWord[status];
  return (
    <span title={title} className={`font-mono text-[13px] font-semibold ${color}`}>
      {word}
    </span>
  );
}

/** A file-style breadcrumb: ~/practice/sorting */
export function Path({ parts }: { parts: { label: string; href?: string }[] }) {
  return (
    <p className="font-mono text-[13px] text-muted">
      ~
      {parts.map((part) => (
        <span key={part.label}>
          /
          {part.href ? (
            <Link href={part.href} className="text-link hover:underline">
              {part.label}
            </Link>
          ) : (
            part.label
          )}
        </span>
      ))}
    </p>
  );
}

export function PageHeader({ path, title, intro, children }: { path: { label: string; href?: string }[]; title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8">
      <Path parts={path} />
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {children}
      </div>
      {intro && <p className="mt-2 max-w-2xl text-muted">{intro}</p>}
    </div>
  );
}

/** Progress drawn in characters, as a terminal would. */
export function AsciiBar({ value, total, width = 12 }: { value: number; total: number; width?: number }) {
  const filled = total ? Math.round((value / total) * width) : 0;
  return (
    <span className="font-mono text-[13px] whitespace-nowrap" role="img" aria-label={`${value} of ${total} solved`}>
      <span className="text-pass">{"█".repeat(filled)}</span>
      <span className="text-line">{"█".repeat(width - filled)}</span>
      <span className="ml-2 text-muted tabular-nums">
        {value}/{total}
      </span>
    </span>
  );
}

/** A row of mutually exclusive filters, as plain text links. */
export function FilterRow({ label, options }: { label: string; options: { label: string; href: string; active: boolean }[] }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
      <span className="w-12 font-mono text-[13px] text-muted">{label}</span>
      {options.map((option) => (
        <Link
          key={option.href}
          href={option.href}
          aria-current={option.active ? "true" : undefined}
          className={option.active ? "font-semibold text-ink underline underline-offset-4" : "text-link hover:underline"}
        >
          {option.label}
        </Link>
      ))}
    </p>
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
