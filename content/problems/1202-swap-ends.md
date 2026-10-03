--- meta
{"title": "Swap the ends", "kind": "CODE", "difficulty": "EASY", "topic": "Lists", "points": 10, "track": "lists", "specRef": "2.2.1", "contest": "python-sprint", "functionName": "swap_ends",
  "tests": [
    {"args": [[1, 2, 3, 4]], "expected": [4, 2, 3, 1]},
    {"args": [[5]], "expected": [5]},
    {"args": [[]], "expected": []},
    {"args": [["a", "b"]], "expected": ["b", "a"], "hidden": true},
    {"args": [[1, 2, 3]], "expected": [3, 2, 1], "hidden": true},
    {"args": [[9, 9]], "expected": [9, 9], "hidden": true}
  ]
}
--- description
Write a function `swap_ends(items)` that returns the list with its **first and last** items swapped. Everything in between stays where it is.

A list with fewer than two items is returned unchanged.

### Examples

| Call | Returns |
| --- | --- |
| `swap_ends([1, 2, 3, 4])` | `[4, 2, 3, 1]` |
| `swap_ends([5])` | `[5]` |
--- hints
- `items[-1]` is the last item of a list.
- Deal with lists shorter than 2 first. Otherwise copy the list and swap positions `0` and `-1`.
--- starter
def swap_ends(items):
    # Write your code here
    pass
--- solution
def swap_ends(items):
    result = list(items)
    if len(result) >= 2:
        result[0], result[-1] = result[-1], result[0]
    return result
