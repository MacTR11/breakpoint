import { signed } from "@/components/ui";
import type { LeaderboardRow } from "@/lib/scoring";

export function LeaderboardTable({ rows, currentUserId, emptyMessage }: { rows: LeaderboardRow[]; currentUserId: string; emptyMessage: string }) {
  if (rows.length === 0) return <p className="py-4 text-muted">{emptyMessage}</p>;
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
              <td className="font-display font-extrabold tabular-nums">{row.rank}</td>
              <td>
                {row.name}
                {row.className && <span className="ml-2 text-sm font-normal text-muted">{row.className}</span>}
                {me && (
                  <span className="tag ml-2" style={{ "--tone": "var(--accent)" } as React.CSSProperties}>
                    You
                  </span>
                )}
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
