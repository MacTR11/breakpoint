--- meta
{"title": "Fix: the last item", "kind": "CODE", "style": "FIX", "difficulty": "EASY", "topic": "Index errors", "points": 10, "track": "debugging", "specRef": "3.3", "functionName": "last_item",
  "tests": [
    {"args": [[4, 8, 15]], "expected": 15},
    {"args": [["a", "b"]], "expected": "b"},
    {"args": [[7]], "expected": 7},
    {"args": [[1, 2, 3, 4, 5, 6]], "expected": 6, "hidden": true}
  ]
}
--- description
`last_item(items)` should return the last item of a list that has at least one item.

It crashes. There is **one** bug.
--- hints
- A list of 3 items has indexes 0, 1 and 2. What index does the code ask for?
- The last index is `len(items) - 1`.
--- starter
def last_item(items):
    return items[len(items)]
--- solution
def last_item(items):
    return items[len(items) - 1]
