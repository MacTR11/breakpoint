--- meta
{"title": "Fix: the last one is missing", "kind": "CODE", "style": "FIX", "difficulty": "EASY", "topic": "Off-by-one errors", "points": 10, "track": "debugging", "specRef": "3.3", "functionName": "total",
  "tests": [
    {"args": [[4, 5, 6]], "expected": 15},
    {"args": [[10]], "expected": 10},
    {"args": [[]], "expected": 0},
    {"args": [[1, 2, 3, 4]], "expected": 10, "hidden": true}
  ]
}
--- description
`total(numbers)` should return the sum of a list of numbers.

The answer is always a bit too small. There is **one** bug.
--- hints
- Which item does the loop never reach? Try it with `[4, 5, 6]`.
- `range(len(numbers) - 1)` stops one too soon. It should be `range(len(numbers))`.
--- starter
def total(numbers):
    answer = 0
    for i in range(len(numbers) - 1):
        answer = answer + numbers[i]
    return answer
--- solution
def total(numbers):
    answer = 0
    for i in range(len(numbers)):
        answer = answer + numbers[i]
    return answer
