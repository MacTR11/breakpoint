--- meta
{"title": "How many times? Fast", "kind": "CODE", "difficulty": "HARD", "topic": "Binary search", "points": 50, "track": "searching", "specRef": "2.3.1", "functionName": "count_sorted", "banned": [".count(", "for "],
  "tests": [
    {"args": [[1, 2, 2, 2, 3, 5], 2], "expected": 3},
    {"args": [[1, 2, 2, 2, 3, 5], 4], "expected": 0},
    {"args": [[], 1], "expected": 0},
    {"args": [[7, 7, 7], 7], "expected": 3, "hidden": true},
    {"args": [[1, 3, 5, 7, 9], 9], "expected": 1, "hidden": true},
    {"args": [[1, 3, 5, 7, 9], 1], "expected": 1, "hidden": true},
    {"args": [[2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6], 4], "expected": 9, "hidden": true}
  ]
}
--- description
`items` is a list sorted into ascending order. Write the function `count_sorted(items, target)`, which returns how many times `target` appears, using **binary searches** rather than looking at every item.

For example, `count_sorted([1, 2, 2, 2, 3, 5], 2)` returns `3`.

Do not use a `for` loop or `count`.
--- hints
- All the copies of the target sit next to each other. Find where they start and where they end.
- One binary search finds the first index whose item is at least `target`; a second finds the first index whose item is greater than `target`. The count is the difference.
--- starter
def count_sorted(items, target):
    pass
--- solution
def first_index(items, value, strictly_greater):
    low = 0
    high = len(items)
    while low < high:
        mid = (low + high) // 2
        if items[mid] < value or (strictly_greater and items[mid] == value):
            low = mid + 1
        else:
            high = mid
    return low

def count_sorted(items, target):
    return first_index(items, target, True) - first_index(items, target, False)
