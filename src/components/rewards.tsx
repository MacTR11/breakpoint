import { tone } from "@/components/ui";
import type { Rewards } from "@/lib/solve";

/** The extras a solve earned: a short line for hints, and each new award as a sticker pressed on, once. */
export function RewardLines({ rewards, dark = false }: { rewards: Rewards; dark?: boolean }) {
  const lead = `font-semibold ${dark ? "text-[#e5a50a]" : "text-warn"}`;
  const lines: [string, string][] = [
    ...(rewards.hints > 0 ? [[rewards.hints === 1 ? "Hint earned" : `${rewards.hints} hints earned`, "to spend on any challenge"] as [string, string]] : []),
    ...(rewards.dailyBonus ? [["Daily challenge done", "+1 hint"] as [string, string]] : []),
  ];
  if (lines.length === 0 && rewards.awards.length === 0) return null;
  return (
    <div>
      <ul>
        {lines.map(([first, rest], index) => (
          <li key={first} className="rise" style={{ animationDelay: `${300 + index * 150}ms` }}>
            <span className={lead}>{first}</span> {rest}
          </li>
        ))}
      </ul>
      {rewards.awards.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2.5" aria-label="New awards">
          {rewards.awards.map((award, index) => (
            <li
              key={award.title}
              className="award-sticker"
              style={{ ...tone(award.color), "--tilt": `${index % 2 ? 2 : -2.5}deg`, animationDelay: `${450 + (lines.length + index) * 150}ms` } as React.CSSProperties}
            >
              <span className="font-mono text-[15px] font-bold opacity-80" aria-hidden="true">
                {award.code}
              </span>
              <span>
                <span className="block text-[11px] font-semibold opacity-90">New award</span>
                <span className="block font-sans text-sm font-semibold leading-tight">{award.title}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
