--- meta
{"title": "Double it", "kind": "CODE", "difficulty": "EASY", "topic": "Arithmetic", "points": 5, "track": "warmup", "specRef": "2.2.1", "functionName": "double",
  "tests": [
    {"args": [4], "expected": 8},
    {"args": [0], "expected": 0},
    {"args": [-3], "expected": -6},
    {"args": [21], "expected": 42, "hidden": true},
    {"args": [1000], "expected": 2000, "hidden": true},
    {"args": [2.5], "expected": 5.0, "hidden": true}
  ]
}
--- description
`double(n)` should return twice the number it is given.

For example, `double(4)` returns `8`.
--- hints
- Multiplying is written with a star: `n * 2`.
- A function hands its answer back with `return`. So: `return n * 2`.
--- starter
def double(n):
    return n
--- solution
def double(n):
    return n * 2
