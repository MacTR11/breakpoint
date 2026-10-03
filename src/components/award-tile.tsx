import { tone } from "@/components/ui";
import type { Award } from "@/lib/awards";

/** An award: a block of its own colour once earned, a grey card with a progress line until then. */
export function AwardTile({ award, compact = false }: { award: Award; compact?: boolean }) {
  const [done, needed] = award.progress;
  if (award.earned) {
    return (
      <div className={`tile ${compact ? "min-h-[4.5rem] px-3.5 py-3" : "min-h-[7.5rem] p-4"}`} style={tone(award.color)}>
        <span className={`glyph ${compact ? "text-xl" : "text-[1.75rem]"}`} aria-hidden="true">
          {award.code}
        </span>
        <p className={`pr-12 font-semibold leading-tight ${compact ? "text-sm" : ""}`}>{award.title}</p>
        {!compact && <p className="mt-1 text-sm opacity-90">{award.description}</p>}
        {!compact && <p className="mt-2 text-xs font-semibold opacity-90">Earned</p>}
      </div>
    );
  }
  if (award.secret) {
    return (
      <div className={`flex flex-col justify-between rounded-[18px] bg-paper ${compact ? "min-h-[4.5rem] px-3.5 py-3" : "min-h-[7.5rem] p-4"}`}>
        <p className={`font-semibold leading-tight text-ink-soft ${compact ? "text-sm" : ""}`}>
          Secret award <span className="font-mono text-muted">???</span>
        </p>
        {!compact && <p className="mt-1 text-sm italic text-muted">{award.clue}</p>}
      </div>
    );
  }
  return (
    <div className={`rounded-[18px] bg-paper ${compact ? "min-h-[4.5rem] px-3.5 py-3" : "min-h-[7.5rem] p-4"}`} style={tone(award.color)}>
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
    </div>
  );
}
