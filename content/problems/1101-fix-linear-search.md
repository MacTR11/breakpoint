--- meta
{"title": "Fix: linear search", "kind": "CODE", "style": "FIX", "difficulty": "EASY", "topic": "Search algorithm", "points": 10, "track": "debugging", "specRef": "2.3.1", "contest": "sort-it-out", "functionName": "linear_search", "banned": [".index("],
  "tests": [
    {"args": [[4, 8, 15], 15], "expected": 2},
    {"args": [[4, 8], 5], "expected": -1},
    {"args": [[], 1], "expected": -1},
    {"args": [[7], 7], "expected": 0, "hidden": true},
    {"args": [[1, 2, 3], 3], "expected": 2, "hidden": true},
    {"args": [[1, 2, 3], 1], "expected": 0, "hidden": true}
  ]
}
--- description
`linear_search(items, target)` should return the index of the first item equal to `target`, or `-1` if it is not in the list.

It gives up far too early.

Fix the code in the editor so that every test passes.
--- hints
- How many items does it check before returning `-1`?
- You can only be sure the target is missing once the loop has looked at **every** item. The `return -1` belongs after the loop.
--- starter
def linear_search(items, target):
    for i in range(len(items)):
        if items[i] == target:
            return i
        else:
            return -1
--- solution
def linear_search(items, target):
    for i in range(len(items)):
        if items[i] == target:
            return i
    return -1
