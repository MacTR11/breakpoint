--- meta
{ "title": "First Partition", "kind": "PUZZLE", "difficulty": "HARD", "topic": "Sorting", "points": 20, "track": "sorting", "specRef": "2.3.1", "contest": "algorithms-showdown",
  "options": ["1 2 3 6 8 9", "3 6 1 8 2 9", "3 1 2 6 9 8", "2 1 3 6 9 8"], "answer": 2 }
--- description
A quick sort is applied to this list, using the **first item as the pivot**:

**6 3 9 1 8 2**

The partition step places every item smaller than the pivot to its left and every larger item to its right. Within each side, the items keep the order they had in the original list.

What is the list after this **first partition**?
--- hints
- The pivot is 6. Go through the other items in order and decide which side each one belongs on.
- Items keep their original order within each side: this is a partition, not a full sort.
--- explanation
The pivot is 6.

- Smaller than 6, in their original order: 3, 1, 2
- Larger than 6, in their original order: 9, 8

Putting them either side of the pivot gives **3 1 2 6 9 8**.

The pivot is now in its final position. Quick sort then partitions `3 1 2` and `9 8` separately, in the same way.
