--- meta
{"title": "Fix: the merge step", "kind": "CODE", "style": "FIX", "difficulty": "HARD", "topic": "Sorting algorithm", "points": 40, "track": "debugging", "specRef": "2.3.1", "functionName": "merge", "banned": ["sorted(", ".sort("],
  "tests": [
    {"args": [[1, 4, 9], [2, 3, 10]], "expected": [1, 2, 3, 4, 9, 10]},
    {"args": [[], [1]], "expected": [1]},
    {"args": [[5], [5]], "expected": [5, 5]},
    {"args": [[], []], "expected": [], "hidden": true},
    {"args": [[1, 2, 3], []], "expected": [1, 2, 3], "hidden": true},
    {"args": [[-3, 0], [-5, -1, 7]], "expected": [-5, -3, -1, 0, 7], "hidden": true},
    {"args": [[2], [1]], "expected": [1, 2], "hidden": true}
  ]
}
--- description
`merge(left, right)` takes two sorted lists and should return one sorted list containing every item from both. It is the heart of merge sort.

There are **two** bugs: the wrong items are being taken, and some are being lost altogether.

Fix the code in the editor so that every test passes. Change as little as you need to.
--- hints
- When an item is taken from `right`, which index should move on?
- The loop ends as soon as **one** list is used up. Whatever is left in the other list never gets added to the result.
--- starter
def merge(left, right):
    result = []
    i = 0
    j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i = i + 1
        else:
            result.append(right[j])
            i = i + 1
    return result
--- solution
def merge(left, right):
    result = []
    i = 0
    j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i = i + 1
        else:
            result.append(right[j])
            j = j + 1
    return result + left[i:] + right[j:]
