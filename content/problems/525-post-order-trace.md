--- meta
{ "title": "Post-order Traversal", "kind": "PUZZLE", "difficulty": "HARD", "topic": "Trees", "points": 15, "track": "structures", "specRef": "1.4.2",
  "options": ["M F C H T P W", "C F H M P T W", "C H F P W T M", "M F T C H P W"], "answer": 2 }
--- description
```
        M
      /   \
     F     T
    / \   / \
   C   H P   W
```

In what order are the nodes visited by a **post-order** traversal of this tree?
--- hints
- Post-order means: left subtree, right subtree, then the node. So the root is always visited last.
- Deal with F's subtree completely before touching T's subtree.
--- explanation
Post-order visits the left subtree, then the right subtree, then the node itself, so a node is always visited *after* everything beneath it.

- Left subtree of M: C, H, then F
- Right subtree of M: P, W, then T
- Finally M

The order is **C H F P W T M**.

The other answers are the other traversals: M F C H T P W is pre-order, C F H M P T W is in-order, and M F T C H P W is breadth-first.
