--- meta
{
  "title": "Two sum",
  "kind": "CODE",
  "difficulty": "MEDIUM",
  "topic": "Lists",
  "points": 25,
  "track": "lists", "specRef": "2.3.1",
  "functionName": "two_sum",
  "tests": [
    { "args": [[2, 7, 11, 15], 9], "expected": [0, 1] },
    { "args": [[3, 2, 4], 6], "expected": [1, 2] },
    { "args": [[3, 3], 6], "expected": [0, 1] },
    { "args": [[1, 5, 3, 8], 11], "expected": [2, 3], "hidden": true },
    { "args": [[-1, -2, -3, -4, -5], -8], "expected": [2, 4], "hidden": true },
    { "args": [[0, 4, 3, 0], 0], "expected": [0, 3], "hidden": true },
    { "args": [[10, 20, 30, 40, 50], 90], "expected": [3, 4], "hidden": true }
  ]
}
--- description
Write a function `two_sum(numbers, target)` that finds the two **different positions** in `numbers` whose values add up to `target`.

Return the two indexes as a list `[i, j]` with the smaller index first.

Every test has exactly one valid answer, and you may not use the same position twice.

### Examples

| Call | Returns | Why |
| --- | --- | --- |
| `two_sum([2, 7, 11, 15], 9)` | `[0, 1]` | 2 + 7 = 9 |
| `two_sum([3, 2, 4], 6)` | `[1, 2]` | 2 + 4 = 6 |
| `two_sum([3, 3], 6)` | `[0, 1]` | 3 + 3 = 6 |

### Challenge

Two nested loops will work. Can you solve it with a single loop and a dictionary?
--- hints
- Two nested loops will find it: the outer loop picks position `i`, the inner loop tries every `j` after `i`.
- For a single loop, keep a dictionary of each value seen and its index. For each new value, check whether `target - value` is already in the dictionary.
--- starter
def two_sum(numbers, target):
    # Write your code here
    pass
--- solution
def two_sum(numbers, target):
    seen = {}
    for j, value in enumerate(numbers):
        if target - value in seen:
            return [seen[target - value], j]
        seen[value] = j
