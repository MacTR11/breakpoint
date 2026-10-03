--- meta
{"title": "Write a selection sort", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Selection sort", "points": 25, "track": "sorting", "specRef": "2.3.1", "functionName": "selection_sort", "banned": ["sorted(", ".sort(", "min(", "max("],
  "tests": [
    {"args": [[5, 2, 9, 1]], "expected": [1, 2, 5, 9]},
    {"args": [[]], "expected": []},
    {"args": [[3]], "expected": [3]},
    {"args": [[4, 4, 1, 1]], "expected": [1, 1, 4, 4], "hidden": true},
    {"args": [[9, 8, 7, 6, 5, 4]], "expected": [4, 5, 6, 7, 8, 9], "hidden": true},
    {"args": [[1, 2, 3]], "expected": [1, 2, 3], "hidden": true},
    {"args": [[0, -3, 8, -3]], "expected": [-3, -3, 0, 8], "hidden": true}
  ]
}
--- description
A selection sort finds the smallest item and swaps it to the front, then the smallest of the rest and swaps it into second place, and so on.

Write the function `selection_sort(items)`, which sorts the list into ascending order this way and returns it.

Write it yourself: do not use `sorted`, `sort`, `min` or `max`.
--- hints
- For each position `i` from the start, find the index of the smallest item from `i` to the end with an inner loop.
- Swap that item with the one at `i`. After the pass for `i`, everything up to `i` is in its final place.
--- starter
def selection_sort(items):
    pass
--- solution
def selection_sort(items):
    for i in range(len(items)):
        smallest = i
        for j in range(i + 1, len(items)):
            if items[j] < items[smallest]:
                smallest = j
        items[i], items[smallest] = items[smallest], items[i]
    return items
