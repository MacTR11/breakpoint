--- meta
{"title": "Linked list (b): search it", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Linked lists", "points": 20, "track": "exam", "specRef": "1.4.2", "functionName": "position_of",
  "tests": [
    {"args": [[["cat", 2], ["ant", 0], ["dog", -1]], 1, "cat"], "expected": 2},
    {"args": [[["cat", 2], ["ant", 0], ["dog", -1]], 1, "eel"], "expected": -1},
    {"args": [[["d", -1], ["a", 3], ["c", 0], ["b", 2], ["unused", -1]], 1, "d"], "expected": 4},
    {"args": [[["d", -1], ["a", 3], ["c", 0], ["b", 2], ["unused", -1]], 1, "unused"], "expected": -1, "hidden": true},
    {"args": [[["m", -1]], 0, "m"], "expected": 1, "hidden": true},
    {"args": [[["cat", 2], ["ant", 0], ["dog", -1]], -1, "ant"], "expected": -1, "hidden": true},
    {"args": [[["d", -1], ["a", 3], ["c", 0], ["b", 2], ["unused", -1]], 1, "a"], "expected": 1, "hidden": true},
    {"args": [[["cat", 2], ["ant", 0], ["dog", -1]], 1, "dog"], "expected": 3, "hidden": true}
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

Write the function `position_of(nodes, start, target)`, which follows the pointers to search the linked list for `target`. It returns the target's position **in the list**, where the first node is position 1. If the target is not in the list it returns `-1`.

For the example above, `position_of(nodes, 1, "cat")` returns `2`, because cat is the second item in the list (even though it is stored at index 0).

Nodes that are in the array but not linked into the list must not be found.

**[5 marks]**
--- hints
- This is the traversal from part (a) with a counter. Start the counter at 1 and add 1 each time you follow a pointer.
- Return the counter as soon as the current node's data equals the target. If the loop ends, return -1.
--- starter
def position_of(nodes, start, target):
    pass
--- solution
def position_of(nodes, start, target):
    current = start
    position = 1
    while current != -1:
        if nodes[current][0] == target:
            return position
        current = nodes[current][1]
        position = position + 1
    return -1
--- explanation
One mark each, up to 5:

- Starts at `start` and loops until the pointer is `-1`.
- Compares the current node's data with the target.
- Follows the pointer to the next node.
- Counts positions from 1, in step with the traversal, and returns the count when the target is found.
- Returns `-1` when the end of the list is reached without a match.
