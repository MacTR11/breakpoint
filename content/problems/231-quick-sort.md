--- meta
{
  "title": "Write a quick sort", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Sorting", "points": 25, "track": "sorting", "specRef": "2.3.1",
  "functionName": "quick_sort", "banned": ["sorted(", ".sort("],
  "tests": [
    { "args": [[3, 1, 2]], "expected": [1, 2, 3] },
    { "args": [[]], "expected": [] },
    { "args": [[4, 4, 1]], "expected": [1, 4, 4] },
    { "args": [[5, 4, 3, 2, 1]], "expected": [1, 2, 3, 4, 5], "hidden": true },
    { "args": [[6, 3, 9, 1, 8, 2]], "expected": [1, 2, 3, 6, 8, 9], "hidden": true },
    { "args": [[7, 7, 7]], "expected": [7, 7, 7], "hidden": true },
    { "args": [[0, -4, 9, -4, 2]], "expected": [-4, -4, 0, 2, 9], "hidden": true },
    { "args": [[1]], "expected": [1], "hidden": true }
  ]
}
--- description
Quick sort is a **divide and conquer** algorithm:

1. A list of 0 or 1 items is already sorted.
2. Otherwise choose a **pivot** (use the first item).
3. Split the rest into the items smaller than the pivot and the items that are not.
4. Quick sort each of those two parts, then join them with the pivot in between.

Write a function `quick_sort(items)` that returns the items sorted into ascending order. `sorted()` and `.sort()` are not allowed.

Take care with duplicates: every item must still be there at the end.

### Examples

| Call | Returns |
| --- | --- |
| `quick_sort([3, 1, 2])` | `[1, 2, 3]` |
| `quick_sort([4, 4, 1])` | `[1, 4, 4]` |
--- hints
- Base case first: `if len(items) <= 1: return list(items)`.
- Build two lists from `items[1:]`: those `< pivot` and those `>= pivot`. Then `return quick_sort(smaller) + [pivot] + quick_sort(others)`.
--- starter
def quick_sort(items):
    # Write your code here
    pass
--- solution
def quick_sort(items):
    if len(items) <= 1:
        return list(items)
    pivot = items[0]
    smaller = []
    others = []
    for item in items[1:]:
        if item < pivot:
            smaller.append(item)
        else:
            others.append(item)
    return quick_sort(smaller) + [pivot] + quick_sort(others)
