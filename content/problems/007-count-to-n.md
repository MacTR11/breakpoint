--- meta
{"title": "Count to n", "kind": "CODE", "style": "FIX", "difficulty": "EASY", "topic": "Loops", "points": 5, "track": "warmup", "specRef": "2.2.1", "functionName": "count_to",
  "tests": [
    {"args": [3], "expected": [1, 2, 3]},
    {"args": [1], "expected": [1]},
    {"args": [5], "expected": [1, 2, 3, 4, 5]},
    {"args": [0], "expected": [], "hidden": true},
    {"args": [10], "expected": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "hidden": true},
    {"args": [2], "expected": [1, 2], "hidden": true}
  ]
}
--- description
`count_to(n)` should return a list of the whole numbers from 1 up to `n`.

For example, `count_to(3)` returns `[1, 2, 3]`, and `count_to(0)` returns an empty list.

The loop is already written, but it stops one number too early. Fix it.
--- hints
- `range(1, n)` gives 1, 2, ... up to but **not including** `n`.
- To include `n`, the range has to stop one later: `range(1, n + 1)`.
--- starter
def count_to(n):
    numbers = []
    for i in range(1, n):
        numbers.append(i)
    return numbers
--- solution
def count_to(n):
    numbers = []
    for i in range(1, n + 1):
        numbers.append(i)
    return numbers
