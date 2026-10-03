--- meta
{
  "title": "Breadth-first tree traversal", "kind": "CODE", "difficulty": "HARD", "topic": "Trees", "points": 50, "track": "structures", "specRef": "2.3.1", "contest": "algorithms-showdown",
  "functionName": "breadth_first",
  "tests": [
    { "args": [[5, 8, 3, 4, 1]], "expected": [5, 3, 8, 1, 4] },
    { "args": [[2, 3, 1]], "expected": [2, 1, 3] },
    { "args": [[]], "expected": [] },
    { "args": [[1, 2, 3]], "expected": [1, 2, 3], "hidden": true },
    { "args": [[4, 6, 2, 7, 5, 3, 1]], "expected": [4, 2, 6, 1, 3, 5, 7], "hidden": true },
    { "args": [[8, 10, 3, 14, 6, 1, 13, 7, 4]], "expected": [8, 3, 10, 1, 6, 14, 4, 7, 13], "hidden": true },
    { "args": [["m", "t", "f", "w", "p", "h", "c"]], "expected": ["m", "f", "t", "c", "h", "p", "w"], "hidden": true },
    { "args": [[9]], "expected": [9], "hidden": true }
  ]
}
--- description
Write a function `breadth_first(values)` that:

1. builds a **binary search tree** by inserting the values one at a time, in the order given (smaller values go left, larger go right; the first value is the root; all values are different)
2. returns the values in the order a **breadth-first** traversal visits them: the root, then every node on the next level from left to right, then the level below that, and so on.

### Example

Inserting `5, 8, 3, 4, 1` builds this tree:

```
      5
     / \
    3   8
   / \
  1   4
```

`breadth_first([5, 8, 3, 4, 1])` returns `[5, 3, 8, 1, 4]`.
--- hints
- Build the tree first. A node can be a list `[value, left, right]`.
- Breadth-first uses a queue: take the node at the front, record its value, then add its left and right children (if they exist) to the back.
--- starter
def breadth_first(values):
    # Write your code here
    pass
--- solution
def breadth_first(values):
    # Each node is [value, left, right].
    root = None
    for value in values:
        if root is None:
            root = [value, None, None]
            continue
        node = root
        while True:
            side = 1 if value < node[0] else 2
            if node[side] is None:
                node[side] = [value, None, None]
                break
            node = node[side]
    visited = []
    queue = [root] if root else []
    while queue:
        node = queue.pop(0)
        visited.append(node[0])
        if node[1]:
            queue.append(node[1])
        if node[2]:
            queue.append(node[2])
    return visited
