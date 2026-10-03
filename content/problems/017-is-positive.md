--- meta
{"title": "Above zero?", "kind": "CODE", "style": "FIX", "difficulty": "EASY", "topic": "Selection", "points": 5, "track": "warmup", "specRef": "2.2.1", "functionName": "is_positive",
  "tests": [
    {"args": [5], "expected": true},
    {"args": [-2], "expected": false},
    {"args": [0], "expected": false},
    {"args": [0.1], "expected": true, "hidden": true},
    {"args": [-100], "expected": false, "hidden": true}
  ]
}
--- description
`is_positive(n)` should return `True` if `n` is greater than 0, and `False` otherwise. Zero is not positive.
--- hints
- Compare with `>`.
- You can return the comparison directly: `return n > 0`.
--- starter
def is_positive(n):
    return n >= 0
--- solution
def is_positive(n):
    return n > 0
