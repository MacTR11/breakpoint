--- meta
{"contest": "upper-sixth-challenge", "title": "Fix: how deep is the list?", "kind": "CODE", "style": "FIX", "difficulty": "HARD", "topic": "Recursion", "points": 40, "track": "recursion", "specRef": "2.2.1", "functionName": "max_depth",
  "tests": [
    {"args": [[1, [2, [3]]]], "expected": 3},
    {"args": [[]], "expected": 1},
    {"args": [[[1, [2]], [3]]], "expected": 3},
    {"args": [[1, 2, 3]], "expected": 1, "hidden": true},
    {"args": [[[[[]]]]], "expected": 4, "hidden": true},
    {"args": [[[], [[], [[]]], []]], "expected": 4, "hidden": true}
  ]
}
--- description
  `max_depth(items)` should return how deeply lists are nested inside `items`. A list with no lists inside it has depth 1, and each level of list inside a list adds 1. So `[1, [2, [3]]]` has depth 3, and so does `[[1, [2]], [3]]`.

  There are **two** bugs.

Fix the code in the editor so that every test passes.
--- hints
- The function never counts the level it is looking at. Where should 1 be added?
- `[[1, [2]], [3]]` gives the wrong answer even then: each inner list replaces `deepest`, so a shallow list near the end wipes out a deep one before it. Keep the bigger of the two.
--- starter
def max_depth(items):
    deepest = 0
    for item in items:
        if isinstance(item, list):
            deepest = max_depth(item)
    return deepest
--- solution
def max_depth(items):
    deepest = 0
    for item in items:
        if isinstance(item, list):
            deepest = max(deepest, max_depth(item))
    return deepest + 1
