--- meta
{
  "title": "Quick sort partition", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Sorting", "points": 25, "track": "sorting", "specRef": "2.3.1",
  "functionName": "partition",
  "tests": [
    { "args": [[5, 2, 8, 1, 9]], "expected": [[2, 1], 5, [8, 9]] },
    { "args": [[3]], "expected": [[], 3, []] },
    { "args": [[1, 2, 3]], "expected": [[], 1, [2, 3]] },
    { "args": [[4, 4, 1]], "expected": [[1], 4, [4]], "hidden": true },
    { "args": [[9, 7, 8]], "expected": [[7, 8], 9, []], "hidden": true },
    { "args": [[6, 3, 9, 1, 8, 2]], "expected": [[3, 1, 2], 6, [9, 8]], "hidden": true },
    { "args": [[0, -1, 1]], "expected": [[-1], 0, [1]], "hidden": true }
  ]
}
--- description
Quick sort works by choosing a **pivot**, then splitting the rest of the list into the items smaller than the pivot and the items that are not. It then sorts each part the same way.

Write a function `partition(items)` that performs one split, using the **first item** as the pivot. Return a list of three things: `[smaller, pivot, others]`.

- `smaller` is a list of the items less than the pivot.
- `others` is a list of the remaining items (greater than or equal to the pivot).
- Both keep their items in the original order.

The list always contains at least one item.

### Examples

| Call | Returns |
| --- | --- |
| `partition([5, 2, 8, 1, 9])` | `[[2, 1], 5, [8, 9]]` |
| `partition([3])` | `[[], 3, []]` |

### Next step

Once this works, a full quick sort is three lines: partition, then sort `smaller` and `others` recursively and join the pieces.
--- hints
- The pivot is `items[0]`. Loop over the rest with `items[1:]`.
- Append each item to one of two new lists depending on whether it is less than the pivot, then return `[smaller, pivot, others]`.
--- starter
def partition(items):
    # Write your code here
    pass
--- solution
def partition(items):
    pivot = items[0]
    smaller = []
    others = []
    for item in items[1:]:
        if item < pivot:
            smaller.append(item)
        else:
            others.append(item)
    return [smaller, pivot, others]
