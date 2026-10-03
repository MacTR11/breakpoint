--- meta
{"title": "Fix: sum to N", "kind": "CODE", "style": "FIX", "difficulty": "EASY", "topic": "Off-by-one error", "points": 10, "track": "debugging", "specRef": "3.3", "functionName": "sum_to",
  "tests": [
    {"args": [5], "expected": 15},
    {"args": [1], "expected": 1},
    {"args": [0], "expected": 0},
    {"args": [10], "expected": 55, "hidden": true},
    {"args": [100], "expected": 5050, "hidden": true},
    {"args": [2], "expected": 3, "hidden": true}
  ]
}
--- description
`sum_to(n)` should return the total of all the whole numbers from 1 up to **and including** `n`. So `sum_to(5)` is 1 + 2 + 3 + 4 + 5 = 15.

It contains **one** bug.

Fix the code in the editor so that every test passes. Change as little as you need to.
--- hints
- Run the examples and compare what comes back with what was expected. `sum_to(5)` is short by exactly 5.
- `range(1, n)` stops **before** `n`. What should the second argument be?
--- starter
def sum_to(n):
    total = 0
    for i in range(1, n):
        total = total + i
    return total
--- solution
def sum_to(n):
    total = 0
    for i in range(1, n + 1):
        total = total + i
    return total
