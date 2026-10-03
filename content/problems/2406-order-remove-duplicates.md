--- meta
{"contest": "trace-race", "title": "Put in order: remove duplicates", "kind": "CODE", "style": "ORDER", "difficulty": "EASY", "topic": "Lists", "points": 5, "track": "lists", "specRef": "2.2.1", "functionName": "remove_duplicates",
  "tests": [
    {"args": [[1, 2, 1, 3, 2]], "expected": [1, 2, 3]},
    {"args": [[]], "expected": []},
    {"args": [["a", "b", "a"]], "expected": ["a", "b"]},
    {"args": [[4, 4, 4]], "expected": [4], "hidden": true},
    {"args": [[1, 2, 3]], "expected": [1, 2, 3], "hidden": true}
  ]
}
--- description
The lines below make a working function, but they have been shuffled, and there is a line that does not belong. Leave it out with ✕. Drag them into order (or use the arrow buttons) so that `remove_duplicates(items)` returns a new list with each item once, in the order it first appeared.

Each line already has its indentation, so you only need to get the order right.
--- hints
- Build a new list, and only add an item if it is not in the new list already.
- Nothing is taken out of any list, so the spare line is the one that removes.
--- starter
    for item in items:
    return seen
            seen.remove(item)
    seen = []
        if item not in seen:
            seen.append(item)
def remove_duplicates(items):
--- solution
def remove_duplicates(items):
    seen = []
    for item in items:
        if item not in seen:
            seen.append(item)
    return seen
