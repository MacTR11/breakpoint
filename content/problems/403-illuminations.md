--- meta
{
  "title": "Brightest Stretch",
  "kind": "CODE",
  "difficulty": "MEDIUM",
  "topic": "Lists",
  "points": 20,
  "track": "lists", "specRef": "2.2.1",
  "contest": "welcome",
  "functionName": "brightest_stretch",
  "tests": [
    { "args": [[1, 3, 2, 5, 4], 2], "expected": 9 },
    { "args": [[4, 4, 4], 1], "expected": 4 },
    { "args": [[5, 1, 1, 1, 9], 3], "expected": 11 },
    { "args": [[7], 1], "expected": 7, "hidden": true },
    { "args": [[1, 2, 3, 4], 4], "expected": 10, "hidden": true },
    { "args": [[-1, -2, -3], 2], "expected": -3, "hidden": true },
    { "args": [[0, 0, 5, 0, 0, 6], 2], "expected": 6, "hidden": true },
    { "args": [[2, 9, 1, 8, 3, 7], 3], "expected": 18, "hidden": true }
  ]
}
--- description
The seafront illuminations are a long row of displays. Each display has a brightness score, given in the list `lights` in order along the promenade.

A photographer wants to capture `k` displays that are **next to each other** in one shot, with the highest possible total brightness.

Write a function `brightest_stretch(lights, k)` that returns the largest total brightness of any `k` neighbouring displays.

`k` is always at least 1 and never more than the number of displays.

### Examples

| Call | Returns | Why |
| --- | --- | --- |
| `brightest_stretch([1, 3, 2, 5, 4], 2)` | `9` | 5 + 4 |
| `brightest_stretch([5, 1, 1, 1, 9], 3)` | `11` | 1 + 1 + 9 |
| `brightest_stretch([4, 4, 4], 1)` | `4` | |
--- hints
- `sum(lights[i:i + k])` is the total of the `k` displays starting at position `i`. Try every start position.
- Faster: slide the window. Add the display that enters and subtract the one that leaves, instead of re-adding all `k` each time.
--- starter
def brightest_stretch(lights, k):
    # Write your code here
    pass
--- solution
def brightest_stretch(lights, k):
    window = sum(lights[:k])
    best = window
    for i in range(k, len(lights)):
        window += lights[i] - lights[i - k]
        best = max(best, window)
    return best
