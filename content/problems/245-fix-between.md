--- meta
{"title": "Fix: and versus or", "kind": "CODE", "style": "FIX", "difficulty": "MEDIUM", "topic": "Boolean logic error", "points": 20, "track": "debugging", "specRef": "3.3", "functionName": "between",
  "tests": [
    {"args": [5, 1, 10], "expected": true},
    {"args": [0, 1, 10], "expected": false},
    {"args": [11, 1, 10], "expected": false},
    {"args": [1, 1, 10], "expected": true, "hidden": true},
    {"args": [10, 1, 10], "expected": true, "hidden": true},
    {"args": [-5, -10, -1], "expected": true, "hidden": true},
    {"args": [4, 3, 3], "expected": false, "hidden": true}
  ]
}
--- description
`between(x, low, high)` should return `True` when `x` is from `low` to `high` inclusive, and `False` otherwise.

It says `True` to almost everything.

Fix the code in the editor so that every test passes. Change as little as you need to.
--- hints
- Try `between(0, 1, 10)` in your head. Is 0 at least 1? Is 0 at most 10? Which of those is enough to make the whole condition true?
- For a number to be inside a range, **both** conditions must hold.
--- starter
def between(x, low, high):
    return x >= low or x <= high
--- solution
def between(x, low, high):
    return x >= low and x <= high
