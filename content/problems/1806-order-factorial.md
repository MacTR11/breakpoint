--- meta
{"title": "Put in order: recursive factorial", "kind": "CODE", "style": "ORDER", "difficulty": "MEDIUM", "topic": "Recursion", "points": 10, "track": "recursion", "specRef": "2.2.1", "functionName": "factorial",
  "tests": [
    {"args": [5], "expected": 120},
    {"args": [1], "expected": 1},
    {"args": [0], "expected": 1},
    {"args": [3], "expected": 6, "hidden": true},
    {"args": [10], "expected": 3628800, "hidden": true}
  ]
}
--- description
The lines below make a working function, but they have been shuffled, and there is a line that does not belong. Leave it out with ✕. Drag them into order (or use the arrow buttons) so that `factorial(n)` returns n × (n − 1) × ... × 1 recursively, with `factorial(0)` and `factorial(1)` both 1.

Each line already has its indentation, so you only need to get the order right.
--- hints
- The base case comes first, so the recursion has somewhere to stop.
- The spare line calls `factorial(n)` again with the same `n`, which would never stop.
--- starter
    return n * factorial(n - 1)
    return factorial(n) * n
def factorial(n):
        return 1
    if n <= 1:
--- solution
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)
