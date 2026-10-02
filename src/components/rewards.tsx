import type { Rewards } from "@/lib/solve";

/** The extras a solve earned, one short line each. */
export function RewardLines({ rewards, dark = false }: { rewards: Rewards; dark?: boolean }) {
  const tone = dark ? "text-[#e5a50a]" : "text-warn";
  const lines: [string, string][] = [
    ...(rewards.hints > 0 ? [[rewards.hints === 1 ? "Hint earned" : `${rewards.hints} hints earned`, "to spend on any challenge"] as [string, string]] : []),
    ...(rewards.dailyBonus ? [["Daily challenge done", "+1 hint"] as [string, string]] : []),
    ...rewards.awards.map((title) => ["New award", title] as [string, string]),
  ];
  if (lines.length === 0) return null;
  return (
    <ul>
      {lines.map(([lead, rest], index) => (
        <li key={lead + rest} className="rise" style={{ animationDelay: `${300 + index * 150}ms` }}>
          <span className={`font-semibold ${tone}`}>{lead}</span> {rest}
        </li>
      ))}
    </ul>
  );
}
