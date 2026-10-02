--- meta
{"title": "Fix: Bubble Sort", "kind": "CODE", "style": "FIX", "difficulty": "MEDIUM", "topic": "Sorting algorithm", "points": 20, "track": "debugging", "specRef": "2.3.1", "functionName": "bubble_sort", "banned": ["sorted(", ".sort("],
  "tests": [
    {"args": [[3, 1, 2]], "expected": [1, 2, 3]},
    {"args": [[1, 2, 3]], "expected": [1, 2, 3]},
    {"args": [[]], "expected": []},
    {"args": [[5, 4, 3, 2, 1]], "expected": [1, 2, 3, 4, 5], "hidden": true},
    {"args": [[2, 2, 1]], "expected": [1, 2, 2], "hidden": true},
    {"args": [[9]], "expected": [9], "hidden": true}
  ]
}
--- description
`bubble_sort(items)` should return the list sorted into ascending order.

There are **two** bugs: one makes it crash, and one makes the swap go wrong.

Fix the code in the editor so that every test passes. Change as little as you need to.
--- hints
- The crash: the loop compares `items[i]` with `items[i + 1]`. What happens when `i` is the last index?
- The swap: after `items[i] = items[i + 1]` the original value of `items[i]` has been overwritten, so both positions now hold the same thing. Use a temporary variable, or `items[i], items[i + 1] = items[i + 1], items[i]`.
--- starter
def bubble_sort(items):
    items = list(items)
    swapped = True
    while swapped:
        swapped = False
        for i in range(len(items)):
            if items[i] > items[i + 1]:
                items[i] = items[i + 1]
                items[i + 1] = items[i]
                swapped = True
    return items
--- solution
def bubble_sort(items):
    items = list(items)
    swapped = True
    while swapped:
        swapped = False
        for i in range(len(items) - 1):
            if items[i] > items[i + 1]:
                items[i], items[i + 1] = items[i + 1], items[i]
                swapped = True
    return items
