--- meta
{
  "title": "Binary Search", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Searching", "points": 20, "track": "searching", "specRef": "2.3.1",
  "functionName": "binary_search", "banned": [".index(", ".find("],
  "tests": [
    { "args": [[1, 3, 5, 7, 9], 7], "expected": 3 },
    { "args": [[1, 3, 5, 7, 9], 4], "expected": -1 },
    { "args": [[], 1], "expected": -1 },
    { "args": [[2], 2], "expected": 0, "hidden": true },
    { "args": [[1, 3, 5, 7, 9, 11], 1], "expected": 0, "hidden": true },
    { "args": [[1, 3, 5, 7, 9, 11], 11], "expected": 5, "hidden": true },
    { "args": [[10, 20, 30, 40], 35], "expected": -1, "hidden": true },
    { "args": [[10, 20, 30, 40], 5], "expected": -1, "hidden": true },
    { "args": [["ant", "bee", "cat", "dog"], "cat"], "expected": 2, "hidden": true }
  ]
}
--- description
Binary search finds an item in a **sorted** list by repeatedly looking at the middle item and discarding the half that cannot contain the target.

Write a function `binary_search(items, target)` that returns the index of `target` in the sorted list `items`, or `-1` if it is not there. Every item in the list is different.

Keep track of `low` and `high` positions and narrow them down. `.index()` is not allowed.

### Examples

| Call | Returns |
| --- | --- |
| `binary_search([1, 3, 5, 7, 9], 7)` | `3` |
| `binary_search([1, 3, 5, 7, 9], 4)` | `-1` |
--- hints
- Keep two positions, `low = 0` and `high = len(items) - 1`, and loop `while low <= high`.
- Look at `mid = (low + high) // 2`. If that item is too small the target must be to the right: `low = mid + 1`. If it is too big: `high = mid - 1`.
--- starter
def binary_search(items, target):
    # Write your code here
    pass
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
