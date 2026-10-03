--- meta
{"title": "Timetable (a): minutes since midnight", "kind": "CODE", "difficulty": "EASY", "topic": "String handling", "points": 15, "track": "exam", "specRef": "2.2.1", "functionName": "to_minutes",
  "tests": [
    {"args": ["14:05"], "expected": 845},
    {"args": ["00:00"], "expected": 0},
    {"args": ["23:59"], "expected": 1439},
    {"args": ["07:45"], "expected": 465, "hidden": true},
    {"args": ["12:00"], "expected": 720, "hidden": true}
  ]
}
--- description
A station shows train times as strings in the 24-hour form `"HH:MM"`, such as `"07:45"` or `"23:10"`.

Write the function `to_minutes(time)`, which returns the number of minutes since midnight. For example, `to_minutes("14:05")` returns `845`.

**[3 marks]**
--- hints
- The hours are the first two characters and the minutes the last two: slicing, or `split(":")`.
- Minutes since midnight are hours × 60 + minutes.
--- starter
def to_minutes(time):
    pass
--- solution
def to_minutes(time):
    hours, minutes = time.split(":")
    return int(hours) * 60 + int(minutes)
--- explanation
One mark each, up to 3:

- Separates the hours from the minutes.
- Converts both to integers.
- Returns hours × 60 + minutes.
