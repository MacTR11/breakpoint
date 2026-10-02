--- meta
{"title": "First and last", "kind": "CODE", "difficulty": "EASY", "topic": "Lists", "points": 5, "track": "warmup", "specRef": "2.2.1", "functionName": "ends",
  "tests": [
    {"args": [[4, 8, 15]], "expected": [4, 15]},
    {"args": [["a", "b"]], "expected": ["a", "b"]},
    {"args": [[7]], "expected": [7, 7]},
    {"args": [[1, 2, 3, 4, 5, 6]], "expected": [1, 6], "hidden": true},
    {"args": [["only"]], "expected": ["only", "only"], "hidden": true},
    {"args": [[0, 0]], "expected": [0, 0], "hidden": true}
  ]
}
--- description
`ends(items)` should return a list of two things: the first item and the last item of `items`. The list always has at least one item.

For example, `ends([4, 8, 15])` returns `[4, 15]`. For a list with one item, that item is both first and last, so `ends([7])` returns `[7, 7]`.
--- hints
- The first item is `items[0]`.
- The last item is `items[len(items) - 1]`. Python also lets you write `items[-1]`.
--- starter
def ends(items):
    return [items[0], items[1]]
--- solution
def ends(items):
    return [items[0], items[len(items) - 1]]
