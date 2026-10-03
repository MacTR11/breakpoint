--- meta
{
  "title": "Linear search", "kind": "CODE", "difficulty": "EASY", "topic": "Searching", "points": 10, "track": "searching", "specRef": "2.3.1",
  "functionName": "linear_search", "banned": [".index(", ".find("],
  "tests": [
    { "args": [[4, 8, 15, 16], 15], "expected": 2 },
    { "args": [[4, 8], 5], "expected": -1 },
    { "args": [[], 1], "expected": -1 },
    { "args": [["a", "b", "a"], "a"], "expected": 0, "hidden": true },
    { "args": [[7], 7], "expected": 0, "hidden": true },
    { "args": [[1, 2, 3, 4, 5], 5], "expected": 4, "hidden": true },
    { "args": [[0, 0], 1], "expected": -1, "hidden": true }
  ]
}
--- description
A linear search checks each item in turn, from the start of the list, until it finds what it is looking for.

Write a function `linear_search(items, target)` that returns the **index** of the first item equal to `target`, or `-1` if the target is not in the list.

Write the search yourself: `.index()` is not allowed here.

### Examples

| Call | Returns |
| --- | --- |
| `linear_search([4, 8, 15, 16], 15)` | `2` |
| `linear_search([4, 8], 5)` | `-1` |
--- hints
- Loop over the positions with `for i in range(len(items))`, so that you know the index when you find the target.
- Return `i` as soon as `items[i] == target`. Only return `-1` **after** the loop has finished without finding it.
--- starter
def linear_search(items, target):
    # Write your code here
    pass
--- solution
def linear_search(items, target):
    for i in range(len(items)):
        if items[i] == target:
            return i
    return -1
