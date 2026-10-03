--- meta
{
  "title": "Insertion sort, pass by pass", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Sorting", "points": 25, "track": "sorting", "specRef": "2.3.1",
  "functionName": "insertion_passes",
  "tests": [
    { "args": [[3, 1, 2]], "expected": [[1, 3, 2], [1, 2, 3]] },
    { "args": [[2, 1]], "expected": [[1, 2]] },
    { "args": [[1]], "expected": [] },
    { "args": [[]], "expected": [], "hidden": true },
    { "args": [[5, 2, 4, 6, 1, 3]], "expected": [[2, 5, 4, 6, 1, 3], [2, 4, 5, 6, 1, 3], [2, 4, 5, 6, 1, 3], [1, 2, 4, 5, 6, 3], [1, 2, 3, 4, 5, 6]], "hidden": true },
    { "args": [[1, 2, 3]], "expected": [[1, 2, 3], [1, 2, 3]], "hidden": true },
    { "args": [[3, 3, 1]], "expected": [[3, 3, 1], [1, 3, 3]], "hidden": true }
  ]
}
--- description
Insertion sort builds a sorted section at the left of the list. On each pass it takes the next item and inserts it into the correct place within that sorted section.

- Pass 1 inserts the item at index 1.
- Pass 2 inserts the item at index 2.
- …and so on to the end of the list.

Write a function `insertion_passes(items)` that returns a list showing the state of the whole list **after each pass**.

A list of `n` items takes `n − 1` passes, so a list with 0 or 1 items returns `[]`.

### Example

`insertion_passes([3, 1, 2])` returns `[[1, 3, 2], [1, 2, 3]]`

- Pass 1 inserts `1` before `3`, giving `[1, 3, 2]`
- Pass 2 inserts `2` between them, giving `[1, 2, 3]`
--- hints
- For each pass `i` from 1 upwards: remember `items[i]`, shift every larger item on its left one place to the right, then drop it into the gap.
- After each pass, append a **copy** of the list (`list(items)`) to your results. Appending `items` itself would give the same list every time.
--- starter
def insertion_passes(items):
    # Write your code here
    pass
--- solution
def insertion_passes(items):
    items = list(items)
    snapshots = []
    for i in range(1, len(items)):
        current = items[i]
        j = i - 1
        while j >= 0 and items[j] > current:
            items[j + 1] = items[j]
            j -= 1
        items[j + 1] = current
        snapshots.append(list(items))
    return snapshots
