--- meta
{"title": "Kth smallest", "kind": "CODE", "difficulty": "HARD", "topic": "Selection", "points": 50, "track": "sorting", "specRef": "2.3.1", "contest": "sort-it-out", "functionName": "kth_smallest", "banned": ["sorted(", ".sort("],
  "tests": [
    {"args": [[7, 2, 9, 4], 1], "expected": 2},
    {"args": [[7, 2, 9, 4], 3], "expected": 7},
    {"args": [[5], 1], "expected": 5},
    {"args": [[3, 3, 1], 2], "expected": 3, "hidden": true},
    {"args": [[10, -1, 4, 8, 0], 5], "expected": 10, "hidden": true},
    {"args": [[2, 1], 2], "expected": 2, "hidden": true},
    {"args": [[6, 5, 4, 3, 2, 1], 4], "expected": 4, "hidden": true}
  ]
}
--- description
Write a function `kth_smallest(items, k)` that returns the item that would be in position `k` if the list were sorted into ascending order, counting from 1.

So `k = 1` asks for the smallest item, and `k = len(items)` asks for the largest. `k` is always valid, and duplicates count separately.

`sorted()` and `.sort()` are not allowed.

### Examples

| Call | Returns | Why |
| --- | --- | --- |
| `kth_smallest([7, 2, 9, 4], 1)` | `2` | the smallest |
| `kth_smallest([7, 2, 9, 4], 3)` | `7` | sorted order is 2, 4, 7, 9 |
--- hints
- The plain approach: write any sort you know, then return the item at index `k - 1`.
- The clever approach uses quick sort's partition. Count the items smaller than the pivot: that tells you whether the answer is the pivot, or lies in the smaller part or the larger part, so you only recurse into one of them.
--- starter
def kth_smallest(items, k):
    # Write your code here
    pass
--- solution
def kth_smallest(items, k):
    pivot = items[0]
    smaller = [item for item in items[1:] if item < pivot]
    others = [item for item in items[1:] if item >= pivot]
    if k <= len(smaller):
        return kth_smallest(smaller, k)
    if k == len(smaller) + 1:
        return pivot
    return kth_smallest(others, k - len(smaller) - 1)
