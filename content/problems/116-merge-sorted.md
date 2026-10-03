--- meta
{
  "title": "Merge two sorted lists", "kind": "CODE", "difficulty": "EASY", "topic": "Sorting", "points": 10, "track": "sorting", "specRef": "2.3.1",
  "functionName": "merge", "banned": ["sorted(", ".sort("],
  "tests": [
    { "args": [[1, 4, 9], [2, 3, 10]], "expected": [1, 2, 3, 4, 9, 10] },
    { "args": [[], [1]], "expected": [1] },
    { "args": [[5], [5]], "expected": [5, 5] },
    { "args": [[], []], "expected": [], "hidden": true },
    { "args": [[1, 2, 3], []], "expected": [1, 2, 3], "hidden": true },
    { "args": [[1, 1, 1], [1, 1]], "expected": [1, 1, 1, 1, 1], "hidden": true },
    { "args": [[-3, 0], [-5, -1, 7]], "expected": [-5, -3, -1, 0, 7], "hidden": true }
  ]
}
--- description
The heart of merge sort is the **merge** step: combining two lists that are already sorted into one sorted list.

Write a function `merge(left, right)` that takes two sorted lists and returns a single sorted list containing every item from both.

Do it the way merge sort does: repeatedly compare the front items of the two lists and take the smaller. `sorted()` and `.sort()` are not allowed.

### Examples

| Call | Returns |
| --- | --- |
| `merge([1, 4, 9], [2, 3, 10])` | `[1, 2, 3, 4, 9, 10]` |
| `merge([], [1])` | `[1]` |
--- hints
- Keep an index into each list, `i` and `j`, both starting at 0. Compare `left[i]` with `right[j]`, append the smaller and move that index on.
- The loop stops when **one** list runs out. Whatever is left in the other is already sorted, so add it to the end: `left[i:]` and `right[j:]`.
--- starter
def merge(left, right):
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
