--- meta
{"title": "How many looks?", "kind": "CODE", "difficulty": "EASY", "topic": "Linear search", "points": 10, "track": "searching", "specRef": "2.3.1", "functionName": "comparisons",
  "tests": [
    {"args": [[5, 8, 2, 9], 2], "expected": 3},
    {"args": [[5, 8, 2, 9], 7], "expected": 4},
    {"args": [[], 1], "expected": 0},
    {"args": [[4], 4], "expected": 1, "hidden": true},
    {"args": [[1, 1, 1], 1], "expected": 1, "hidden": true},
    {"args": [[3, 6, 9, 12, 15], 15], "expected": 5, "hidden": true}
  ]
}
--- description
A linear search checks the items one at a time from the start, and stops as soon as it finds the target.

Write the function `comparisons(items, target)`, which returns how many items the search looks at before it stops: either because it found the target or because it reached the end of the list.

For example, `comparisons([5, 8, 2, 9], 2)` returns `3`, and `comparisons([5, 8, 2, 9], 7)` returns `4`.
--- hints
- Count every item you compare with the target, including the one that matches.
- Return the count as soon as you find a match. If the loop ends without a match, the count is the length of the list.
--- starter
def comparisons(items, target):
    pass
--- solution
def comparisons(items, target):
    looked = 0
    for item in items:
        looked = looked + 1
        if item == target:
            return looked
    return looked
