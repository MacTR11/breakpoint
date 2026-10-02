--- meta
{"title": "Recursion (b): count the matches", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Recursion", "points": 20, "track": "exam", "specRef": "2.2.1", "functionName": "count_matches", "banned": ["for ", "while ", ".count("],
  "tests": [
    {"args": [[3, 1, 3, 3], 3], "expected": 3},
    {"args": [["a", "b"], "z"], "expected": 0},
    {"args": [[], 5], "expected": 0},
    {"args": [[7], 7], "expected": 1, "hidden": true},
    {"args": [[2, 2, 2, 2, 2, 2], 2], "expected": 6, "hidden": true},
    {"args": [[1, 2, 3, 4, 5, 4, 3, 2, 1], 4], "expected": 2, "hidden": true}
  ]
}
--- description
Write a **recursive** function `count_matches(items, target)` that returns how many times `target` appears in the list `items`.

Do not use a loop or the `count` method.

For example, `count_matches([3, 1, 3, 3], 3)` returns `3`.

**[5 marks]**
--- hints
- An empty list contains the target 0 times. That is the base case.
- Otherwise look at the first item only, then let the function deal with the rest of the list, which is `items[1:]`.
- The answer is (1 if the first item matches, otherwise 0) plus `count_matches(items[1:], target)`.
--- starter
def count_matches(items, target):
    pass
--- solution
def count_matches(items, target):
    if len(items) == 0:
        return 0
    if items[0] == target:
        return 1 + count_matches(items[1:], target)
    return count_matches(items[1:], target)
--- explanation
One mark each, up to 5:

- A base case for the empty list.
- The base case returns 0.
- Compares one item (the first or the last) with the target.
- Calls itself with a list that is one item shorter.
- Adds 1 to the returned count when the item matched, and returns the total in every case.
