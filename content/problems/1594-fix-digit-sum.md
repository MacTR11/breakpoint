--- meta
{"title": "Fix: adding the digits", "kind": "CODE", "style": "FIX", "difficulty": "MEDIUM", "topic": "Recursion bugs", "points": 20, "track": "debugging", "specRef": "3.3", "functionName": "digit_sum",
  "tests": [
    {"args": [123], "expected": 6},
    {"args": [7], "expected": 7},
    {"args": [0], "expected": 0},
    {"args": [9999], "expected": 36, "hidden": true},
    {"args": [1000], "expected": 1, "hidden": true},
    {"args": [48], "expected": 12, "hidden": true}
  ]
}
--- description
`digit_sum(n)` is a recursive function that should return the sum of the digits of a whole number `n` (0 or more). For example, `digit_sum(123)` returns `6`.

It gives the wrong answers. There is **one** bug.
--- hints
- Trace `digit_sum(7)` by hand. What should it return, and what does it return?
- The base case is right to stop at a single digit, but a single digit's digit sum is the digit itself, not 0.
--- starter
def digit_sum(n):
    if n < 10:
        return 0
    return n % 10 + digit_sum(n // 10)
--- solution
def digit_sum(n):
    if n < 10:
        return n
    return n % 10 + digit_sum(n // 10)
