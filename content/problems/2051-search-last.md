--- meta
{"title": "Searching (a): find the last match", "kind": "CODE", "difficulty": "EASY", "topic": "Linear search", "points": 10, "track": "exam", "specRef": "2.3.1", "functionName": "last_position", "banned": [".index(", ".rindex(", "reversed(", "[::-1]"],
  "tests": [
    {"args": [[4, 7, 4, 9], 4], "expected": 2},
    {"args": [[4, 7, 4, 9], 5], "expected": -1},
    {"args": [["a"], "a"], "expected": 0},
    {"args": [[], 1], "expected": -1, "hidden": true},
    {"args": [[1, 1, 1, 1, 1], 1], "expected": 4, "hidden": true},
    {"args": [[3, 8, 2, 8, 8, 1], 8], "expected": 4, "hidden": true},
    {"args": [[5, 6, 7], 5], "expected": 0, "hidden": true}
  ]
}
--- description
A linear search usually stops at the first match. A program needs the position of the **last** match instead.

Write the function `last_position(items, target)`, which returns the index of the last element of the list `items` that is equal to `target`. If the target is not in the list it returns `-1`.

Write the search yourself: do not use `index`, or reverse the list.

For example, `last_position([4, 7, 4, 9], 4)` returns `2`.

**[4 marks]**
--- hints
- Keep a variable for the best position found so far, starting at -1.
- Loop through every index. Each time the item matches, overwrite the variable with that index. Do not stop early: a later match should replace an earlier one.
--- starter
def last_position(items, target):
    pass
--- solution
def last_position(items, target):
    position = -1
    for index in range(len(items)):
        if items[index] == target:
            position = index
    return position
--- explanation
One mark each, up to 4:

- A result variable initialised to `-1`.
- A loop that visits every index (or searches from the end backwards).
- Each element is compared with the target, and the index recorded on a match.
- Returns the last matching index, or `-1` when there was no match.
