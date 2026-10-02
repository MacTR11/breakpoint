--- meta
{"title": "Add them up", "kind": "CODE", "difficulty": "EASY", "topic": "Loops", "points": 5, "track": "warmup", "specRef": "2.2.1", "functionName": "total", "banned": ["sum("],
  "tests": [
    {"args": [[1, 2, 3]], "expected": 6},
    {"args": [[10]], "expected": 10},
    {"args": [[]], "expected": 0},
    {"args": [[5, 5, 5, 5]], "expected": 20, "hidden": true},
    {"args": [[-2, 2]], "expected": 0, "hidden": true},
    {"args": [[0.5, 1.5]], "expected": 2.0, "hidden": true}
  ]
}
--- description
`total(numbers)` should return all the numbers in the list added together. An empty list adds up to `0`.

Write the loop yourself rather than using `sum`.

For example, `total([1, 2, 3])` returns `6`.
--- hints
- Start with `answer = 0`. Then `for number in numbers:` visits each number in turn.
- Inside the loop, add the number on: `answer = answer + number`. Return `answer` after the loop, not inside it.
--- starter
def total(numbers):
    answer = 0
    for number in numbers:
        pass
    return answer
--- solution
def total(numbers):
    answer = 0
    for number in numbers:
        answer = answer + number
    return answer
