--- meta
{"contest": "lower-sixth-league", "title": "Count between", "kind": "CODE", "difficulty": "EASY", "topic": "Lists", "points": 10, "track": "lists", "specRef": "2.2.1", "functionName": "count_between",
  "tests": [
    {"args": [[3, 8, 12, 5, 20], 5, 12], "expected": 3},
    {"args": [[1, 2, 3], 4, 9], "expected": 0},
    {"args": [[], 0, 10], "expected": 0},
    {"args": [[5, 5, 5], 5, 5], "expected": 3, "hidden": true},
    {"args": [[-3, 0, 3], -3, 0], "expected": 2, "hidden": true},
    {"args": [[10, 1, 7, 4], 1, 4], "expected": 2, "hidden": true}
  ]
}
--- description
A teacher wants to know how many marks fall inside a grade boundary.

Write `count_between(numbers, low, high)`, which returns how many of the numbers are at least `low` and at most `high`. Numbers equal to `low` or `high` count.

For example `count_between([3, 8, 12, 5, 20], 5, 12)` is `3`: 8, 12 and 5.
--- hints
- Keep a count that starts at 0 and goes up by 1 for each number in range.
- Python lets you write `low <= n <= high` in one go.
--- starter
def count_between(numbers, low, high):
    # Write your code here
    pass
--- solution
def count_between(numbers, low, high):
    count = 0
    for n in numbers:
        if low <= n <= high:
            count = count + 1
    return count
