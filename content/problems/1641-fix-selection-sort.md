--- meta
{"title": "Fix: the selection sort", "kind": "CODE", "style": "FIX", "difficulty": "MEDIUM", "topic": "Sorting bugs", "points": 20, "track": "debugging", "specRef": "2.3.1", "functionName": "selection_sort", "banned": ["sorted(", ".sort("],
  "tests": [
    {"args": [[5, 2, 9, 1]], "expected": [1, 2, 5, 9]},
    {"args": [[3, 1, 2]], "expected": [1, 2, 3]},
    {"args": [[]], "expected": []},
    {"args": [[2, 1]], "expected": [1, 2], "hidden": true},
    {"args": [[9, 8, 7, 6, 5]], "expected": [5, 6, 7, 8, 9], "hidden": true}
  ]
}
--- description
`selection_sort(items)` should sort a list into ascending order with a selection sort and return it.

The result is not sorted. There is **one** bug.
--- hints
- Trace `[3, 1, 2]`. Which item does the inner loop think is the smallest?
- The inner loop compares with `items[i]` every time, rather than with the smallest found so far, `items[smallest]`.
--- starter
def selection_sort(items):
    for i in range(len(items)):
        smallest = i
        for j in range(i + 1, len(items)):
            if items[j] < items[i]:
                smallest = j
        items[i], items[smallest] = items[smallest], items[i]
    return items
--- solution
def selection_sort(items):
    for i in range(len(items)):
        smallest = i
        for j in range(i + 1, len(items)):
            if items[j] < items[smallest]:
                smallest = j
        items[i], items[smallest] = items[smallest], items[i]
    return items
