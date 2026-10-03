--- meta
{"contest": "winter-cracker", "title": "Fix: days to go", "kind": "CODE", "style": "FIX", "difficulty": "EASY", "topic": "Logic errors", "points": 10, "track": "basics", "specRef": "3.3", "functionName": "advent_message",
  "tests": [
    {"args": [1], "expected": "24 days to go"},
    {"args": [24], "expected": "1 day to go"},
    {"args": [25], "expected": "Merry Christmas!"},
    {"args": [10], "expected": "15 days to go", "hidden": true},
    {"args": [23], "expected": "2 days to go", "hidden": true}
  ]
}
--- description
  `advent_message(day)` takes a date in December from 1 to 25 and should return how long is left until the 25th: `"24 days to go"` on the 1st, `"1 day to go"` on the 24th, and `"Merry Christmas!"` on the 25th itself.

  There are **two** bugs.

Fix the code in the editor so that every test passes.
--- hints
- On the 1st there are 24 days to go. What does `24 - day` give?
- Read the message for the 24th carefully: one day, not one days.
--- starter
def advent_message(day):
    left = 24 - day
    if left == 0:
        return "Merry Christmas!"
    else:
        return str(left) + " days to go"
--- solution
def advent_message(day):
    left = 25 - day
    if left == 0:
        return "Merry Christmas!"
    elif left == 1:
        return "1 day to go"
    else:
        return str(left) + " days to go"
