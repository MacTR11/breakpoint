--- meta
{"title": "Binary tree (c): in-order traversal", "kind": "CODE", "difficulty": "HARD", "topic": "Trees", "points": 40, "track": "exam", "specRef": "1.4.2", "functionName": "in_order",
  "tests": [
    {"args": [[[1, 50, 2], [-1, 30, 3], [-1, 70, -1], [-1, 40, -1]], 0], "expected": [30, 40, 50, 70]},
    {"args": [[[-1, 8, -1]], 0], "expected": [8]},
    {"args": [[[-1, 1, 1], [-1, 2, 2], [-1, 3, 3], [-1, 4, -1]], 0], "expected": [1, 2, 3, 4]},
    {"args": [[[1, 50, 2], [-1, 30, 3], [-1, 70, -1], [-1, 40, -1]], -1], "expected": [], "hidden": true},
    {"args": [[[1, "m", 2], [3, "f", 4], [5, "t", -1], [-1, "b", -1], [-1, "h", -1], [-1, "p", -1]], 0], "expected": ["b", "f", "h", "m", "p", "t"], "hidden": true},
    {"args": [[[1, "m", 2], [3, "f", 4], [5, "t", -1], [-1, "b", -1], [-1, "h", -1], [-1, "p", -1]], 1], "expected": ["b", "f", "h"], "hidden": true},
    {"args": [[[1, 50, 2], [-1, 30, 3], [-1, 70, -1], [-1, 40, -1]], 1], "expected": [30, 40], "hidden": true}
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

Write a **recursive** function `in_order(tree, root)`, which returns a list of the data in the tree in the order an in-order traversal visits it: the left subtree, then the node, then the right subtree.

For the example above it returns `[30, 40, 50, 70]`. An empty tree gives `[]`.

**[6 marks]**
--- hints
- The base case is `root == -1`: there is no node here, so return an empty list.
- Otherwise the answer is three lists joined together: the in-order traversal of the left child, then `[tree[root][1]]`, then the in-order traversal of the right child.
- The left child's index is `tree[root][0]` and the right child's is `tree[root][2]`.
--- starter
def in_order(tree, root):
    pass
--- solution
def in_order(tree, root):
    if root == -1:
        return []
    left = in_order(tree, tree[root][0])
    right = in_order(tree, tree[root][2])
    return left + [tree[root][1]] + right
--- explanation
One mark each, up to 6:

- A base case for a pointer of `-1`.
- The base case returns nothing (an empty list).
- A recursive call on the left child's index.
- A recursive call on the right child's index.
- The node's own data is placed between the two results: left, node, right.
- The combined list is returned.
