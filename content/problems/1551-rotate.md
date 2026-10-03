--- meta
{"title": "Rotate a list", "kind": "CODE", "difficulty": "EASY", "topic": "Lists", "points": 10, "track": "lists", "specRef": "2.2.1", "functionName": "rotate_right",
  "tests": [
    {"args": [[1, 2, 3, 4, 5], 2], "expected": [4, 5, 1, 2, 3]},
    {"args": [[1, 2, 3], 0], "expected": [1, 2, 3]},
    {"args": [[1, 2, 3], 3], "expected": [1, 2, 3]},
    {"args": [[1, 2, 3], 7], "expected": [3, 1, 2], "hidden": true},
    {"args": [[], 4], "expected": [], "hidden": true},
    {"args": [["a"], 5], "expected": ["a"], "hidden": true}
  ]
}
--- description
Write the function `rotate_right(items, k)`, which returns a new list with every item moved `k` places to the right. Items that fall off the end come back at the start.

For example, `rotate_right([1, 2, 3, 4, 5], 2)` returns `[4, 5, 1, 2, 3]`. `k` can be bigger than the length of the list, and an empty list stays empty.
--- hints
- Rotating a list of length n by n puts everything back where it started, so only `k % n` matters.
- With `k % n` worked out, the answer is the last `k` items followed by the rest: slices make that one line. Watch out for the empty list, where `n` is 0.
--- starter
def rotate_right(items, k):
    pass
--- solution
def rotate_right(items, k):
    if len(items) == 0:
        return []
    k = k % len(items)
    return items[len(items) - k:] + items[:len(items) - k]
