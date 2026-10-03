--- meta
{"title": "Put in order: linear search", "kind": "CODE", "style": "ORDER", "difficulty": "MEDIUM", "topic": "Linear search", "points": 10, "track": "searching", "specRef": "2.3.1", "functionName": "linear_search",
  "tests": [
    {"args": [[4, 8, 15], 8], "expected": 1},
    {"args": [[4, 8, 15], 7], "expected": -1},
    {"args": [[], 1], "expected": -1},
    {"args": [[2, 2], 2], "expected": 0, "hidden": true},
    {"args": [[9, 7, 5], 5], "expected": 2, "hidden": true}
  ]
}
--- description
The lines below make a working function, but they have been shuffled, and there is a line that does not belong. Leave it out with ✕. Drag them into order (or use the arrow buttons) so that `linear_search(items, target)` returns the index of the first item equal to `target`, or `-1` if there is none.

Each line already has its indentation, so you only need to get the order right.
--- hints
- `return -1` must only happen after every item has been checked. Where does that put it?
- The spare line returns -1 too early, from inside the loop.
--- starter
    for i in range(len(items)):
    return -1
        return -1
            return i
        if items[i] == target:
def linear_search(items, target):
--- solution
def linear_search(items, target):
    for i in range(len(items)):
        if items[i] == target:
            return i
    return -1
