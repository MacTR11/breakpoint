--- meta
{"contest": "upper-sixth-challenge", "title": "Put in order: combine two sorted lists", "kind": "CODE", "style": "ORDER", "difficulty": "HARD", "topic": "Merge", "points": 20, "track": "sorting", "specRef": "2.3.1", "functionName": "combine_sorted",
  "tests": [
    {"args": [[1, 4, 9], [2, 3, 10]], "expected": [1, 2, 3, 4, 9, 10]},
    {"args": [[], [1, 2]], "expected": [1, 2]},
    {"args": [[5], []], "expected": [5]},
    {"args": [[1, 1], [1]], "expected": [1, 1, 1], "hidden": true},
    {"args": [[2, 4, 6, 8], [1, 3]], "expected": [1, 2, 3, 4, 6, 8], "hidden": true},
    {"args": [[-3, 0], [-5, 7]], "expected": [-5, -3, 0, 7], "hidden": true}
  ]
}
--- description
The lines below make a working function, but they have been shuffled, and there is a line that does not belong. Leave it out with ✕. Drag them into order (or use the arrow buttons) so that `combine_sorted(a, b)` takes two lists that are each in ascending order and returns one list of all their items in ascending order, the way a merge sort merges.

Each line already has its indentation, so you only need to get the order right.
--- hints
- Two counters, i and j, start at the front of each list. Each time round, the smaller of `a[i]` and `b[j]` goes on the result and its counter moves on.
- The loop must stop as soon as **either** list runs out, so both conditions must be true to carry on. Whatever is left in the other list goes on the end.
--- starter
            i = i + 1
    result = []
            j = j + 1
    result = result + a[i:] + b[j:]
    i = 0
    j = 0
    while i < len(a) or j < len(b):
def combine_sorted(a, b):
            result.append(b[j])
    while i < len(a) and j < len(b):
    return result
        if a[i] <= b[j]:
        else:
            result.append(a[i])
--- solution
def combine_sorted(a, b):
    result = []
    i = 0
    j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            result.append(a[i])
            i = i + 1
        else:
            result.append(b[j])
            j = j + 1
    result = result + a[i:] + b[j:]
    return result
