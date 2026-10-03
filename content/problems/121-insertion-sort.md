--- meta
{
  "title": "Write an Insertion Sort", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Sorting", "points": 25, "track": "sorting", "specRef": "2.3.1",
  "functionName": "insertion_sort", "banned": ["sorted(", ".sort("],
  "tests": [
    { "args": [[3, 1, 2]], "expected": [1, 2, 3] },
    { "args": [[]], "expected": [] },
    { "args": [[1]], "expected": [1] },
    { "args": [[5, 4, 3, 2, 1]], "expected": [1, 2, 3, 4, 5], "hidden": true },
    { "args": [[2, 2, 1]], "expected": [1, 2, 2], "hidden": true },
    { "args": [[4, -1, 0, 9, -7]], "expected": [-7, -1, 0, 4, 9], "hidden": true },
    { "args": [[1, 2, 3]], "expected": [1, 2, 3], "hidden": true }
  ]
}
--- description
Write a function `insertion_sort(items)` that returns the list sorted into ascending order, using the **insertion sort** algorithm.

Insertion sort keeps a sorted section at the left of the list. It takes each remaining item in turn and inserts it into its correct place in the sorted section, shifting larger items one place to the right to make room.

`sorted()` and `.sort()` are not allowed.

### Examples

| Call | Returns |
| --- | --- |
| `insertion_sort([3, 1, 2])` | `[1, 2, 3]` |
| `insertion_sort([])` | `[]` |
--- hints
- The outer loop goes through positions 1 to the end. For each one, save the item in a variable such as `current`.
- Use an inner `while` loop with `j` starting just left of `current`: while `j >= 0` and `items[j] > current`, copy `items[j]` one place right and move `j` left. Then put `current` at `j + 1`.
--- starter
def insertion_sort(items):
    # Write your code here
    pass
--- solution
def insertion_sort(items):
    items = list(items)
    for i in range(1, len(items)):
        current = items[i]
        j = i - 1
        while j >= 0 and items[j] > current:
            items[j + 1] = items[j]
            j -= 1
        items[j + 1] = current
    return items
