import { Avatar, Card, signed } from "@/components/ui";
import type { LeaderboardRow } from "@/lib/scoring";

const medal: Record<number, string> = { 1: "bg-[#ffd60a] text-[#4a3500]", 2: "bg-[#c7c7cc] text-ink", 3: "bg-[#ff9f0a] text-white" };

export function LeaderboardTable({ rows, currentUserId, emptyMessage }: { rows: LeaderboardRow[]; currentUserId: string; emptyMessage: string }) {
  if (rows.length === 0) return <Card className="p-10 text-center text-muted">{emptyMessage}</Card>;
  return (
    <Card className="overflow-hidden">
      <table className="w-full text-left">
        <thead className="text-xs text-muted">
          <tr className="border-b border-line">
            <th className="px-6 py-3 font-medium w-16">Rank</th>
            <th className="px-2 py-3 font-medium">Student</th>
            <th className="px-6 py-3 font-medium text-right">Solved</th>
            <th className="px-6 py-3 font-medium text-right">Points</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr key={row.userId} className={row.userId === currentUserId ? "bg-accent/5" : undefined}>
              <td className="px-6 py-3.5">
                <span className={`inline-flex h-7 min-w-7 px-1.5 items-center justify-center rounded-full text-sm font-semibold tabular-nums ${medal[row.rank] ?? "text-muted"}`}>
                  {row.rank}
                </span>
              </td>
              <td className="px-2 py-3.5">
                <div className="flex items-center gap-3">
                  <Avatar name={row.name} image={row.image} size={28} />
                  <span className="font-medium">{row.name}</span>
                  {row.userId === currentUserId && <span className="badge bg-accent text-white">You</span>}
                </div>
              </td>
              <td className="px-6 py-3.5 text-right tabular-nums text-muted">{row.solved}</td>
              <td className="px-6 py-3.5 text-right tabular-nums font-semibold">{signed(row.points)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
