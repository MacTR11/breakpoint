--- meta
{"title": "Fix: The Mean", "kind": "CODE", "style": "FIX", "difficulty": "EASY", "topic": "Wrong operator", "points": 10, "track": "debugging", "specRef": "3.3", "functionName": "mean",
  "tests": [
    {"args": [[3, 4]], "expected": 3.5},
    {"args": [[2, 4]], "expected": 3.0},
    {"args": [[5]], "expected": 5.0},
    {"args": [[1, 2, 2]], "expected": 1.6666666667, "hidden": true},
    {"args": [[10, 0]], "expected": 5.0, "hidden": true},
    {"args": [[1, 2]], "expected": 1.5, "hidden": true}
  ]
}
--- description
`mean(numbers)` should return the mean average of a list that contains at least one number. The mean of 3 and 4 is 3.5.

It contains **one** bug.

Fix the code in the editor so that every test passes. Change as little as you need to.
--- hints
- The answer is right when the mean happens to be a whole number, and wrong when it is not.
- Python has two division operators. `//` throws away the fractional part; `/` keeps it.
--- starter
def mean(numbers):
    return sum(numbers) // len(numbers)
--- solution
def mean(numbers):
    return sum(numbers) / len(numbers)
