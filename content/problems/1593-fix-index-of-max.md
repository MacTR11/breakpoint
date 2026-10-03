--- meta
{"title": "Fix: where is the biggest?", "kind": "CODE", "style": "FIX", "difficulty": "MEDIUM", "topic": "Logic errors", "points": 20, "track": "debugging", "specRef": "3.3", "functionName": "index_of_max",
  "tests": [
    {"args": [[3, 9, 4]], "expected": 1},
    {"args": [[2, 7, 7, 1]], "expected": 1},
    {"args": [[-5, -2, -9]], "expected": 1},
    {"args": [[1]], "expected": 0, "hidden": true},
    {"args": [[0, 10, 20, 30]], "expected": 3, "hidden": true}
  ]
}
--- description
`index_of_max(numbers)` should return the index of the largest number in a list with at least one number. If the largest appears more than once, it returns the first.

It returns the wrong index. There is **one** bug.
--- hints
- `best` holds an index, not a number. What is the code comparing it with?
- Compare the numbers at the two indexes: `numbers[i] > numbers[best]`.
--- starter
def index_of_max(numbers):
    best = 0
    for i in range(1, len(numbers)):
        if numbers[i] > best:
            best = i
    return best
--- solution
def index_of_max(numbers):
    best = 0
    for i in range(1, len(numbers)):
        if numbers[i] > numbers[best]:
            best = i
    return best
