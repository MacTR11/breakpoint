--- meta
{"title": "Put in order: add up a list", "kind": "CODE", "style": "ORDER", "difficulty": "EASY", "topic": "Loops", "points": 5, "track": "basics", "specRef": "2.2.1", "functionName": "total",
  "tests": [
    {"args": [[1, 2, 3]], "expected": 6},
    {"args": [[]], "expected": 0},
    {"args": [[10]], "expected": 10},
    {"args": [[4, -4, 5]], "expected": 5, "hidden": true}
  ]
}
--- description
The lines below make a working function, but they have been shuffled. Drag them into order (or use the arrow buttons) so that `total(numbers)` returns the sum of the numbers.

Each line already has its indentation, so you only need to get the order right.
--- hints
- A function starts with its `def` line, and returns at the end.
- The running total must be set to 0 before the loop starts.
--- starter
    return answer
    answer = 0
        answer = answer + n
    for n in numbers:
def total(numbers):
--- solution
def total(numbers):
    answer = 0
    for n in numbers:
        answer = answer + n
    return answer
