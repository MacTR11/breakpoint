--- meta
{"title": "The nearest value", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Binary search", "points": 25, "track": "searching", "specRef": "2.3.1", "functionName": "closest",
  "tests": [
    {"args": [[1, 4, 9, 16, 25], 10], "expected": 9},
    {"args": [[1, 4, 9, 16, 25], 13], "expected": 16},
    {"args": [[5], 100], "expected": 5},
    {"args": [[2, 8], 5], "expected": 2, "hidden": true},
    {"args": [[1, 4, 9, 16, 25], -3], "expected": 1, "hidden": true},
    {"args": [[1, 4, 9, 16, 25], 30], "expected": 25, "hidden": true},
    {"args": [[10, 20, 30], 25], "expected": 20, "hidden": true}
  ]
}
--- description
`items` is a non-empty list of numbers in ascending order. Write the function `closest(items, target)`, which returns the item nearest to `target`. If two items are equally near, it returns the smaller one.

For example, `closest([1, 4, 9, 16, 25], 10)` returns `9`, and `closest([2, 8], 5)` returns `2`.

A binary search is the efficient way; a linear search also passes the tests.
--- hints
- Find the position of the first item that is at least `target`. The answer is either that item or the one just before it.
- Watch the two ends: there may be no item before, or no item at or after.
--- starter
def closest(items, target):
    pass
--- solution
def closest(items, target):
    low = 0
    high = len(items)
    while low < high:
        mid = (low + high) // 2
        if items[mid] < target:
            low = mid + 1
        else:
            high = mid
    if low == 0:
        return items[0]
    if low == len(items):
        return items[-1]
    before = items[low - 1]
    after = items[low]
    return before if target - before <= after - target else after
