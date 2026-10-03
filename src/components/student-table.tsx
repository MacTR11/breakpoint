"use client";

import Link from "next/link";
import { useState } from "react";
import { moveStudents } from "@/app/(app)/teacher/students/actions";
import { Tag, link, signed } from "@/components/ui";

export type StudentRow = {
  id: string;
  name: string;
  username: string;
  className: string;
  points: number;
  solved: number;
  submissions: number;
  lastActive: string;
  flags: number;
};

/** Every student, with boxes to tick and a class to move the ticked ones into. */
export function StudentTable({ rows, classes }: { rows: StudentRow[]; classes: { id: string; name: string }[] }) {
  const [ticked, setTicked] = useState<Set<string>>(new Set());
  const all = rows.length > 0 && rows.every((r) => ticked.has(r.id));
  const toggle = (id: string) =>
    setTicked((now) => {
      const next = new Set(now);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <form action={moveStudents} onSubmit={() => setTimeout(() => setTicked(new Set()), 0)}>
      <div className="mb-3 flex flex-wrap items-center gap-3 rounded-[14px] bg-paper px-3 py-2 text-sm">
        <span className="font-medium">{ticked.size === 0 ? "Tick students to move them" : `${ticked.size} ticked`}</span>
        <label className="ml-auto flex items-center gap-2">
          <span className="text-muted">Move to</span>
          <select name="classId" defaultValue={classes[0]?.id ?? "none"} className="field !mt-0 !w-auto !py-1">
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
            <option value="none">No class</option>
          </select>
        </label>
        <button disabled={ticked.size === 0} className="btn btn-primary !py-1">
          Move
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="tbl">
          <thead>
            <tr>
              <th className="w-8">
                <input
                  type="checkbox"
                  aria-label="Tick every student shown"
                  checked={all}
                  onChange={() => setTicked(all ? new Set() : new Set(rows.map((r) => r.id)))}
                  className="size-4 cursor-pointer accent-[var(--accent)]"
                />
              </th>
              <th>Student</th>
              <th>Class</th>
              <th className="hidden sm:table-cell">Username</th>
              <th className="num">Points</th>
              <th className="num">Solved</th>
              <th className="num hidden sm:table-cell">Submissions</th>
              <th className="num">Flags</th>
              <th>Last active</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id}>
                <td>
                  <input
                    type="checkbox"
                    name="student"
                    value={s.id}
                    aria-label={`Tick ${s.name}`}
                    checked={ticked.has(s.id)}
                    onChange={() => toggle(s.id)}
                    className="size-4 cursor-pointer accent-[var(--accent)]"
                  />
                </td>
                <td>
                  <Link href={`/teacher/students/${s.id}`} className={link}>
                    {s.name}
                  </Link>
                </td>
                <td className="whitespace-nowrap">{s.className || <span className="text-muted">None</span>}</td>
                <td className="hidden font-mono text-sm text-muted sm:table-cell">{s.username}</td>
                <td className="num">{signed(s.points)}</td>
                <td className="num">{s.solved}</td>
                <td className="num hidden sm:table-cell">{s.submissions}</td>
                <td className="num">{s.flags > 0 ? <Tag color="var(--warn)">{s.flags}</Tag> : <span className="text-muted">0</span>}</td>
                <td className="whitespace-nowrap text-sm text-muted">{s.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </form>
  );
}
