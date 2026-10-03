--- meta
{
  "title": "Bubble Sort Swap Counter",
  "kind": "CODE",
  "difficulty": "MEDIUM",
  "topic": "Algorithms",
  "points": 25,
  "track": "sorting", "specRef": "2.3.1",
  "functionName": "bubble_swaps",
  "tests": [
    { "args": [[3, 1, 2]], "expected": 2 },
    { "args": [[1, 2, 3]], "expected": 0 },
    { "args": [[5, 2, 8, 1, 4]], "expected": 6 },
    { "args": [[]], "expected": 0, "hidden": true },
    { "args": [[4, 3, 2, 1]], "expected": 6, "hidden": true },
    { "args": [[1]], "expected": 0, "hidden": true },
    { "args": [[2, 2, 1]], "expected": 2, "hidden": true },
    { "args": [[1, 3, 2, 4, 6, 5]], "expected": 2, "hidden": true },
    { "args": [[9, 7, 5, 3, 1, 0]], "expected": 15, "hidden": true }
  ]
}
--- description
Bubble sort repeatedly passes through a list comparing neighbours, and **swaps** them when the left one is larger than the right one. It stops when a full pass makes no swaps.

Write a function `bubble_swaps(numbers)` that returns the **total number of swaps** bubble sort makes when sorting `numbers` into ascending order.

Equal neighbours are not swapped.

### Examples

| Call | Returns | Why |
| --- | --- | --- |
| `bubble_swaps([3, 1, 2])` | `2` | 3↔1, then 3↔2 |
| `bubble_swaps([1, 2, 3])` | `0` | already sorted |
| `bubble_swaps([5, 2, 8, 1, 4])` | `6` | |
--- hints
- Write a normal bubble sort and add 1 to a counter each time two items are swapped.
- Work on a copy (`items = list(numbers)`), and keep making passes until a whole pass makes no swaps.
--- starter
def bubble_swaps(numbers):
    # Write your code here
    pass
--- solution
def bubble_swaps(numbers):
    items = list(numbers)
    swaps = 0
    swapped = True
    while swapped:
        swapped = False
        for i in range(len(items) - 1):
            if items[i] > items[i + 1]:
                items[i], items[i + 1] = items[i + 1], items[i]
                swaps += 1
                swapped = True
    return swaps
