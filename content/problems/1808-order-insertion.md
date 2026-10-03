--- meta
{"title": "Put in order: insertion sort", "kind": "CODE", "style": "ORDER", "difficulty": "HARD", "topic": "Insertion sort", "points": 20, "track": "sorting", "specRef": "2.3.1", "functionName": "insertion_sort",
  "tests": [
    {"args": [[5, 2, 9, 1]], "expected": [1, 2, 5, 9]},
    {"args": [[]], "expected": []},
    {"args": [[7]], "expected": [7]},
    {"args": [[3, 3, 1]], "expected": [1, 3, 3], "hidden": true},
    {"args": [[9, 8, 7, 6]], "expected": [6, 7, 8, 9], "hidden": true}
  ]
}
--- description
The lines below make a working function, but they have been shuffled. Drag them into order (or use the arrow buttons) so that `insertion_sort(items)` sorts the list into ascending order with an insertion sort and returns it.

Each line already has its indentation, so you only need to get the order right.
--- hints
- The outer loop starts at index 1. The item there is stored in `current` before anything moves.
- Inside the `while`, larger items move one place right and `position` steps left. After the loop, `current` goes into the gap.
--- starter
            items[position] = items[position - 1]
def insertion_sort(items):
        current = items[i]
        while position > 0 and items[position - 1] > current:
        items[position] = current
    return items
            position = position - 1
        position = i
    for i in range(1, len(items)):
--- solution
def insertion_sort(items):
    for i in range(1, len(items)):
        current = items[i]
        position = i
        while position > 0 and items[position - 1] > current:
            items[position] = items[position - 1]
            position = position - 1
        items[position] = current
    return items
