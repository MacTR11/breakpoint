--- meta
{"title": "Count down", "kind": "CODE", "difficulty": "EASY", "topic": "Recursion", "points": 10, "track": "recursion", "specRef": "2.2.1", "contest": "recursion-rumble", "functionName": "count_down", "banned": ["while ", "for ", "range("],
  "tests": [
    {"args": [3], "expected": [3, 2, 1, 0]},
    {"args": [0], "expected": [0]},
    {"args": [1], "expected": [1, 0]},
    {"args": [5], "expected": [5, 4, 3, 2, 1, 0], "hidden": true},
    {"args": [8], "expected": [8, 7, 6, 5, 4, 3, 2, 1, 0], "hidden": true}
  ]
}
--- description
Write a **recursive** function `count_down(n)` that returns a list of the whole numbers from `n` down to 0.

Loops and `range()` are not allowed.

### Examples

| Call | Returns |
| --- | --- |
| `count_down(3)` | `[3, 2, 1, 0]` |
| `count_down(0)` | `[0]` |
--- hints
- Base case: `count_down(0)` is `[0]`.
- `count_down(3)` is `[3]` followed by `count_down(2)`. Two lists can be joined with `+`.
--- starter
def count_down(n):
    # Write your code here
    pass
--- solution
def count_down(n):
    if n == 0:
        return [0]
    return [n] + count_down(n - 1)
