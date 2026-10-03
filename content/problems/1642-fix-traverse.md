--- meta
{"title": "Fix: the list that never ends", "kind": "CODE", "style": "FIX", "difficulty": "MEDIUM", "topic": "Infinite loops", "points": 20, "track": "debugging", "specRef": "1.4.2", "functionName": "traverse",
  "tests": [
    {"args": [[["cat", 2], ["ant", 0], ["dog", -1]], 1], "expected": ["ant", "cat", "dog"]},
    {"args": [[["m", -1]], 0], "expected": ["m"]},
    {"args": [[], -1], "expected": []},
    {"args": [[["a", 1], ["b", 2], ["c", -1]], 0], "expected": ["a", "b", "c"], "hidden": true}
  ]
}
--- description
A linked list is stored as an array of `[data, pointer]` pairs, with `-1` marking the end. `traverse(nodes, start)` should return the data in list order, starting at index `start` (`-1` for an empty list).

It never finishes. There is **one** bug.
--- hints
- Watch `current` as the loop runs. Does it ever change?
- The loop reads the next pointer but never moves along it: `current` must be set to `nodes[current][1]`.
--- starter
def traverse(nodes, start):
    result = []
    current = start
    while current != -1:
        result.append(nodes[current][0])
        next_node = nodes[current][1]
    return result
--- solution
def traverse(nodes, start):
    result = []
    current = start
    while current != -1:
        result.append(nodes[current][0])
        current = nodes[current][1]
    return result
