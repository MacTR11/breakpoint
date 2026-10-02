--- meta
{
  "title": "Write a Merge Sort", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Sorting", "points": 20, "track": "sorting", "specRef": "2.3.1",
  "functionName": "merge_sort", "banned": ["sorted(", ".sort("],
  "tests": [
    { "args": [[3, 1, 2]], "expected": [1, 2, 3] },
    { "args": [[]], "expected": [] },
    { "args": [[1]], "expected": [1] },
    { "args": [[5, 4, 3, 2, 1]], "expected": [1, 2, 3, 4, 5], "hidden": true },
    { "args": [[2, 2, 1]], "expected": [1, 2, 2], "hidden": true },
    { "args": [[9, -1, 4, 0, 7, 3, 8, 2]], "expected": [-1, 0, 2, 3, 4, 7, 8, 9], "hidden": true },
    { "args": [[1, 2, 3, 4]], "expected": [1, 2, 3, 4], "hidden": true }
  ]
}
--- description
Merge sort is a **divide and conquer** algorithm:

1. If the list has 0 or 1 items, it is already sorted.
2. Otherwise split it into two halves.
3. Sort each half (by merge sort: this is the recursive step).
4. Merge the two sorted halves into one sorted list.

Write a function `merge_sort(items)` that returns the items sorted into ascending order. `sorted()` and `.sort()` are not allowed.

### Examples

| Call | Returns |
| --- | --- |
| `merge_sort([3, 1, 2])` | `[1, 2, 3]` |
| `merge_sort([])` | `[]` |

### Note

You can define a helper function for the merge step above `merge_sort` in the same file.
--- hints
- Base case: a list of 0 or 1 items is already sorted, so return it.
- Otherwise split at `middle = len(items) // 2`, sort `items[:middle]` and `items[middle:]` with recursive calls, and merge the two results with a helper function.
--- starter
def merge_sort(items):
    # Write your code here
    pass
--- solution
def merge(left, right):
    result = []
    i = 0
    j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    return result + left[i:] + right[j:]


def merge_sort(items):
    if len(items) <= 1:
        return list(items)
    middle = len(items) // 2
    return merge(merge_sort(items[:middle]), merge_sort(items[middle:]))
