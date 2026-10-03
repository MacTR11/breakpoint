--- meta
{"title": "Longest run", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Lists", "points": 25, "track": "lists", "specRef": "2.2.1", "contest": "grand-final", "functionName": "longest_run",
  "tests": [
    {"args": [[1, 1, 2, 2, 2, 3]], "expected": 3},
    {"args": [[5]], "expected": 1},
    {"args": [[]], "expected": 0},
    {"args": [[1, 2, 3]], "expected": 1, "hidden": true},
    {"args": [[7, 7, 7, 7]], "expected": 4, "hidden": true},
    {"args": [["a", "a", "b", "a", "a", "a"]], "expected": 3, "hidden": true},
    {"args": [[0, 0, 1, 0, 0]], "expected": 2, "hidden": true}
  ]
}
--- description
Write a function `longest_run(items)` that returns the length of the longest stretch of **equal neighbouring** items in a list.

### Examples

| Call | Returns | Why |
| --- | --- | --- |
| `longest_run([1, 1, 2, 2, 2, 3])` | `3` | the three 2s |
| `longest_run([5])` | `1` | |
| `longest_run([])` | `0` | |
--- hints
- Keep two counters: the length of the current run and the best seen so far.
- Compare each item with the one before it. If they match, the current run grows; if not, it starts again at 1. Update the best after every item.
--- starter
def longest_run(items):
    # Write your code here
    pass
--- solution
def longest_run(items):
    best = 0
    current = 0
    for i in range(len(items)):
        if i > 0 and items[i] == items[i - 1]:
            current += 1
        else:
            current = 1
        if current > best:
            best = current
    return best
