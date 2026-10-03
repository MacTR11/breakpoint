--- meta
{"title": "Square it", "kind": "CODE", "difficulty": "EASY", "topic": "Arithmetic", "points": 5, "track": "warmup", "specRef": "2.2.1", "functionName": "square",
  "tests": [
    {"args": [4], "expected": 16},
    {"args": [0], "expected": 0},
    {"args": [-3], "expected": 9},
    {"args": [12], "expected": 144, "hidden": true},
    {"args": [1.5], "expected": 2.25, "hidden": true}
  ]
}
--- description
`square(n)` should return `n` multiplied by itself.

For example, `square(4)` returns `16`.
--- hints
- Multiply with `*`: `n * n`.
- Remember to `return` the answer.
--- starter
def square(n):
    return n
--- solution
def square(n):
    return n * n
