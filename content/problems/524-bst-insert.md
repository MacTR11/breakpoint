--- meta
{ "title": "Where Does It Go?", "kind": "PUZZLE", "difficulty": "MEDIUM", "topic": "Trees", "points": 10, "track": "structures", "specRef": "1.4.2",
  "options": ["The left child of 70", "The right child of 60", "The left child of 80", "The right child of 40"], "answer": 1 }
--- description
A binary search tree is built by inserting these values in order:

**50, 30, 70, 20, 40, 60, 80**

The value **65** is then inserted. Where does it end up?
--- hints
- Start at the root. Go left if the new value is smaller than the node, right if it is larger.
- Draw the tree for the first seven values before placing 65.
--- explanation
The first seven values build a full tree:

```
        50
      /    \
    30      70
   /  \    /  \
  20  40  60  80
```

To insert 65, start at the root and compare:

- 65 is greater than 50, so go right to 70
- 65 is less than 70, so go left to 60
- 65 is greater than 60, and 60 has no right child

So 65 becomes **the right child of 60**.
