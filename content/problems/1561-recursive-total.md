--- meta
{"title": "Add it up, recursively", "kind": "CODE", "difficulty": "EASY", "topic": "Recursion", "points": 10, "track": "recursion", "specRef": "2.2.1", "functionName": "total", "banned": ["sum(", "for ", "while "],
  "tests": [
    {"args": [[3, 4, 5]], "expected": 12},
    {"args": [[]], "expected": 0},
    {"args": [[10]], "expected": 10},
    {"args": [[-2, 2, -2]], "expected": -2, "hidden": true},
    {"args": [[1, 1, 1, 1, 1, 1, 1, 1]], "expected": 8, "hidden": true}
  ]
}
--- description
Write a **recursive** function `total(numbers)` that returns the sum of a list of numbers. An empty list adds up to 0.

Do not use a loop or `sum`.
--- hints
- The base case is the empty list, which returns 0.
- Otherwise the total is the first number plus the total of the rest: `numbers[0] + total(numbers[1:])`.
--- starter
def total(numbers):
    pass
--- solution
def total(numbers):
    if len(numbers) == 0:
        return 0
    return numbers[0] + total(numbers[1:])
