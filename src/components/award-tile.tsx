import Link from "next/link";
import { tone } from "@/components/ui";
import type { Award } from "@/lib/awards";

/**
 * An award: a block of its own colour once earned, a grey card with a progress
 * line until then. With `href`, the whole box is a link.
 */
export function AwardTile({ award, compact = false, href }: { award: Award; compact?: boolean; href?: string | null }) {
  const [done, needed] = award.progress;
  const size = compact ? "min-h-[4.5rem] px-3.5 py-3" : "min-h-[7.5rem] p-4";
  // A link when there is somewhere to go, otherwise a plain box.
  const box = (className: string, children: React.ReactNode) =>
    href ? (
      <Link href={href} className={`box-link block ${className}`} style={tone(award.color)}>
        {children}
      </Link>
    ) : (
      <div className={className} style={tone(award.color)}>
        {children}
      </div>
    );

  if (award.earned) {
    return box(
      `tile ${size}`,
      <>
        <span className={`glyph ${compact ? "text-xl" : "text-[1.75rem]"}`} aria-hidden="true">
          {award.code}
        </span>
        <p className={`pr-12 font-semibold leading-tight ${compact ? "text-sm" : ""}`}>{award.title}</p>
        {!compact && <p className="mt-1 text-sm opacity-90">{award.description}</p>}
        {!compact && <p className="mt-2 text-xs font-semibold opacity-90">Earned</p>}
      </>,
    );
  }
  if (award.secret) {
    return box(
      `flex flex-col justify-between rounded-[18px] bg-paper ${size}`,
      <>
        <p className={`font-semibold leading-tight text-ink-soft ${compact ? "text-sm" : ""}`}>
          Secret award <span className="font-mono text-muted">???</span>
        </p>
        {!compact && <p className="mt-1 text-sm italic text-muted">{award.clue}</p>}
      </>,
    );
  }
  return box(
    `rounded-[18px] bg-paper ${size}`,
    <>
      <p className={`font-semibold leading-tight text-ink-soft ${compact ? "text-sm" : ""}`}>{award.title}</p>
      {!compact && <p className="mt-1 text-sm text-muted">{award.description}</p>}
      <div className={compact ? "mt-2" : "mt-3"}>
        <div className="meter" role="progressbar" aria-valuenow={done} aria-valuemin={0} aria-valuemax={needed}>
          <span style={{ width: `${(done / needed) * 100}%` }} />
        </div>
        {!compact && (
          <p className="mt-1.5 text-xs font-semibold text-muted">
            {done} of {needed}
          </p>
        )}
      </div>
    </>,
  );
}
