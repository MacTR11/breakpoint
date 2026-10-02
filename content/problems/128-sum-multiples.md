--- meta
{"title": "Multiples of 3 or 5", "kind": "CODE", "difficulty": "EASY", "topic": "Loops", "points": 10, "track": "basics", "specRef": "2.2.1", "functionName": "sum_multiples",
  "tests": [
    {"args": [10], "expected": 23},
    {"args": [16], "expected": 60},
    {"args": [3], "expected": 0},
    {"args": [1], "expected": 0, "hidden": true},
    {"args": [6], "expected": 8, "hidden": true},
    {"args": [100], "expected": 2318, "hidden": true},
    {"args": [4], "expected": 3, "hidden": true}
  ]
}
--- description
Write a function `sum_multiples(limit)` that returns the sum of every whole number **below** `limit` that is a multiple of 3 or of 5.

A number that is a multiple of both, such as 15, is only counted once.

### Examples

| Call | Returns | Why |
| --- | --- | --- |
| `sum_multiples(10)` | `23` | 3 + 5 + 6 + 9 |
| `sum_multiples(3)` | `0` | nothing below 3 qualifies |
--- hints
- `range(limit)` produces every whole number below `limit`.
- Use one `if` with `or`: `number % 3 == 0 or number % 5 == 0`. That way 15 is added once, not twice.
--- starter
def sum_multiples(limit):
    # Write your code here
    pass
--- solution
def sum_multiples(limit):
    total = 0
    for number in range(limit):
        if number % 3 == 0 or number % 5 == 0:
            total += number
    return total
