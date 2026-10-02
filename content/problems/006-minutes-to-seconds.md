--- meta
{"title": "Minutes to seconds", "kind": "CODE", "difficulty": "EASY", "topic": "Arithmetic", "points": 5, "track": "warmup", "specRef": "2.2.1", "functionName": "to_seconds",
  "tests": [
    {"args": [2, 30], "expected": 150},
    {"args": [0, 45], "expected": 45},
    {"args": [1, 0], "expected": 60},
    {"args": [10, 10], "expected": 610, "hidden": true},
    {"args": [0, 0], "expected": 0, "hidden": true},
    {"args": [59, 59], "expected": 3599, "hidden": true}
  ]
}
--- description
`to_seconds(minutes, seconds)` should return the total number of seconds.

For example, `to_seconds(2, 30)` returns `150`, because 2 minutes is 120 seconds, plus 30 more.
--- hints
- There are 60 seconds in a minute, so the minutes are worth `minutes * 60`.
- Add the spare seconds on: `return minutes * 60 + seconds`.
--- starter
def to_seconds(minutes, seconds):
    return minutes + seconds
--- solution
def to_seconds(minutes, seconds):
    return minutes * 60 + seconds
