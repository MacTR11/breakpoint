--- meta
{"title": "Digit sum", "kind": "CODE", "difficulty": "EASY", "topic": "Recursion", "points": 10, "track": "recursion", "specRef": "2.2.1", "contest": "recursion-rumble", "functionName": "sum_digits", "banned": ["while ", "for ", "str("],
  "tests": [
    {"args": [123], "expected": 6},
    {"args": [0], "expected": 0},
    {"args": [9], "expected": 9},
    {"args": [1000], "expected": 1, "hidden": true},
    {"args": [99999], "expected": 45, "hidden": true},
    {"args": [10], "expected": 1, "hidden": true},
    {"args": [4072], "expected": 13, "hidden": true}
  ]
}
--- description
Write a **recursive** function `sum_digits(n)` that returns the sum of the digits of the whole number `n`, which is 0 or more.

Loops and `str()` are not allowed.

### Examples

| Call | Returns |
| --- | --- |
| `sum_digits(123)` | `6` |
| `sum_digits(0)` | `0` |
--- hints
- `n % 10` is the last digit of `n`, and `n // 10` is everything except the last digit.
- Base case: a number below 10 is its own digit sum. Otherwise the answer is the last digit plus the digit sum of the rest.
--- starter
def sum_digits(n):
    # Write your code here
    pass
--- solution
def sum_digits(n):
    if n < 10:
        return n
    return n % 10 + sum_digits(n // 10)
