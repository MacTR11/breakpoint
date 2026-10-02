--- meta
{"title": "Sorting (b): bubble sort, largest first", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Bubble sort", "points": 20, "track": "exam", "specRef": "2.3.1", "functionName": "bubble_descending", "banned": ["sorted(", ".sort(", "reversed(", "[::-1]"],
  "tests": [
    {"args": [[3, 9, 1, 7]], "expected": [9, 7, 3, 1]},
    {"args": [[5]], "expected": [5]},
    {"args": [[]], "expected": []},
    {"args": [[2, 2, 1, 3, 3]], "expected": [3, 3, 2, 2, 1], "hidden": true},
    {"args": [[9, 8, 7, 6]], "expected": [9, 8, 7, 6], "hidden": true},
    {"args": [[1, 2, 3, 4, 5, 6]], "expected": [6, 5, 4, 3, 2, 1], "hidden": true},
    {"args": [[0, -4, 12, -4, 7]], "expected": [12, 7, 0, -4, -4], "hidden": true}
  ]
}
--- description
A leaderboard needs scores sorted into **descending** order, largest first.

Write the function `bubble_descending(scores)`, which uses a bubble sort to sort the list and returns it. Your sort must stop early if a complete pass makes no swaps.

Write the algorithm yourself: do not use `sorted`, `sort`, or reverse the list.

For example, `bubble_descending([3, 9, 1, 7])` returns `[9, 7, 3, 1]`.

**[6 marks]**
--- hints
- Bubble sort compares each pair of neighbours. For descending order, swap when the left one is **smaller** than the right one.
- Use a Boolean `swapped`. Set it to `False` at the start of each pass and to `True` whenever you swap. Keep making passes `while swapped`.
--- starter
def bubble_descending(scores):
    pass
--- solution
def bubble_descending(scores):
    swapped = True
    while swapped:
        swapped = False
        for i in range(len(scores) - 1):
            if scores[i] < scores[i + 1]:
                temp = scores[i]
                scores[i] = scores[i + 1]
                scores[i + 1] = temp
                swapped = True
    return scores
--- explanation
One mark each, up to 6:

- An outer loop that repeats passes over the list.
- An inner loop that visits each pair of neighbours without going past the end.
- The comparison is the right way round for descending order.
- The two elements are swapped correctly (for example using a temporary variable).
- A flag records whether a pass made any swaps.
- The sort stops when a pass makes no swaps, and the sorted list is returned.
