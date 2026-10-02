--- meta
{
  "title": "Recursive Binary Search", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Searching", "points": 20, "track": "searching", "specRef": "2.3.1",
  "functionName": "find", "banned": ["while ", "for ", ".index("],
  "tests": [
    { "args": [[1, 3, 5, 7, 9], 7, 0, 4], "expected": 3 },
    { "args": [[1, 3, 5, 7, 9], 4, 0, 4], "expected": -1 },
    { "args": [[], 1, 0, -1], "expected": -1 },
    { "args": [[2], 2, 0, 0], "expected": 0, "hidden": true },
    { "args": [[1, 3, 5, 7, 9, 11], 1, 0, 5], "expected": 0, "hidden": true },
    { "args": [[1, 3, 5, 7, 9, 11], 11, 0, 5], "expected": 5, "hidden": true },
    { "args": [[10, 20, 30, 40], 35, 0, 3], "expected": -1, "hidden": true }
  ]
}
--- description
Binary search can be written with a loop or with recursion. This time, write it **recursively**: loops are not allowed.

Write a function `find(items, target, low, high)` that searches the sorted list `items` for `target`, looking only between positions `low` and `high` inclusive. Return the index of the target, or `-1` if it is not there.

It will first be called with `low` as 0 and `high` as the last index.

### Examples

| Call | Returns |
| --- | --- |
| `find([1, 3, 5, 7, 9], 7, 0, 4)` | `3` |
| `find([1, 3, 5, 7, 9], 4, 0, 4)` | `-1` |
| `find([], 1, 0, -1)` | `-1` |
--- hints
- There are two base cases: `low > high` means there is nothing left to search, so return `-1`; and the middle item being the target means return `mid`.
- Otherwise return the result of calling `find` again on one half: `find(items, target, mid + 1, high)` or `find(items, target, low, mid - 1)`.
--- starter
def find(items, target, low, high):
    # Write your code here
    pass
--- solution
def find(items, target, low, high):
    if low > high:
        return -1
    mid = (low + high) // 2
    if items[mid] == target:
        return mid
    if items[mid] < target:
        return find(items, target, mid + 1, high)
    return find(items, target, low, mid - 1)
