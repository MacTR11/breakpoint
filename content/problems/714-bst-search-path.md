--- meta
{"title": "Searching a Tree", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Binary search trees", "points": 10, "track": "structures", "specRef": "1.4.2", "contest": "structures-derby", "options": ["50, 30, 40", "50, 70, 60", "50, 30, 20, 40", "50, 40"], "answer": 0}
--- description
This binary search tree is searched for the value **45**, which is not in it.

```
        50
      /    \
    30      70
   /  \    /  \
  20  40  60  80
            \
            65
```

Which nodes are examined before the search concludes that 45 is missing?
--- hints
- At each node go left if the target is smaller, right if it is larger.
- The search ends when it needs to move to a child that does not exist.
--- explanation
- 45 is less than **50**, so go left.
- 45 is greater than **30**, so go right.
- 45 is greater than **40**, so go right. But 40 has no right child, so 45 cannot be in the tree.

The nodes examined are **50, 30, 40**: three comparisons to rule out a value among eight nodes.
