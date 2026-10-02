--- meta
{"title": "Fix: Insertion Sort", "kind": "CODE", "style": "FIX", "difficulty": "HARD", "topic": "Sorting algorithm", "points": 40, "track": "debugging", "specRef": "2.3.1", "functionName": "insertion_sort", "banned": ["sorted(", ".sort("],
  "tests": [
    {"args": [[3, 1, 2]], "expected": [1, 2, 3]},
    {"args": [[1, 2, 3]], "expected": [1, 2, 3]},
    {"args": [[]], "expected": []},
    {"args": [[5, 4, 3, 2, 1]], "expected": [1, 2, 3, 4, 5], "hidden": true},
    {"args": [[2, 2, 1]], "expected": [1, 2, 2], "hidden": true},
    {"args": [[9]], "expected": [9], "hidden": true},
    {"args": [[4, -1, 0]], "expected": [-1, 0, 4], "hidden": true}
  ]
}
--- description
`insertion_sort(items)` should return the list sorted into ascending order.

Items are going missing and being duplicated. There are **two** bugs, both to do with the index `j`.

Fix the code in the editor so that every test passes. Change as little as you need to.
--- hints
- Trace `[3, 1, 2]` on paper. On the first pass `current` is 1 and `j` starts at 0. Does the `while` loop run at all? Should it?
- After the `while` loop, `j` is one place to the **left** of the gap that has been opened up. Where should `current` go?
--- starter
def insertion_sort(items):
    items = list(items)
    for i in range(1, len(items)):
        current = items[i]
        j = i - 1
        while j > 0 and items[j] > current:
            items[j + 1] = items[j]
            j = j - 1
        items[j] = current
    return items
--- solution
def insertion_sort(items):
    items = list(items)
    for i in range(1, len(items)):
        current = items[i]
        j = i - 1
        while j >= 0 and items[j] > current:
            items[j + 1] = items[j]
            j = j - 1
        items[j + 1] = current
    return items
