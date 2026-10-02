import { signed } from "@/components/ui";
import type { LeaderboardRow } from "@/lib/scoring";

export function LeaderboardTable({ rows, currentUserId, emptyMessage }: { rows: LeaderboardRow[]; currentUserId: string; emptyMessage: string }) {
  if (rows.length === 0) return <p className="border-y border-line py-6 text-muted">{emptyMessage}</p>;
  return (
    <table className="tbl">
      <thead>
        <tr>
          <th className="w-14">Rank</th>
          <th>Student</th>
          <th className="num">Solved</th>
          <th className="num">Points</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const me = row.userId === currentUserId;
          return (
            <tr key={row.userId} className={me ? "font-semibold" : undefined}>
              <td className="font-mono text-sm tabular-nums">{row.rank}</td>
              <td>
                {row.name}
                {me && <span className="ml-2 font-mono text-[13px] font-normal text-muted">you</span>}
              </td>
              <td className="num">{row.solved}</td>
              <td className="num">{signed(row.points)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
