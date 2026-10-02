--- meta
{"title": "Fix: Binary Search", "kind": "CODE", "style": "FIX", "difficulty": "MEDIUM", "topic": "Search algorithm", "points": 20, "track": "debugging", "specRef": "2.3.1", "functionName": "binary_search", "banned": [".index("],
  "tests": [
    {"args": [[1, 3, 5, 7, 9], 7], "expected": 3},
    {"args": [[1, 3, 5, 7, 9], 10], "expected": -1},
    {"args": [[], 1], "expected": -1},
    {"args": [[2], 2], "expected": 0, "hidden": true},
    {"args": [[1, 3, 5, 7, 9, 11], 11], "expected": 5, "hidden": true},
    {"args": [[10, 20, 30, 40], 5], "expected": -1, "hidden": true},
    {"args": [[10, 20, 30, 40], 25], "expected": -1, "hidden": true}
  ]
}
--- description
`binary_search(items, target)` should return the index of `target` in a sorted list, or `-1` if it is not there.

It finds some targets, but on others it either crashes or never finishes. There are **two** bugs.

Fix the code in the editor so that every test passes. Change as little as you need to.
--- hints
- One bug is in the starting value of `high`. What is the index of the last item in a list of 5 items?
- The other is in how `low` moves. If `items[mid]` is too small, `mid` itself has been ruled out, so the search should carry on from `mid + 1`. Leaving `low = mid` can get stuck for ever.
--- starter
def binary_search(items, target):
    low = 0
    high = len(items)
    while low <= high:
        mid = (low + high) // 2
        if items[mid] == target:
            return mid
        elif items[mid] < target:
            low = mid
        else:
            high = mid - 1
    return -1
--- solution
def binary_search(items, target):
    low = 0
    high = len(items) - 1
    while low <= high:
        mid = (low + high) // 2
        if items[mid] == target:
            return mid
        elif items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
