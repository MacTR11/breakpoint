--- meta
{"title": "Fix: Quick Sort", "kind": "CODE", "style": "FIX", "difficulty": "HARD", "topic": "Sorting algorithm", "points": 40, "track": "debugging", "specRef": "2.3.1", "contest": "sort-it-out", "functionName": "quick_sort", "banned": ["sorted(", ".sort("],
  "tests": [
    {"args": [[3, 1, 2]], "expected": [1, 2, 3]},
    {"args": [[4, 4, 1]], "expected": [1, 4, 4]},
    {"args": [[]], "expected": []},
    {"args": [[7, 7, 7]], "expected": [7, 7, 7], "hidden": true},
    {"args": [[5, 3, 5, 1, 3]], "expected": [1, 3, 3, 5, 5], "hidden": true},
    {"args": [[2, 1]], "expected": [1, 2], "hidden": true}
  ]
}
--- description
`quick_sort(items)` should return the list sorted into ascending order.

It sorts correctly, but the result is sometimes **shorter** than the list it was given.

Fix the code in the editor so that every test passes.
--- hints
- Compare the two examples. Which kind of list loses items?
- An item equal to the pivot is neither `< pivot` nor `> pivot`, so it is put in neither list. Leave the pivot itself out with `items[1:]`, and let one side take `>=`.
--- starter
def quick_sort(items):
    if len(items) == 0:
        return []
    pivot = items[0]
    smaller = [item for item in items if item < pivot]
    larger = [item for item in items if item > pivot]
    return quick_sort(smaller) + [pivot] + quick_sort(larger)
--- solution
def quick_sort(items):
    if len(items) == 0:
        return []
    pivot = items[0]
    smaller = [item for item in items[1:] if item < pivot]
    larger = [item for item in items[1:] if item >= pivot]
    return quick_sort(smaller) + [pivot] + quick_sort(larger)
