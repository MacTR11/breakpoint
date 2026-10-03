--- meta
{"title": "Fix: reverse a list", "kind": "CODE", "style": "FIX", "difficulty": "MEDIUM", "topic": "Off-by-one error", "points": 20, "track": "debugging", "specRef": "3.3", "contest": "bug-hunt", "functionName": "reverse", "banned": [".reverse(", "reversed(", "[::-1]"],
  "tests": [
    {"args": [[1, 2, 3]], "expected": [3, 2, 1]},
    {"args": [[7]], "expected": [7]},
    {"args": [[]], "expected": []},
    {"args": [["a", "b"]], "expected": ["b", "a"], "hidden": true},
    {"args": [[1, 1, 2]], "expected": [2, 1, 1], "hidden": true}
  ]
}
--- description
`reverse(items)` should return a new list with the items in the opposite order.

One item keeps going missing. Fix the loop: `.reverse()`, `reversed()` and `[::-1]` are not allowed.

Fix the code in the editor so that every test passes.
--- hints
- Which item is missing from the result of `reverse([1, 2, 3])`? What is its index?
- `range(start, stop, step)` stops **before** `stop`. To include index 0 when counting down, the stop value has to be −1.
--- starter
def reverse(items):
    result = []
    for i in range(len(items) - 1, 0, -1):
        result.append(items[i])
    return result
--- solution
def reverse(items):
    result = []
    for i in range(len(items) - 1, -1, -1):
        result.append(items[i])
    return result
