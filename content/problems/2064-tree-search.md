--- meta
{"title": "Binary tree (d): search it", "kind": "CODE", "difficulty": "MEDIUM", "topic": "Trees", "points": 20, "track": "exam", "specRef": "1.4.2", "functionName": "tree_contains",
  "tests": [
    {"args": [[[1, 50, 2], [-1, 30, 3], [-1, 70, -1], [-1, 40, -1]], 0, 40], "expected": true},
    {"args": [[[1, 50, 2], [-1, 30, 3], [-1, 70, -1], [-1, 40, -1]], 0, 45], "expected": false},
    {"args": [[[-1, 8, -1]], 0, 8], "expected": true},
    {"args": [[[1, 50, 2], [-1, 30, 3], [-1, 70, -1], [-1, 40, -1]], -1, 50], "expected": false, "hidden": true},
    {"args": [[[1, "m", 2], [3, "f", 4], [5, "t", -1], [-1, "b", -1], [-1, "h", -1], [-1, "p", -1]], 0, "p"], "expected": true, "hidden": true},
    {"args": [[[1, "m", 2], [3, "f", 4], [5, "t", -1], [-1, "b", -1], [-1, "h", -1], [-1, "p", -1]], 0, "q"], "expected": false, "hidden": true},
    {"args": [[[-1, 1, 1], [-1, 2, 2], [-1, 3, 3], [-1, 4, -1]], 0, 4], "expected": true, "hidden": true},
    {"args": [[[1, 50, 2], [-1, 30, 3], [-1, 70, -1], [-1, 40, -1]], 0, 70], "expected": true, "hidden": true},
    {"args": [[[-1, 1, 1], [-1, 2, 2], [-1, 3, 3], [-1, 4, -1]], 0, 0], "expected": false, "hidden": true}
  ]
}
--- description
A binary search tree is stored in a two-dimensional array called `tree`. Each element is `[left, data, right]`, where `left` and `right` are the indexes of the node's children, or `-1` where there is no child. The integer `root` is the index of the root node, or `-1` if the tree is empty.

For example, with

```python
tree = [[1, 50, 2], [-1, 30, 3], [-1, 70, -1], [-1, 40, -1]]
root = 0
```

50 is the root, 30 and 70 are its children, and 40 is the right child of 30.

Because it is a binary **search** tree, every item in a node's left subtree is smaller than the node, and every item in its right subtree is larger.

Write the function `tree_contains(tree, root, target)`, which returns `True` if `target` is in the tree and `False` if it is not. It must use the ordering of the tree to decide which way to go at each node, rather than visiting every node.

**[5 marks]**
--- hints
- Keep the index of the current node in a variable, starting at `root`. Loop while it is not `-1`.
- At each node there are three cases: the data equals the target (return `True`), the target is smaller (move to the left child), or the target is larger (move to the right child).
--- starter
def tree_contains(tree, root, target):
    pass
--- solution
def tree_contains(tree, root, target):
    current = root
    while current != -1:
        if tree[current][1] == target:
            return True
        if target < tree[current][1]:
            current = tree[current][0]
        else:
            current = tree[current][2]
    return False
--- explanation
One mark each, up to 5:

- Starts at the root and repeats until a `-1` pointer is reached (by a loop or by recursion).
- Returns `True` when the current node's data equals the target.
- Moves to the left child when the target is smaller.
- Moves to the right child when the target is larger.
- Returns `False` when it runs out of nodes.
