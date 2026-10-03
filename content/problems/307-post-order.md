--- meta
{
  "title": "Binary search tree: post-order", "kind": "CODE", "difficulty": "HARD", "topic": "Trees", "points": 50, "track": "structures", "specRef": "1.4.2",
  "functionName": "post_order",
  "tests": [
    { "args": [[5, 3, 8, 1, 4]], "expected": [1, 4, 3, 8, 5] },
    { "args": [[1, 2, 3]], "expected": [3, 2, 1] },
    { "args": [[]], "expected": [] },
    { "args": [[2, 1, 3]], "expected": [1, 3, 2], "hidden": true },
    { "args": [[8, 3, 10, 1, 6, 14, 4, 7, 13]], "expected": [1, 4, 7, 6, 3, 13, 14, 10, 8], "hidden": true },
    { "args": [[5]], "expected": [5], "hidden": true },
    { "args": [["m", "f", "t", "c", "h", "p", "w"]], "expected": ["c", "h", "f", "p", "w", "t", "m"], "hidden": true }
  ]
}
--- description
Write a function `post_order(values)` that:

1. builds a **binary search tree** by inserting the values one at a time, in the order given
2. returns the values in the order a **post-order** (depth-first) traversal visits them.

To insert into a binary search tree, start at the root: go **left** if the new value is smaller than the node, **right** if it is larger, and keep going until you reach an empty position. The first value becomes the root. All the values are different.

A post-order traversal visits the **left** subtree, then the **right** subtree, then the **node** itself.

### Example

Inserting `5, 3, 8, 1, 4` builds this tree:

```
      5
     / \
    3   8
   / \
  1   4
```

`post_order([5, 3, 8, 1, 4])` returns `[1, 4, 3, 8, 5]`.
--- hints
- Represent a node as a small class with `value`, `left` and `right`. Write a recursive `insert(node, value)` that returns the node.
- The traversal is three lines: traverse the left child, traverse the right child, then append the node's own value.
--- starter
def post_order(values):
    # Write your code here
    pass
--- solution
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def insert(node, value):
    if node is None:
        return Node(value)
    if value < node.value:
        node.left = insert(node.left, value)
    else:
        node.right = insert(node.right, value)
    return node


def traverse(node, visited):
    if node is not None:
        traverse(node.left, visited)
        traverse(node.right, visited)
        visited.append(node.value)


def post_order(values):
    root = None
    for value in values:
        root = insert(root, value)
    visited = []
    traverse(root, visited)
    return visited
