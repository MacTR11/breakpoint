--- meta
{"title": "Average of three", "kind": "CODE", "style": "FIX", "difficulty": "EASY", "topic": "Arithmetic", "points": 5, "track": "warmup", "specRef": "2.2.1", "functionName": "average",
  "tests": [
    {"args": [3, 6, 9], "expected": 6.0},
    {"args": [1, 1, 1], "expected": 1.0},
    {"args": [10, 0, 5], "expected": 5.0},
    {"args": [2, 4, 7], "expected": 4.333333333333333, "hidden": true},
    {"args": [0, 0, 0], "expected": 0.0, "hidden": true},
    {"args": [100, 50, 0], "expected": 50.0, "hidden": true}
  ]
}
--- description
`average(a, b, c)` should return the mean of the three numbers: add them together, then divide by 3.

For example, `average(3, 6, 9)` returns `6`.

The code in the editor gives the wrong answer because of the order Python does the arithmetic in. Fix it.
--- hints
- Python divides before it adds, so `a + b + c / 3` only divides `c` by 3.
- Brackets change the order: `(a + b + c) / 3`.
--- starter
def average(a, b, c):
    return a + b + c / 3
--- solution
def average(a, b, c):
    return (a + b + c) / 3
