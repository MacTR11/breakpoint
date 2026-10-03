--- meta
{"title": "Fix: running total", "kind": "CODE", "style": "FIX", "difficulty": "EASY", "topic": "Logic error", "points": 10, "track": "debugging", "specRef": "3.3", "functionName": "total", "banned": ["sum("],
  "tests": [
    {"args": [[1, 2, 3]], "expected": 6},
    {"args": [[5]], "expected": 5},
    {"args": [[]], "expected": 0},
    {"args": [[10, -10]], "expected": 0, "hidden": true},
    {"args": [[2, 2, 2, 2]], "expected": 8, "hidden": true}
  ]
}
--- description
`total(numbers)` should return the sum of all the numbers in a list, and `0` for an empty list.

One line is in the wrong place.

Fix the code in the editor so that every test passes. Change as little as you need to.
--- hints
- `total([1, 2, 3])` returns 3, which is only the last number. Why would the earlier ones be forgotten?
- Everything indented under the `for` happens again for every number, including setting `result` back to 0.
--- starter
def total(numbers):
    for number in numbers:
        result = 0
        result = result + number
    return result
--- solution
def total(numbers):
    result = 0
    for number in numbers:
        result = result + number
    return result
