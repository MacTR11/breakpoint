--- meta
{"title": "Linked list (a): traverse it", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Linked lists", "points": 25, "track": "exam", "specRef": "1.4.2", "functionName": "traverse",
  "tests": [
    {"args": [[["cat", 2], ["ant", 0], ["dog", -1]], 1], "expected": ["ant", "cat", "dog"]},
    {"args": [[["m", -1]], 0], "expected": ["m"]},
    {"args": [[["d", -1], ["a", 3], ["c", 0], ["b", 2], ["unused", -1]], 1], "expected": ["a", "b", "c", "d"]},
    {"args": [[["cat", 2], ["ant", 0], ["dog", -1]], -1], "expected": [], "hidden": true},
    {"args": [[["d", -1], ["a", 3], ["c", 0], ["b", 2], ["unused", -1]], 2], "expected": ["c", "d"], "hidden": true},
    {"args": [[["cat", 2], ["ant", 0], ["dog", -1]], 2], "expected": ["dog"], "hidden": true},
    {"args": [[[5, 1], [6, 2], [7, 3], [8, -1]], 0], "expected": [5, 6, 7, 8], "hidden": true}
  ]
}
--- description
A linked list is stored in a two-dimensional array called `nodes`. Each element is a pair `[data, pointer]`, where `pointer` is the index of the next node in the list, or `-1` for the last node. The integer `start` is the index of the first node, or `-1` if the list is empty.

For example, with

```python
nodes = [["cat", 2], ["ant", 0], ["dog", -1]]
start = 1
```

the list in order is ant, cat, dog.

Write the function `traverse(nodes, start)`, which returns a list of the data in every node, in the order the linked list holds them.

For the example above it returns `["ant", "cat", "dog"]`. An empty linked list gives `[]`.

**[5 marks]**
--- hints
- Use a variable `current` that starts at `start`. It holds the index of the node you are looking at.
- While `current` is not `-1`: add `nodes[current][0]` to your result, then follow the pointer with `current = nodes[current][1]`.
--- starter
def traverse(nodes, start):
    pass
--- solution
def traverse(nodes, start):
    result = []
    current = start
    while current != -1:
        result.append(nodes[current][0])
        current = nodes[current][1]
    return result
--- explanation
One mark each, up to 5:

- A pointer variable is set to `start`.
- A loop that continues until the pointer is `-1`, so an empty list is handled.
- The data of the current node is added to the output.
- The pointer is updated to the current node's pointer.
- The data is returned in list order (not array order).
