--- meta
{
  "title": "Write a bubble sort", "kind": "CODE", "difficulty": "EASY", "topic": "Sorting", "points": 10, "track": "sorting", "specRef": "2.3.1",
  "functionName": "bubble_sort", "banned": ["sorted(", ".sort("],
  "tests": [
    { "args": [[3, 1, 2]], "expected": [1, 2, 3] },
    { "args": [[]], "expected": [] },
    { "args": [[1]], "expected": [1] },
    { "args": [[5, 4, 3, 2, 1]], "expected": [1, 2, 3, 4, 5], "hidden": true },
    { "args": [[2, 2, 1]], "expected": [1, 2, 2], "hidden": true },
    { "args": [[-1, 3, 0]], "expected": [-1, 0, 3], "hidden": true },
    { "args": [[1, 2, 3]], "expected": [1, 2, 3], "hidden": true }
  ]
}
--- description
Write a function `bubble_sort(items)` that returns the list sorted into ascending order, using the **bubble sort** algorithm.

Bubble sort passes through the list comparing each pair of neighbours and swapping them if they are in the wrong order. It repeats until a whole pass makes no swaps.

`sorted()` and `.sort()` are not allowed: the point is to write the algorithm.

### Examples

| Call | Returns |
| --- | --- |
| `bubble_sort([3, 1, 2])` | `[1, 2, 3]` |
| `bubble_sort([])` | `[]` |
--- hints
- One pass: `for i in range(len(items) - 1)`, comparing `items[i]` with `items[i + 1]` and swapping them if they are the wrong way round.
- Wrap the pass in a `while` loop controlled by a `swapped` flag: set it to `False` before each pass and `True` whenever you swap.
--- starter
def bubble_sort(items):
    # Write your code here
    pass
--- solution
def bubble_sort(items):
    items = list(items)
    swapped = True
    while swapped:
        swapped = False
        for i in range(len(items) - 1):
            if items[i] > items[i + 1]:
                items[i], items[i + 1] = items[i + 1], items[i]
                swapped = True
    return items
