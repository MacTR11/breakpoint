--- meta
{"title": "The bigger one", "kind": "CODE", "difficulty": "EASY", "topic": "Selection", "points": 5, "track": "warmup", "specRef": "2.2.1", "functionName": "bigger", "banned": ["max("],
  "tests": [
    {"args": [3, 8], "expected": 8},
    {"args": [9, 2], "expected": 9},
    {"args": [5, 5], "expected": 5},
    {"args": [-1, -7], "expected": -1, "hidden": true},
    {"args": [0, 1], "expected": 1, "hidden": true},
    {"args": [100, 99], "expected": 100, "hidden": true}
  ]
}
--- description
`bigger(a, b)` should return whichever of the two numbers is larger. If they are equal, return either one.

Use `if` and `else` rather than `max`.

For example, `bigger(3, 8)` returns `8`.
--- hints
- Compare them with `if a > b:`. When that is true the answer is `a`.
- Otherwise (`else:`) the answer is `b`.
--- starter
def bigger(a, b):
    if a > b:
        return a
--- solution
def bigger(a, b):
    if a > b:
        return a
    else:
        return b
