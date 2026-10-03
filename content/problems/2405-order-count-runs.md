--- meta
{"contest": "trace-race", "title": "Put in order: count the runs", "kind": "CODE", "style": "ORDER", "difficulty": "MEDIUM", "topic": "Lists", "points": 10, "track": "lists", "specRef": "2.2.1", "functionName": "count_runs",
  "tests": [
    {"args": [[1, 1, 2, 2, 2, 1]], "expected": 3},
    {"args": [[]], "expected": 0},
    {"args": [[5]], "expected": 1},
    {"args": [[1, 2, 3]], "expected": 3, "hidden": true},
    {"args": [["a", "a", "a"]], "expected": 1, "hidden": true},
    {"args": [[3, 3, 1, 1, 3]], "expected": 3, "hidden": true}
  ]
}
--- description
The lines below make a working function, but they have been shuffled, and there is a line that does not belong. Leave it out with ✕. Drag them into order (or use the arrow buttons) so that `count_runs(items)` returns how many runs of equal neighbours the list has: `[1, 1, 2, 2, 2, 1]` has three runs (1s, 2s, then 1). An empty list has none.

Each line already has its indentation, so you only need to get the order right.
--- hints
- An empty list has no runs, so check for that first. Otherwise there is at least one run.
- A new run starts wherever an item is **different** from the one before it.
--- starter
    return runs
    for i in range(1, len(items)):
def count_runs(items):
            runs = runs + 1
    runs = 1
    if len(items) == 0:
        if items[i] != items[i - 1]:
        if items[i] == items[i - 1]:
        return 0
--- solution
def count_runs(items):
    if len(items) == 0:
        return 0
    runs = 1
    for i in range(1, len(items)):
        if items[i] != items[i - 1]:
            runs = runs + 1
    return runs
