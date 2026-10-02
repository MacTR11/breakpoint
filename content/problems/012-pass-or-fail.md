--- meta
{"title": "Pass mark", "kind": "CODE", "style": "FIX", "difficulty": "EASY", "topic": "Selection", "points": 5, "track": "warmup", "specRef": "2.2.1", "functionName": "result",
  "tests": [
    {"args": [72], "expected": "pass"},
    {"args": [40], "expected": "pass"},
    {"args": [39], "expected": "try again"},
    {"args": [0], "expected": "try again", "hidden": true},
    {"args": [100], "expected": "pass", "hidden": true},
    {"args": [55], "expected": "pass", "hidden": true}
  ]
}
--- description
A test is out of 100 and the pass mark is 40.

`result(score)` should return the string `"pass"` if the score is 40 or more, and `"try again"` if it is less.

For example, `result(72)` returns `"pass"` and `result(39)` returns `"try again"`.

The code in the editor is nearly right, but it gets one score wrong. Find it and fix it.
--- hints
- "40 or more" is written `score >= 40`. Using `>` on its own would get a score of exactly 40 wrong.
- Use `if` for the pass and `else` for everything lower.
--- starter
def result(score):
    if score > 40:
        return "pass"
    else:
        return "try again"
--- solution
def result(score):
    if score >= 40:
        return "pass"
    else:
        return "try again"
