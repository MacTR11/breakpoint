--- meta
{
  "title": "Is it sorted?", "kind": "CODE", "difficulty": "EASY", "topic": "Lists", "points": 10, "track": "lists", "specRef": "2.2.1", "contest": "algorithms-showdown",
  "functionName": "is_sorted", "banned": ["sorted(", ".sort("],
  "tests": [
    { "args": [[1, 2, 3]], "expected": true },
    { "args": [[3, 1]], "expected": false },
    { "args": [[]], "expected": true },
    { "args": [[5]], "expected": true, "hidden": true },
    { "args": [[1, 1, 2]], "expected": true, "hidden": true },
    { "args": [[1, 3, 2, 4]], "expected": false, "hidden": true },
    { "args": [[2, 2, 1]], "expected": false, "hidden": true },
    { "args": [[-3, -2, -2, 0]], "expected": true, "hidden": true }
  ]
}
--- description
Binary search has a precondition: the list must already be in order. Before relying on it, a careful program checks.

Write a function `is_sorted(items)` that returns `True` if the list is in ascending order and `False` otherwise. Equal neighbours count as in order, and so does a list with fewer than two items.

Check it in a single pass. `sorted()` and `.sort()` are not allowed.

### Examples

| Call | Returns |
| --- | --- |
| `is_sorted([1, 2, 3])` | `True` |
| `is_sorted([3, 1])` | `False` |
| `is_sorted([])` | `True` |
--- hints
- Compare each item with the one after it.
- Return `False` the moment you find `items[i] > items[i + 1]`. Return `True` only after the loop has finished.
--- starter
def is_sorted(items):
    # Write your code here
    pass
--- solution
def is_sorted(items):
    for i in range(len(items) - 1):
        if items[i] > items[i + 1]:
            return False
    return True
