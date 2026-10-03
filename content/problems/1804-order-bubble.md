--- meta
{"title": "Put in order: bubble sort", "kind": "CODE", "style": "ORDER", "difficulty": "MEDIUM", "topic": "Bubble sort", "points": 10, "track": "sorting", "specRef": "2.3.1", "functionName": "bubble_sort",
  "tests": [
    {"args": [[5, 1, 4, 2]], "expected": [1, 2, 4, 5]},
    {"args": [[]], "expected": []},
    {"args": [[1]], "expected": [1]},
    {"args": [[3, 2, 1]], "expected": [1, 2, 3], "hidden": true},
    {"args": [[2, 2, 1]], "expected": [1, 2, 2], "hidden": true}
  ]
}
--- description
The lines below make a working function, but they have been shuffled. Drag them into order (or use the arrow buttons) so that `bubble_sort(items)` sorts the list into ascending order with a bubble sort and returns it.

Each line already has its indentation, so you only need to get the order right.
--- hints
- There are two loops: an outer one for the passes, and an inner one that compares neighbours.
- The swap happens only when the pair is the wrong way round, so it goes inside the `if`.
--- starter
                items[i], items[i + 1] = items[i + 1], items[i]
        for i in range(len(items) - 1 - p):
    for p in range(len(items) - 1):
            if items[i] > items[i + 1]:
    return items
def bubble_sort(items):
--- solution
def bubble_sort(items):
    for p in range(len(items) - 1):
        for i in range(len(items) - 1 - p):
            if items[i] > items[i + 1]:
                items[i], items[i + 1] = items[i + 1], items[i]
    return items
