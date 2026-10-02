--- meta
{
  "title": "Counting Binary Search", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Searching", "points": 25, "track": "searching", "specRef": "2.3.1", "contest": "algorithms-showdown",
  "functionName": "search_steps",
  "tests": [
    { "args": [[1, 3, 5, 7, 9, 11, 13], 7], "expected": 1 },
    { "args": [[1, 3, 5, 7, 9, 11, 13], 1], "expected": 3 },
    { "args": [[1, 3, 5, 7, 9, 11, 13], 4], "expected": 3 },
    { "args": [[1, 3, 5, 7, 9, 11, 13], 13], "expected": 3, "hidden": true },
    { "args": [[], 5], "expected": 0, "hidden": true },
    { "args": [[5], 5], "expected": 1, "hidden": true },
    { "args": [[2, 4], 4], "expected": 2, "hidden": true },
    { "args": [[2, 4], 1], "expected": 1, "hidden": true },
    { "args": [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 16], "expected": 5, "hidden": true }
  ]
}
--- description
How much work does a binary search actually do?

Write a function `search_steps(items, target)` that carries out a binary search on the sorted list `items` and returns the **number of items it examines** before it either finds the target or runs out of list.

Use exactly this version of the algorithm so that your count matches:

```
low = 0
high = length of items − 1
while low <= high
    mid = (low + high) DIV 2
    examine items[mid]
    if it is the target, stop
    if it is less than the target, low = mid + 1
    otherwise high = mid − 1
```

### Examples

With `items = [1, 3, 5, 7, 9, 11, 13]`:

| Target | Returns | Items examined |
| --- | --- | --- |
| `7` | `1` | 7 |
| `1` | `3` | 7, 3, 1 |
| `4` | `3` | 7, 3, 5, then nothing left |
--- hints
- Write an ordinary binary search and add 1 to a counter every time you look at `items[mid]`.
- Count the look **before** checking whether it is the target, so that finding it straight away counts as 1.
--- starter
def search_steps(items, target):
    # Write your code here
    pass
--- solution
def search_steps(items, target):
    low = 0
    high = len(items) - 1
    steps = 0
    while low <= high:
        mid = (low + high) // 2
        steps += 1
        if items[mid] == target:
            break
        elif items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return steps
