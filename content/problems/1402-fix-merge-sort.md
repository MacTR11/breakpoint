--- meta
{"title": "Fix: merge sort", "kind": "CODE", "style": "FIX", "difficulty": "HARD", "topic": "Sorting algorithm", "points": 40, "track": "debugging", "specRef": "2.3.1", "contest": "grand-final", "functionName": "merge_sort", "banned": ["sorted(", ".sort("],
  "tests": [
    {"args": [[3, 1, 2]], "expected": [1, 2, 3]},
    {"args": [[]], "expected": []},
    {"args": [[5]], "expected": [5]},
    {"args": [[2, 2, 1]], "expected": [1, 2, 2], "hidden": true},
    {"args": [[9, -1, 4, 0]], "expected": [-1, 0, 4, 9], "hidden": true},
    {"args": [[1, 2, 3, 4]], "expected": [1, 2, 3, 4], "hidden": true}
  ]
}
--- description
`merge_sort(items)` should return the list sorted into ascending order.

There are **two** bugs. One shows up as a `RecursionError` on a particular input; the other puts everything in the wrong order.

Fix the code in the editor so that every test passes.
--- hints
- The base case only catches a list of exactly one item. What happens when the list is empty?
- Look at the merge. When the front of `left` is smaller, which list should the next item be taken from?
--- starter
def merge_sort(items):
    if len(items) == 1:
        return items
    middle = len(items) // 2
    left = merge_sort(items[:middle])
    right = merge_sort(items[middle:])
    result = []
    while left and right:
        if left[0] < right[0]:
            result.append(right.pop(0))
        else:
            result.append(left.pop(0))
    return result + left + right
--- solution
def merge_sort(items):
    if len(items) <= 1:
        return items
    middle = len(items) // 2
    left = merge_sort(items[:middle])
    right = merge_sort(items[middle:])
    result = []
    while left and right:
        if left[0] <= right[0]:
            result.append(left.pop(0))
        else:
            result.append(right.pop(0))
    return result + left + right
