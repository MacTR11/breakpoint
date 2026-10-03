--- meta
{
  "title": "Find every match", "kind": "CODE", "difficulty": "EASY", "topic": "Searching", "points": 10, "track": "searching", "specRef": "2.3.1",
  "functionName": "find_all",
  "tests": [
    { "args": [[1, 2, 1, 3, 1], 1], "expected": [0, 2, 4] },
    { "args": [[5, 6], 7], "expected": [] },
    { "args": [[], 1], "expected": [] },
    { "args": [["a", "b", "a"], "a"], "expected": [0, 2], "hidden": true },
    { "args": [[4, 4, 4], 4], "expected": [0, 1, 2], "hidden": true },
    { "args": [[9], 9], "expected": [0], "hidden": true }
  ]
}
--- description
A linear search can do more than find the first match.

Write a function `find_all(items, target)` that returns a list of **every index** at which `target` appears in `items`, in ascending order. If it does not appear, return an empty list.

### Examples

| Call | Returns |
| --- | --- |
| `find_all([1, 2, 1, 3, 1], 1)` | `[0, 2, 4]` |
| `find_all([5, 6], 7)` | `[]` |
--- hints
- Loop over the positions with `for i in range(len(items))`.
- Unlike a normal linear search, do not stop at the first match. Append `i` to a results list and keep going to the end.
--- starter
def find_all(items, target):
    # Write your code here
    pass
--- solution
def find_all(items, target):
    positions = []
    for i in range(len(items)):
        if items[i] == target:
            positions.append(i)
    return positions
