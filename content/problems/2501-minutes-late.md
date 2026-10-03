--- meta
{"contest": "lower-sixth-league", "title": "Minutes late", "kind": "CODE", "difficulty": "EASY", "topic": "String handling", "points": 10, "track": "basics", "specRef": "2.2.1", "functionName": "minutes_late",
  "tests": [
    {"args": ["08:50", "09:05"], "expected": 15},
    {"args": ["13:00", "12:55"], "expected": -5},
    {"args": ["09:00", "09:00"], "expected": 0},
    {"args": ["10:45", "11:20"], "expected": 35, "hidden": true},
    {"args": ["23:30", "23:59"], "expected": 29, "hidden": true},
    {"args": ["07:05", "08:00"], "expected": 55, "hidden": true}
  ]
}
--- description
A bus is due at `due` and arrives at `arrived`. Both are times on the same day, written `"HH:MM"` on the 24-hour clock.

Write `minutes_late(due, arrived)`, which returns how many minutes late the bus was. If it was early the answer is negative, and if it was on time it is 0.

For example `minutes_late("08:50", "09:05")` is `15`.
--- hints
- `"08:50"[:2]` is `"08"` and `"08:50"[3:]` is `"50"`. `int()` turns them into numbers.
- Turn each time into minutes after midnight (hours × 60 + minutes), then subtract.
--- starter
def minutes_late(due, arrived):
    # Write your code here
    pass
--- solution
def minutes_late(due, arrived):
    due_minutes = int(due[:2]) * 60 + int(due[3:])
    arrived_minutes = int(arrived[:2]) * 60 + int(arrived[3:])
    return arrived_minutes - due_minutes
