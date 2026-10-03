--- meta
{"title": "Fix: joining text and numbers", "kind": "CODE", "style": "FIX", "difficulty": "EASY", "topic": "Type errors", "points": 10, "track": "debugging", "specRef": "3.3", "functionName": "message",
  "tests": [
    {"args": ["Ada", 7], "expected": "Ada scored 7 points"},
    {"args": ["Ben", 0], "expected": "Ben scored 0 points"},
    {"args": ["Cy", 100], "expected": "Cy scored 100 points"}
  ]
}
--- description
`message(name, score)` should return a string such as `"Ada scored 7 points"`.

It crashes with a `TypeError`. There is **one** bug.
--- hints
- Read the error: Python cannot join a string and a number with `+`.
- Turn the score into a string first with `str(score)`.
--- starter
def message(name, score):
    return name + " scored " + score + " points"
--- solution
def message(name, score):
    return name + " scored " + str(score) + " points"
