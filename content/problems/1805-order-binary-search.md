--- meta
{"title": "Put in order: binary search", "kind": "CODE", "style": "ORDER", "difficulty": "HARD", "topic": "Binary search", "points": 20, "track": "searching", "specRef": "2.3.1", "functionName": "binary_search",
  "tests": [
    {"args": [[2, 5, 8, 12, 16, 23], 12], "expected": 3},
    {"args": [[2, 5, 8, 12, 16, 23], 7], "expected": -1},
    {"args": [[], 3], "expected": -1},
    {"args": [[4], 4], "expected": 0, "hidden": true},
    {"args": [[1, 3, 5, 7, 9, 11, 13], 1], "expected": 0, "hidden": true},
    {"args": [[1, 3, 5, 7, 9, 11, 13], 13], "expected": 6, "hidden": true}
  ]
}
--- description
The lines below make a working function, but they have been shuffled, and there is a line that does not belong. Leave it out with ✕. Drag them into order (or use the arrow buttons) so that `binary_search(items, target)` returns the index of `target` in the sorted list `items`, or `-1` if it is not there.

Each line already has its indentation, so you only need to get the order right.
--- hints
- Set up `low` and `high` before the loop, and work out `mid` first thing inside it.
- If the middle item is too small, the target is to its right, so `low` moves up past `mid`. The spare line moves the wrong end.
--- starter
        if items[mid] == target:
    low = 0
    return -1
def binary_search(items, target):
            return mid
        elif items[mid] < target:
    high = len(items) - 1
        else:
    while low <= high:
            low = mid + 1
            high = mid - 1
            high = mid + 1
        mid = (low + high) // 2
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
