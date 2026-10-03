--- meta
{"title": "Back to front", "kind": "CODE", "difficulty": "EASY", "topic": "Loops and arithmetic", "points": 10, "track": "basics", "specRef": "2.2.1", "functionName": "reverse_number", "banned": ["str(", "[::-1]", "reversed("],
  "tests": [
    {"args": [123], "expected": 321},
    {"args": [7], "expected": 7},
    {"args": [1200], "expected": 21},
    {"args": [0], "expected": 0, "hidden": true},
    {"args": [90817], "expected": 71809, "hidden": true}
  ]
}
--- description
Write the function `reverse_number(n)`, which returns the digits of the whole number `n` (0 or more) in reverse order, as a number. For example, `reverse_number(123)` returns `321`, and `reverse_number(1200)` returns `21`.

Use arithmetic: do not turn the number into a string.
--- hints
- `n % 10` is the last digit and `n // 10` is everything before it.
- Build the answer up: each time round, `result = result * 10 + n % 10`, then `n = n // 10`, until `n` is 0.
--- starter
def reverse_number(n):
    pass
--- solution
def reverse_number(n):
    result = 0
    while n > 0:
        result = result * 10 + n % 10
        n = n // 10
    return result
