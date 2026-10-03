--- meta
{"title": "Fix: largest number", "kind": "CODE", "style": "FIX", "difficulty": "EASY", "topic": "Initialisation error", "points": 10, "track": "debugging", "specRef": "3.3", "functionName": "largest", "banned": ["max("],
  "tests": [
    {"args": [[3, 9, 4]], "expected": 9},
    {"args": [[-3, -7, -1]], "expected": -1},
    {"args": [[5]], "expected": 5},
    {"args": [[-10]], "expected": -10, "hidden": true},
    {"args": [[0, -1]], "expected": 0, "hidden": true},
    {"args": [[2, 2]], "expected": 2, "hidden": true}
  ]
}
--- description
`largest(numbers)` should return the biggest number in a list that contains at least one number.

It works for some lists but not others. Fix the loop: `max()` is not allowed.

Fix the code in the editor so that every test passes. Change as little as you need to.
--- hints
- Which example fails? What do all its numbers have in common?
- `biggest` starts at 0, so no negative number can ever beat it. What would be a safer starting value?
--- starter
def largest(numbers):
    biggest = 0
    for number in numbers:
        if number > biggest:
            biggest = number
    return biggest
--- solution
def largest(numbers):
    biggest = numbers[0]
    for number in numbers:
        if number > biggest:
            biggest = number
    return biggest
