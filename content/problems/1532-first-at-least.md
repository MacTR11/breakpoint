--- meta
{"title": "First at least", "kind": "CODE", "difficulty": "HARD", "topic": "Binary search", "points": 50, "track": "searching", "specRef": "2.3.1", "functionName": "first_at_least", "banned": ["bisect", ".index(", "for "],
  "tests": [
    {"args": [[2, 4, 4, 7, 9], 4], "expected": 1},
    {"args": [[2, 4, 4, 7, 9], 5], "expected": 3},
    {"args": [[2, 4, 4, 7, 9], 1], "expected": 0},
    {"args": [[2, 4, 4, 7, 9], 10], "expected": 5, "hidden": true},
    {"args": [[], 3], "expected": 0, "hidden": true},
    {"args": [[5], 5], "expected": 0, "hidden": true},
    {"args": [[1, 2, 3, 4, 5, 6, 7, 8], 8], "expected": 7, "hidden": true},
    {"args": [[3, 3, 3, 3], 3], "expected": 0, "hidden": true}
  ]
}
--- description
`items` is a list of numbers in ascending order. Write the function `first_at_least(items, value)`, which uses a **binary search** to return the index of the first item that is greater than or equal to `value`. If every item is smaller, it returns `len(items)`.

For example, with `[2, 4, 4, 7, 9]`:

- `first_at_least(items, 4)` returns `1` (the first 4)
- `first_at_least(items, 5)` returns `3` (the 7)
- `first_at_least(items, 10)` returns `5`.

Do not use a `for` loop, `index` or the `bisect` module.
--- hints
- Keep `low = 0` and `high = len(items)`. The answer is always somewhere from `low` to `high`.
- While `low < high`: look at `mid = (low + high) // 2`. If `items[mid] < value` the answer is to the right, so `low = mid + 1`; otherwise `mid` might be the answer, so `high = mid`.
- When the loop ends, `low` and `high` are equal, and that is the answer.
--- starter
def first_at_least(items, value):
    pass
--- solution
def first_at_least(items, value):
    low = 0
    high = len(items)
    while low < high:
        mid = (low + high) // 2
        if items[mid] < value:
            low = mid + 1
        else:
            high = mid
    return low
