--- meta
{"title": "Hours and minutes", "kind": "CODE", "difficulty": "EASY", "topic": "Arithmetic", "points": 5, "track": "warmup", "specRef": "2.2.1", "functionName": "hours_and_minutes",
  "tests": [
    {"args": [125], "expected": "2h 5m"},
    {"args": [60], "expected": "1h 0m"},
    {"args": [59], "expected": "0h 59m"},
    {"args": [0], "expected": "0h 0m", "hidden": true},
    {"args": [600], "expected": "10h 0m", "hidden": true}
  ]
}
--- description
`hours_and_minutes(total)` should turn a number of minutes into a string such as `"2h 5m"`.

For example, `hours_and_minutes(125)` returns `"2h 5m"` and `hours_and_minutes(60)` returns `"1h 0m"`.
--- hints
- `total // 60` is the whole hours, and `total % 60` is the minutes left over.
- Numbers need `str()` before they can be joined to strings with `+`.
--- starter
def hours_and_minutes(total):
    hours = total // 60
    return str(hours) + "h"
--- solution
def hours_and_minutes(total):
    hours = total // 60
    minutes = total % 60
    return str(hours) + "h " + str(minutes) + "m"
